from django.utils.translation import gettext_lazy as _

import horizon
from esi_ui.content.esi import dashboard


class Nodes(horizon.Panel):
    name = _("Nodes")
    slug = "nodes"

dashboard.Esi.register(Nodes)