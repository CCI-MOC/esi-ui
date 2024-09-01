(function() {
  'use strict';

  angular
    .module('horizon.dashboard.esi.owner.leases', [])
    .config(config);

  config.$inject = [
    '$provide',
    '$windowProvider',
  ];

  function config($provide, $windowProvider) {
    var basePath = $windowProvider.$get().STATIC_URL + 'dashboard/esi/owner/leases/';
    $provide.constant('horizon.dashboard.esi.owner.leases.basePath', basePath);
    
    $provide.constant('horizon.dashboard.esi.owner.leases.leaseConfig', {
      selectAll: true,
      expand: true,
      trackId: 'uuid',
      columns: [
        {id: 'name', title: 'Name', priority: 1, sortDefault: true},
        {id: 'resource_class', title: 'Resource Class', priority: 1},
        {id: 'maintenance', title: 'Maintenance', priority: 1},
        {id: 'lease_duration', title: 'Lease Duration', priority: 1},
      ],
    });

    $provide.constant('horizon.dashboard.esi.owner.leases.leaseFilterFacets', [
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
    ]);
  }

})();
