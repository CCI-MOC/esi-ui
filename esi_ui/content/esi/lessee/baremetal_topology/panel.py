from django.utils.translation import gettext_lazy as _

import horizon
from esi_ui.content.esi import dashboard

class BaremetalTopology(horizon.Panel):
    name = _("Baremetal Topology")
    slug = "baremetal_topology"

dashboard.Esi.register(BaremetalTopology)