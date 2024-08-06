from django.views import generic

from esi_ui.api import esi_api

from openstack_dashboard.api.rest import urls

from openstack_dashboard.api.rest import utils as rest_utils


LOGICAL_NAME_PATTERN = '[a-zA-Z0-9-._~]+'


@urls.register
class Nodes(generic.View):

    url_regex = r'esi/nodes/$'

    @rest_utils.ajax()
    def get(self, request):
        nodes = esi_api.node_list(request)
        return {
            'nodes': nodes
        }


@urls.register
class Deploy(generic.View):

    url_regex = r'esi/nodes/(?P<node>{})/deploy/$'.format(LOGICAL_NAME_PATTERN)

    @rest_utils.ajax(data_required=True)
    def put(self, request, node):
        esi_api.deploy_node(request, node)


@urls.register
class Undeploy(generic.View):

    url_regex = r'esi/nodes/(?P<node>{})/undeploy/$'.format(LOGICAL_NAME_PATTERN)

    @rest_utils.ajax()
    def put(self, request, node):
        esi_api.undeploy_node(request, node)


@urls.register
class StatesPower(generic.View):

    url_regex = r'esi/nodes/(?P<node>{})/states/power$'.format(LOGICAL_NAME_PATTERN)

    @rest_utils.ajax(data_required=True)
    def put(self, request, node):
        target = request.DATA.get('target')
        return esi_api.set_power_state(request, node, target)


@urls.register
class VifsAttach(generic.View):

    url_regex = r'esi/nodes/(?P<node>{})/vifs$'.format(LOGICAL_NAME_PATTERN)

    @rest_utils.ajax(data_required=True)
    def post(self, request, node):
        info = esi_api.network_attach(request, node)
        return {
            'node': info['node'].id,
            'ports': [port.name for port in info['ports']],
            'networks': [network.name for network in info['networks']]
        }


@urls.register
class VifsDetach(generic.View):

    url_regex = r'esi/nodes/(?P<node>{})/vifs/(?P<port>{})$'.format(LOGICAL_NAME_PATTERN, LOGICAL_NAME_PATTERN)

    @rest_utils.ajax()
    def delete(self, request, node, port):
        is_detached = esi_api.network_detach(request, node, port)
        return {
            'is_detached': is_detached
        }


@urls.register
class Offers(generic.View):

    url_regex = r'esi/offers/$'

    @rest_utils.ajax()
    def get(self, request):
        offers = esi_api.offer_list(request)
        return {
            'offers': offers
        }


@urls.register
class Offer(generic.View):

    url_regex = r'esi/offers/(?P<offer>{})$'.format(LOGICAL_NAME_PATTERN)

    @rest_utils.ajax(data_required=True)
    def put(self, request, offer):
        return esi_api.offer_claim(request, offer)


@urls.register
class Lease(generic.View):

    url_regex = r'esi/lease/(?P<lease>{})$'.format(LOGICAL_NAME_PATTERN)

    @rest_utils.ajax()
    def delete(self, request, lease):
        return esi_api.delete_lease(request, lease)