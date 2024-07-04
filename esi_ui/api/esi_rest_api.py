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
class StatesPower(generic.View):

    url_regex = r'esi/nodes/(?P<node>{})/states/power$'.format(LOGICAL_NAME_PATTERN)

    @rest_utils.ajax(data_required=True)
    def put(self, request, node):
        target = request.DATA.get('target')
        return esi_api.set_power_state(request, node, target)

