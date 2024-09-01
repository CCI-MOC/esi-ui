from django.utils.translation import gettext_lazy as _

import horizon
from esi_ui.content.esi import dashboard

class Leases(horizon.Panel):
    name = _("Leases")
    slug = "leases"

dashboard.Esi.register(Leases)