from django.views import generic


class IndexView(generic.TemplateView):
    template_name = 'esi/owner_offers/index.html'
