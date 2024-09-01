from django.utils.translation import gettext_lazy as _

import horizon
from esi_ui.content.esi import dashboard


class Offers(horizon.Panel):
    name = _("Offers")
    slug = "offers"

dashboard.Esi.register(Offers)