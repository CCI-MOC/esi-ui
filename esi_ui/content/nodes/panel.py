from django.utils.translation import gettext_lazy as _
import horizon


class Nodes(horizon.Panel):
    name = _("Nodes")
    slug = "nodes"
