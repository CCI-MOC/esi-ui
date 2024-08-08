from django.urls import re_path

import esi_ui.api.esi_rest_api
from esi_ui.content.baremetal_topology import views

urlpatterns = [
    re_path(r'^$', views.IndexView.as_view(), name='index'),
    re_path(r'^json$', views.ESIJSONView.as_view(), name='json'),
]
