(function() {
  'use strict';

  angular
    .module('horizon.dashboard.esi.owner.leases', [
      'horizon.dashboard.esi.create-leases',
      'horizon.dashboard.esi.delete-leases',
    ])
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
        {id: 'leases', title: 'Lessee', priority: 1},
        {id: 'lease_duration', title: 'Lease Duration', priority: 1},
      ],
      lease_details: [
        {id: 'start_time', title: 'Start Time (UTC)'},
        {id: 'end_time', title: 'End Time (UTC)'},
        {id: 'project', title: 'Lessee'},
        {id: 'uuid', title: 'UUID'},
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
        label: gettext('Maintenance'),
        name: 'maintenance',
        singleton: true
      },
      {
        label: gettext('Resource Class'),
        name: 'resource_class',
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
