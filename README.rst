esi-ui
======

OpenStack Horizon plugin that supports ESI

Installation
------------

Clone the repository::

        git clone https://github.com/CCI-MOC/esi-ui.git

Copy all files under esi-ui's ``enabled`` directory::

        cp -r <esi-ui path>/esi_ui/enabled <horizon path>/openstack_dashboard/local

Next, install the package into the environment you use to run your server.

If you run Horizon using tox, edit your tox.ini file to include esi-ui as a dependency::
        
        [testenv]
        deps = 
          ...
          -r{toxinidir}/requirements.txt
          -e <esi-ui path>

Then restart your server by running::

        tox -e runserver_plus -- localhost:8000

Read how to install Horizon to use tox here: https://github.com/CCI-MOC/esi/issues/545#issuecomment-2143063522

_______________________________________________

If you run Horizon using Apache, pip install the esi-ui package::
    
        python setup.py sdist
        pip install dist/<package>.tar.gz

Finally, restart your server using one of the commands based on your environment from here: https://docs.openstack.org/horizon/latest/install/, 

Read more about general plugin installation: https://docs.openstack.org/horizon/latest/contributor/tutorials/plugin.html#installing-your-plugin

Structure
---------

An example file structure looks like this::

        esi_ui
        ├── api
        │   ├── esi_api.py
        │   ├── esi_rest_api.py
        │   └── __init__.py
        ├── content
        │   ├── esi
        │   │   ├── __init__.py
        │   │   ├── panel.py
        │   │   ├── templates
        │   │   │   └── esi
        │   │   │       └── index.html
        │   │   ├── urls.py
        │   │   └── views.py
        │   └── __init__.py
        ├── enabled
        │   ├── _6000_esi_panel_group.py
        │   └── _6010_project_nodes_panel.py
        ├── __init__.py
        └── static
            └── dashboard
                └── project
                    └── esi
                        ├── esi.controller.js
                        ├── esi.html
                        ├── esi.module.js
                        └── nodes.service.js


api
---
esi_rest_api.py contains api endpoints that becomes registered on the server. This file usually calls functions defined in esi_api.py which usually returns resources such as nodes, leases, offers, etc.

content
-------
This directory holds subdirectories that contain the content required to display a panel.

enabled
-------
This directory contains files that define settings for dashboards, panels, panel groups, and Django.

static
------
This directory and its contents will be copied to the Horizon root directory for Angularjs to see. To add to different dashboards, such as admin or identity, create a directory under dashboard and populate it with your Angularjs files.

Read more about the file structure: https://docs.openstack.org/horizon/latest/contributor/tutorials/plugin.html#file-structure
