from django.utils.translation import gettext_lazy as _

import horizon

class Lessee(horizon.PanelGroup):
    slug = "lessee"
    name = _("Lessee")
    panels = ("nodes", "offers", "baremetal_topology")

class Owner(horizon.PanelGroup):
    slug = "owner"
    name = _("Owner")
    panels = ("leases",)

class Esi(horizon.Dashboard):
    name = _("ESI")
    slug = "esi"
    panels = (Lessee, Owner,)
    default_panel = 'nodes'

horizon.register(Esi)