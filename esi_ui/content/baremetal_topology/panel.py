from django.utils.translation import gettext_lazy as _
import horizon


class BaremetalTopology(horizon.Panel):
    name = _("Baremetal Topology")
    slug = "baremetal_topology"
