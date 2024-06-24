from django.urls import re_path

import esi_ui.api.esi_rest_api
from esi_ui.content.esi import views

urlpatterns = [
    re_path(r'^nodes$', views.IndexView.as_view(), name='index'),
]
