from django.utils.translation import gettext_lazy as _
import horizon


class Offers(horizon.Panel):
    name = _("Offers")
    slug = "offers"
