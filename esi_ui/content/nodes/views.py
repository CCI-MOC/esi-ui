from django.views import generic


class IndexView(generic.TemplateView):
    template_name = 'project/nodes/index.html'
