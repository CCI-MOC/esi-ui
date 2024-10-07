(function() {
  'use strict';

  angular
    .module('horizon.dashboard.esi.owner.offers', [
      'horizon.dashboard.esi.create-offers',
      //'horizon.dashboard.esi.delete-offers',
    ])
    .config(config);

  config.$inject = [
    '$provide',
    '$windowProvider',
  ];

  function config($provide, $windowProvider) {
    var basePath = $windowProvider.$get().STATIC_URL + 'dashboard/esi/owner/offers/';
    $provide.constant('horizon.dashboard.esi.owner.offers.basePath', basePath);
    
    $provide.constant('horizon.dashboard.esi.owner.offers.offerConfig', {
      selectAll: true,
      expand: true,
      trackId: 'uuid',
      columns: [
        {id: 'resource', title: 'Resource', priority: 1, sortDefault: true},
        {id: 'resource_class', title: 'Resource Class', priority: 1},
        {id: 'status', title: 'Status', priority: 1},
        {id: 'lessee', title: 'Lessee', priority: 1},
        {id: 'start_time', title: 'Start Time (UTC)', priority: 1},
        {id: 'end_time', title: 'End Time (UTC)', priority: 1},
      ],
    });

    $provide.constant('horizon.dashboard.esi.owner.offers.offerFilterFacets', [
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
        label: gettext('Offer UUID'),
        name: 'offer_uuid',
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
