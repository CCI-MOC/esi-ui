# The slug of the dashboard to be added to HORIZON['dashboards']. Required.
DASHBOARD = 'esi'

# A list of applications to be added to INSTALLED_APPS.
ADD_INSTALLED_APPS = [
    'esi_ui',
    'esi_ui.content.esi',
]

ADD_ANGULAR_MODULES = [
    'horizon.dashboard.esi',
]

AUTO_DISCOVER_STATIC_FILES = True
