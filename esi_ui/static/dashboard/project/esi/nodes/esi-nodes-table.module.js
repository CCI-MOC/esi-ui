(function() {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi.nodes', [
      'horizon.dashboard.project.esi.nodes.manage-networks',
      'horizon.dashboard.project.esi.nodes.manage-floating-ips',
      'horizon.dashboard.project.esi.nodes.provisioning',
      'horizon.dashboard.project.esi.nodes.unprovisioning',
      'horizon.dashboard.project.esi.nodes.delete-leases'
    ])
    .config(config);

  config.$inject = [
    '$provide',
    '$windowProvider',
  ];

  function config($provide, $windowProvider) {
    var basePath = $windowProvider.$get().STATIC_URL + 'dashboard/project/esi/nodes/';
    $provide.constant('horizon.dashboard.project.esi.nodes.basePath', basePath);

    $provide.constant('horizon.dashboard.project.esi.nodes.nodeConfig', {
      selectAll: true,
      expand: true,
      trackId: 'uuid',
      columns: [
        {id: 'name', title: 'Name', priority: 1, sortDefault: true},
        {id: 'provision_state', title: 'Provision State', priority: 1},
        {id: 'power_state', title: 'Power State', priority: 1},
        {id: 'maintenance', title: 'Maintenance', priority: 1},
        {id: 'lease_duration', title: 'Lease Duration', priority: 1},
        {id: 'resource_class', title: 'Resource Class', priority: 1}
      ],
      lease_details: [
        {id: 'lessee', title: 'Lessee', priority: 1},
        {id: 'owner', title: 'Owner', priority: 1},
        {id: 'resource_class', title: 'Resource Class', priority: 1},
        {id: 'start_time', title: 'Start Time (UTC)', priority: 1},
        {id: 'end_time', title: 'End Time (UTC)', priority: 1},
        {id: 'lease_uuid', title: 'Lease UUID', priority: 1},
        {id: 'properties', title: 'Properties', priority: 1},
      ],
      network_details: [
        {id: 'mac_addresses', title: 'MAC Address', priority: 1},
        {id: 'network_port_names', title: 'Port', priority: 1},
        {id: 'network_names', title: 'Network', priority: 1},
        {id: 'fixed_ips', title: 'Fixed IP', priority: 1},
        {id: 'floating_networks', title: 'Floating Network', priority: 1},
        {id: 'floating_ips', title: 'Floating IP', priority: 1},
      ]
    });

    $provide.constant('horizon.dashboard.project.esi.nodes.nodeFilterFacets', [
      {
        label: gettext('UUID'),
        name: 'uuid',
        singleton: true
      },
      {
        label: gettext('Name'),
        name: 'name',
        singleton: true
      },
      {
        label: gettext('Owner'),
        name: 'owner',
        singleton: true
      },
      {
        label: gettext('Lessee'),
        name: 'lessee',
        singleton: true
      },
      {
        label: gettext('Resource Class'),
        name: 'resource_class',
        singleton: true
      },
      {
        label: gettext('Provision State'),
        name: 'provision_state',
        singleton: true
      },
      {
        label: gettext('Power State'),
        name: 'power_state',
        singleton: true
      },
      {
        label: gettext('Maintenance'),
        name: 'maintenance',
        singleton: true
      },
      {
        label: gettext('Lease Status'),
        name: 'status',
        singleton: true
      },
      {
        label: gettext('Lease UUID'),
        name: 'lease_uuid',
        singleton: true
      },
      {
        label: gettext('Properties'),
        name: 'properties',
        singleton: true
      },
      {
        label: gettext('MAC Address'),
        name: 'mac_addresses',
        singleton: true
      },
      {
        label: gettext('Port'),
        name: 'network_port_names',
        singleton: true
      },
      {
        label: gettext('Network'),
        name: 'network_names',
        singleton: true
      },
      {
        label: gettext('Fixed IP'),
        name: 'fixed_ips',
        singleton: true
      },
      {
        label: gettext('Floating Network'),
        name: 'floating_networks',
        singleton: true
      },
      {
        label: gettext('Floating IP'),
        name: 'floating_ips',
        singleton: true
      },
    ]);
  }

})();
