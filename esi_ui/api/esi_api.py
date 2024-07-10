import json
import dateutil
import pytz
import concurrent.futures

from django.conf import settings

from esi import connection
from esi.lib import nodes

from openstack import config
from horizon.utils.memoized import memoized  # noqa


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
def esiclient(token):
    return connection.ESIConnection(session=get_session_from_token(token))


def node_list(request):
    connection = esiclient(token=request.user.token.id)

    def node_list_full_info(connection):
        """Get a list of nodes with information from Ironic and ESI-Leap

        :param connection: An ESI connection
        :type connection: :class:`~esi.connection.ESIConnection`
        :returns: A list of dictionaries containing baremetal and lease information
        """

        esi_nodes = []
        baremetal_nodes = []

        with concurrent.futures.ThreadPoolExecutor() as executor:
            f1 = executor.submit(connection.lease.nodes)
            f2 = executor.submit(connection.baremetal.nodes, details=True)
            f3 = executor.submit(connection.lease.leases)
            esi_nodes = list(f1.result())
            baremetal_nodes = list(f2.result())
            leases = list(f3.result())

        list_of_nodes = []
        for lease in leases:
            list_of_nodes.append((lease, next((e for e in esi_nodes if e.id == lease.resource_uuid), None),
                                 next((bm for bm in baremetal_nodes if bm.id == lease.resource_uuid), None)))

        return [
            {
                'uuid': lease.resource_uuid,
                'name': lease.resource,
                'maintenance': e.maintenance if lease.status == 'active' else '',
                'provision_state': e.provision_state if lease.status == 'active' else '',
                'target_provision_state': bm.target_provision_state if lease.status == 'active' else '',
                'power_state': bm.power_state if lease.status == 'active' else '',
                'target_power_state': bm.target_power_state if lease.status == 'active' else '', 
                'properties': [[key, value] for key, value in lease.resource_properties.items()],
                'lease_uuid': lease.id,
                'owner': lease.owner,
                'lessee': e.lessee if lease.status == 'active' else '',
                'resource_class': lease.resource_class,
                'start_time': lease.start_time.replace('T', ' ', 1),
                'end_time': lease.end_time.replace('T', ' ', 1),
                'status': lease.status
            }
            for lease, e, bm in list_of_nodes
        ]

    with concurrent.futures.ThreadPoolExecutor() as executor:
        f1 = executor.submit(nodes.network_list, connection)

        # node_list_full_info gives temporary functionality that will eventually end up in esi-leap
        f2 = executor.submit(node_list_full_info, connection)

        node_networks = f1.result()
        node_infos = f2.result()

    for node in node_infos:
        network_info = next((n['network_info'] for n in node_networks
                             if n['node'].id == node['uuid']), None)
        
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
                                            + ' (%s)' % ','.join(pfws) if pfws else '')

    return node_infos


def set_power_state(request, node, target):
    """
    Change the power state of the given node identified by node_id.

    @param request: The http request.
    @param node_id: Either the node name or node uuid.
    @param state: The state the node should change to. It should be one of: ["power on", "power off", "rebooting", "soft power off", "soft rebooting"]
    """
    token = request.user.token.id

    esiclient(token=token).baremetal.set_node_power_state(node=node, target=target)

    if target[0] == 's':
        target = target.split(' ', 1)[1]

    return esiclient(token=token).baremetal.wait_for_node_power_state(node=node, expected_state=target)


def offer_list(request):
    token = request.user.token.id

    offers = esiclient(token=token).list_offers()

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
    token = request.user.token.id
    times = json.loads(request.body.decode('utf-8'))

    if times['start_time'] is None:
        del times['start_time']
    if times['end_time'] is None:
        del times['end_time']

    return esiclient(token=token).claim_offer(offer, **times)


def delete_lease(request, lease):
    token = request.user.token.id

    return esiclient(token=token).lease.delete_lease(lease)