import asyncio
from websockets.asyncio.server import serve
from threading import Thread
import json
import concurrent.futures
from collections import defaultdict

from django.conf import settings

from keystoneauth1 import session
from keystoneauth1.identity.v3 import token as v3_token
from metalsmith import _provisioner
from metalsmith import instance_config
from openstack import config

from esi import connection
from esi.lib import nodes


DEFAULT_OPENSTACK_KEYSTONE_URL = 'http://127.0.0.1/identity/v3'

DEFAULT_WEBSOCKET_PORT = 10000


def get_session(token, project_id):
    auth_url = getattr(settings, 'OPENSTACK_KEYSTONE_URL', DEFAULT_OPENSTACK_KEYSTONE_URL)
    region = config.get_cloud_region(load_yaml_config=False,
                                     load_envvars=False,
                                     auth_type='token',
                                     token=token,
                                     auth_url=auth_url)
    user_session = region.get_session()
    if not user_session.auth.get_access(user_session).project_scoped:
       auth = v3_token.Token(
           auth_url=auth_url,
           token=user_session.get_token(),
           project_id=project_id)
       user_session = session.Session(auth=auth)
    return user_session


def esiclient(request, from_websocket=False):
    if from_websocket:
        token = request['token']
        project_id = request['project_id']
    else:
        token = request.user.token.id
        project_id = request.user.project_id
    return connection.ESIConnection(session=get_session(token, project_id))


def node_list(request, from_websocket=False):
    connection = esiclient(request, from_websocket)

    with concurrent.futures.ThreadPoolExecutor() as executor:
        f1 = executor.submit(connection.lease.nodes)
        f2 = executor.submit(connection.lease.leases)
        f3 = executor.submit(nodes.network_list, connection)
        nodes_generator = f1.result()
        node_leases_dict = defaultdict(list)
        for lease in f2.result():
            node_leases_dict[lease.resource_uuid].append(lease)
        node_networks = {nn['node'].id: nn['network_info'] for nn in f3.result()}

    esi_nodes = []
    for node in nodes_generator:
        esi_node = {
            'uuid': node.id,
            'name': node.name,
            'maintenance': node.maintenance,
            'provision_state': node.provision_state,
            'target_provision_state': node.target_provision_state,
            'power_state': node.power_state,
            'target_power_state': node.target_power_state,
            'resource_class': node.resource_class,
            'properties': [[key, value] for key, value in node.properties.items()],
            'owner': node.owner,
            'leases': sorted((
                {
                    'uuid': lease.id,
                    'project': lease.project,
                    'start_time': lease.start_time.replace('T', ' ', 1)[0:19],
                    'end_time': lease.end_time.replace('T', ' ', 1)[0:19],
                    'status': lease.status,
                } for lease in node_leases_dict[node.id]
            ), key=lambda x: x['start_time']),
            'mac_addresses': [],
            'network_port_names': [],
            'network_names': [],
            'fixed_ips': [],
            'floating_networks': [],
            'floating_ips': [],
        }
        del node_leases_dict[node.id]

        network_info = node_networks.get(node.id)
        if network_info:
            for info in network_info:
                esi_node['mac_addresses'].append(info['baremetal_port'].address)
                esi_node['network_port_names'].append(info['network_ports'][0].name
                                                  if len(info['network_ports']) else '')
                networks = [info['networks']['parent']] + info['networks']['trunk']
                esi_node['network_names'].append([network.name for network in networks if network] or '')
                esi_node['fixed_ips'].append([ip['ip_address'] for port in info['network_ports']
                                          for ip in port.fixed_ips] or '')
                esi_node['floating_networks'].append(getattr(info['networks']['floating'], 'name', ''))
                pfws = ['%s:%s' % (pfw.internal_port, pfw.external_port)
                        for pfw in info['port_forwardings']]
                esi_node['floating_ips'].append(getattr(info['floating_ip'], 'floating_ip_address', '')
                                            + (' (%s)' % ','.join(pfws) if pfws else ''))

        esi_nodes.append(esi_node)

    for leases in node_leases_dict.values():
        esi_nodes.append(
            {
                'uuid': leases[0].resource_uuid,
                'name': leases[0].resource,
                'maintenance': '',
                'provision_state': '',
                'target_provision_state': '',
                'power_state': '',
                'target_power_state': '',
                'resource_class': leases[0].resource_class,
                'properties': [[key, value] for key, value in leases[0].properties.items()],
                'owner': leases[0].owner,
                'leases': sorted((
                    {
                        'uuid': lease.id,
                        'project': lease.project,
                        'start_time': lease.start_time.replace('T', ' ', 1)[0:19],
                        'end_time': lease.end_time.replace('T', ' ', 1)[0:19],
                        'status': lease.status,
                        'displayText': lease.id + ' (' + lease.start_time.replace('T', ' ', 1)[0:19] + ' - ' + lease.end_time.replace('T', ' ', 1)[0:19] + ')',
                    } for lease in leases
                ), key=lambda x: x['start_time']),
                'mac_addresses': [],
                'network_port_names': [],
                'network_names': [],
                'fixed_ips': [],
                'floating_networks': [],
                'floating_ips': [],
            }
        )

    return esi_nodes


def deploy_node(request, node):
    kwargs = json.loads(request.body.decode('utf-8'))

    provisioner = _provisioner.Provisioner(session=get_session(request.user.token.id, request.user.project_id))
    
    if 'ssh_keys' in kwargs:
        kwargs['config'] = instance_config.GenericConfig(ssh_keys=kwargs['ssh_keys'])
        del kwargs['ssh_keys']

    provisioner.provision_node(node, **kwargs)


def undeploy_node(request, node):
    provisioner = _provisioner.Provisioner(session=get_session(request.user.token.id, request.user.project_id))

    provisioner.unprovision_node(node, wait=None)


def set_power_state(request, node, target):
    """
    Change the power state of the given node identified by node_id.

    @param request: The http request.
    @param node_id: Either the node name or node uuid.
    @param state: The state the node should change to. It should be one of: ["power on", "power off", "rebooting", "soft power off", "soft rebooting"]
    """
    esiclient(request).baremetal.set_node_power_state(node=node, target=target)

    if target[0] == 's':
        target = target.split(' ', 1)[1]

    return esiclient(request).baremetal.wait_for_node_power_state(node=node, expected_state=target)


def network_attach(request, node):
    connection = esiclient(request)
    attach_info = json.loads(request.body.decode('utf-8'))

    return nodes.network_attach(connection, node, attach_info)


def network_detach(request, node, vif):
    connection = esiclient(request)

    return nodes.network_detach(connection, node, port=vif)


def offer_list(request):
    offers = esiclient(request).list_offers()

    return [
        {
            'project': offer.project,
            'resource': offer.resource,
            'resource_class': offer.resource_class,
            'status': offer.status,
            'start_time': offer.start_time.replace('T', ' ', 1)[0:19],
            'end_time': offer.end_time.replace('T', ' ', 1)[0:19],
            'uuid': offer.uuid,
            'availabilities': [[avail[0].replace('T', ' ', 1)[0:19], avail[1].replace('T', ' ', 1)[0:19]] for avail in offer.availabilities],
            'resource_properties': [[key, value] for key, value in offer.resource_properties.items()],
        }
        for offer in offers
    ]


def create_offer(request):
    offer_params = json.loads(request.body.decode('utf-8'))

    if offer_params['start_time'] is None:
        del offer_params['start_time']
    else:
        print(offer_params['start_time'])
    if offer_params['end_time'] is None:
        del offer_params['end_time']
    else:
        print(offer_params['end_time'])
        
    return esiclient(request).lease.create_offer(**offer_params)


def delete_offer(request, offer):
    return esiclient(request).lease.delete_offer(offer)


def offer_claim(request, offer):
    times = json.loads(request.body.decode('utf-8'))

    if times['start_time'] is None:
        del times['start_time']
    if times['end_time'] is None:
        del times['end_time']

    return esiclient(request).claim_offer(offer, **times)


def create_lease(request):
    lease_params = json.loads(request.body.decode('utf-8'))

    if lease_params['start_time'] is None:
        del lease_params['start_time']
    if lease_params['end_time'] is None:
        del lease_params['end_time']

    return esiclient(request).lease.create_lease(**lease_params)


def delete_lease(request, lease):
    return esiclient(request).lease.delete_lease(lease)


async def on_websocket_connect(websocket):
    token = await websocket.recv(decode=True)
    project_id = await websocket.recv(decode=True)
    request = {"token": token, "project_id": project_id}

    while True:
        list_of_nodes = node_list(request, from_websocket=True) 
        await websocket.send(json.dumps(list_of_nodes))
        await asyncio.sleep(10)


async def websocket_listen():
    async with serve(on_websocket_connect, 'localhost', getattr(settings, 'DEFAULT_WEBSOCKET_PORT', DEFAULT_WEBSOCKET_PORT)):
        await asyncio.get_running_loop().create_future()


Thread(target=asyncio.run, args=(websocket_listen(),)).start()
