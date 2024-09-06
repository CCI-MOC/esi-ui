import json
import concurrent.futures
from collections import defaultdict
import itertools

from django.conf import settings

from keystoneauth1 import session
from keystoneauth1 import token_endpoint
from metalsmith import _provisioner
from metalsmith import instance_config
from openstack import config
from openstack_auth import utils as auth_utils
from openstack_dashboard.api import base
from horizon.utils.memoized import memoized  # noqa

from esi import connection
from esi.lib import nodes


DEFAULT_OPENSTACK_KEYSTONE_URL = 'http://127.0.0.1/identity/v3'


@memoized
def get_session_from_token(token):
    auth_url = getattr(settings, 'OPENSTACK_KEYSTONE_URL', DEFAULT_OPENSTACK_KEYSTONE_URL)
    region = config.get_cloud_region(load_yaml_config=False,
                                     load_envvars=False,
                                     auth_type='token',
                                     token=token,
                                     auth_url=auth_url)
    return region.get_session()


@memoized
def openstackclient(request):
    return connection.ESIConnection(session=get_session_from_token(request.user.token.id))


@memoized
def esiclient(request):
    token=request.user.token.id
    insecure = settings.OPENSTACK_SSL_NO_VERIFY
    cacert = settings.OPENSTACK_SSL_CACERT
    verify = cacert if not insecure else False

    token_auth = token_endpoint.Token(
        endpoint=base.url_for(request, 'lease'),
        token=token)
    k_session = session.Session(
        auth=token_auth,
        original_ip=auth_utils.get_client_ip(request),
        verify=verify,
    )
    return connection.ESIConnection(
        session=k_session,
        region_name=request.user.services_region,
        app_name='horizon', app_version='1.0'
    )


def node_list(request):
    esi_connection = esiclient(request)
    openstack_connection = openstackclient(request)

    with concurrent.futures.ThreadPoolExecutor() as executor:
        f1 = executor.submit(esi_connection.lease.nodes)
        f2 = executor.submit(esi_connection.lease.leases)
        f3 = executor.submit(nodes.network_list, openstack_connection)
        esi_nodes = {e.id: e for e in f1.result()}
        leases = list(f2.result())
        node_networks = {nn['node'].id: nn['network_info'] for nn in f3.result()}

    lease_node_list = [(lease, esi_nodes.get(lease.resource_uuid)) for lease in leases]
    owned_node_list = [esi_nodes.get(node) for node in esi_nodes.keys() if node not in [lease.resource_uuid for lease in leases]]
    
    def duration_string(start_time, end_time):
        return start_time.replace('T', ' ', 1) + " - " + end_time.replace('T', ' ', 1)

    node_to_leases = defaultdict(list)
    for lease, e in lease_node_list:
        node_to_leases[lease.resource].append({
            'uuid': lease.resource_uuid,
            'name': lease.resource,
            'maintenance': e.maintenance if lease.status == 'active' else '',
            'provision_state': e.provision_state if lease.status == 'active' else '',
            'target_provision_state': e.target_provision_state if lease.status == 'active' else '',
            'power_state': e.power_state if lease.status == 'active' else '',
            'target_power_state': e.target_power_state if lease.status == 'active' else '', 
            'properties': [[key, value] for key, value in lease.resource_properties.items()],
            'lease_uuid': lease.id,
            'owner': lease.owner,
            'lessee': e.lessee if lease.status == 'active' else '',
            'resource_class': lease.resource_class,
            'start_time': lease.start_time,
            'end_time': lease.end_time,
            'status': lease.status,
            'lease_duration': [duration_string(lease.start_time, lease.end_time)],
            'leases': [{
                'id': lease.id, 
                'duration': duration_string(lease.start_time, lease.end_time), 
                'active': lease.status == 'active', 
                'displayText': lease.id + ' (' + duration_string(lease.start_time, lease.end_time) + ')'
            }]
        })

    for node_name, leases in node_to_leases.items():
        node_to_leases[node_name] = sorted(leases, key=lambda x: x['start_time'])

    node_infos = []
    for node_name, leases in node_to_leases.items():
        combined_leases = list(itertools.chain.from_iterable([lease['leases'] for lease in leases]))
        lease_durations = list(itertools.chain.from_iterable([lease['lease_duration'] for lease in leases]))

        first_lease = leases[0]
        first_lease['leases'] = combined_leases
        first_lease['lease_duration'] = lease_durations

        node_infos.append(first_lease)      

    for node in owned_node_list:
        node_infos.append({
            'uuid': node.id,
            'name': node.name,
            'maintenance': node.maintenance,
            'provision_state': node.provision_state,
            'target_provision_state': node.target_provision_state,
            'power_state': node.power_state,
            'target_power_state': node.target_power_state,
            'properties': [[key, value] for key, value in node.properties.items()],
            'lease_uuid': '',
            'owner': node.owner,
            'lessee': node.lessee,
            'resource_class': node.resource_class,
            'start_time': '',
            'end_time': '',
            'status': 'owned',
            'lease_duration': [],
            'leases': []
        })

    for node in node_infos:
        network_info = node_networks.get(node['uuid'])
        
        node['mac_addresses'] = []
        node['network_port_names'] = []
        node['network_names'] = []
        node['fixed_ips'] = []
        node['floating_networks'] = []
        node['floating_ips'] = []
        if node['status'] == 'active' and network_info:
            for info in network_info:
                node['mac_addresses'].append(info['baremetal_port'].address)
                node['network_port_names'].append(info['network_ports'][0].name
                                                  if len(info['network_ports']) else '')
                networks = [info['networks']['parent']] + info['networks']['trunk']
                node['network_names'].append([network.name for network in networks if network] or '')
                node['fixed_ips'].append([ip['ip_address'] for port in info['network_ports']
                                          for ip in port.fixed_ips] or '')
                node['floating_networks'].append(getattr(info['networks']['floating'], 'name', ''))
                pfws = ['%s:%s' % (pfw.internal_port, pfw.external_port)
                        for pfw in info['port_forwardings']]
                node['floating_ips'].append(getattr(info['floating_ip'], 'floating_ip_address', '')
                                            + (' (%s)' % ','.join(pfws) if pfws else ''))

    return node_infos


def deploy_node(request, node):
    token = request.user.token.id
    kwargs = json.loads(request.body.decode('utf-8'))

    provisioner = _provisioner.Provisioner(session=get_session_from_token(token))
    
    if 'ssh_keys' in kwargs:
        kwargs['config'] = instance_config.GenericConfig(ssh_keys=kwargs['ssh_keys'])
        del kwargs['ssh_keys']

    provisioner.provision_node(node, **kwargs)


def undeploy_node(request, node):
    token = request.user.token.id
    provisioner = _provisioner.Provisioner(session=get_session_from_token(token))

    provisioner.unprovision_node(node, wait=None)


def set_power_state(request, node, target):
    """
    Change the power state of the given node identified by node_id.

    @param request: The http request.
    @param node_id: Either the node name or node uuid.
    @param state: The state the node should change to. It should be one of: ["power on", "power off", "rebooting", "soft power off", "soft rebooting"]
    """
    openstackclient(request).baremetal.set_node_power_state(node=node, target=target)

    if target[0] == 's':
        target = target.split(' ', 1)[1]

    return openstackclient(request).baremetal.wait_for_node_power_state(node=node, expected_state=target)


def network_attach(request, node):
    connection = openstackclient(request)
    attach_info = json.loads(request.body.decode('utf-8'))

    return nodes.network_attach(connection, node, attach_info)


def network_detach(request, node, vif):
    connection = openstackclient(request)

    return nodes.network_detach(connection, node, port=vif)


def offer_list(request):
    offers = esiclient(request).list_offers()

    return [
        {
            'resource': offer.resource,
            'resource_class': offer.resource_class,
            'status': offer.status,
            'start_time': offer.start_time.replace('T', ' ', 1),
            'end_time': offer.end_time.replace('T', ' ', 1),
            'uuid': offer.uuid,
            'availabilities': [[avail[0].replace('T', ' ', 1), avail[1].replace('T', ' ', 1)] for avail in offer.availabilities],
            'resource_properties': [[key, value] for key, value in offer.resource_properties.items()],
        }
        for offer in offers
    ]


def offer_claim(request, offer):
    times = json.loads(request.body.decode('utf-8'))

    if times['start_time'] is None:
        del times['start_time']
    if times['end_time'] is None:
        del times['end_time']

    return esiclient(request).claim_offer(offer, **times)


def delete_lease(request, lease):
    return esiclient(request).lease.delete_lease(lease)
