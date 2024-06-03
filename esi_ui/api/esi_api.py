import concurrent.futures

from django.conf import settings

from ironicclient.v1.client import Client as _Ironicclient
from esi import connection

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
                                     auth_url=auth_url,
                                     )
    return region.get_session()

@memoized
def esiclient(token):
    return connection.ESIConnection(session=get_session_from_token(token))

@memoized
def ironicclient(token):
    return _Ironicclient(session=get_session_from_token(token))


def node_list(request):
    token = request.user.token.id

    esi_nodes = []
    ironic_nodes = []
    with concurrent.futures.ThreadPoolExecutor() as executor:
        esi_future = executor.submit(esiclient(token).list_nodes)
        ironic_future = executor.submit(ironicclient(token).node.list, detail=True)
        esi_nodes = esi_future.result()
        ironic_nodes = ironic_future.result()

    esi_nodes.sort(key=lambda node: node.name)
    ironic_nodes.sort(key=lambda node: node.name)

    return [
        {
            "name": ironic_node.name,
            "uuid": ironic_node.uuid,
            "provision_state": ironic_node.provision_state,
            "target_provision_state": ironic_node.target_provision_state,
            "power_state": ironic_node.power_state,
            "target_power_state": ironic_node.target_power_state,
            "maintenance": ironic_node.maintenance,
            "lease_uuid": esi_node.lease_uuid,
            "owner": esi_node.owner,
            "lessee": esi_node.lessee,
            "resource_class": esi_node.resource_class,
        }
        for esi_node, ironic_node in zip(esi_nodes, ironic_nodes)
    ]


def set_power_state(request, node_id, state):
    """
    Change the power state of the given node identified by node_id.

    @param request: The http request.
    @param node_id: Either the node name or node uuid.
    @param state: The state the node should change to. It should be one of: ["power on", "power off", "reboot", "soft power off", "soft reboot"]
    """
    token = request.user.token.id
    soft = False;

    if (state[0] == "s"):
        soft = True
        state = state.split(" ", 1)[1]

    state = state.split(" ", 1)[-1];

    return ironicclient(token).node.set_power_state(node_id=node_id, state=state, soft=soft)
