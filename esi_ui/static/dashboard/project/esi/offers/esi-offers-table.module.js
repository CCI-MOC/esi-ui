(function() {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi.offers', [
      'horizon.dashboard.project.esi.offers.claim',
    ])
    .config(config);

  config.$inject = [
    '$provide',
    '$windowProvider',
  ];

  function config($provide, $windowProvider) {
    var basePath = $windowProvider.$get().STATIC_URL + 'dashboard/project/esi/offers/';
    $provide.constant('horizon.dashboard.project.esi.offers.basePath', basePath);

    $provide.constant('horizon.dashboard.project.esi.offers.offerConfig', {
      selectAll: true,
      expand: true,
      trackId: 'uuid',
      columns: [
        {id: 'resource', title: 'Resource', priority: 1, sortDefault: true},
        {id: 'resource_class', title: 'Resource Class', priority: 1},
        {id: 'status', title: 'Status', priority: 1},
        {id: 'start_time', title: 'Start Time (UTC)', priority: 1},
        {id: 'end_time', title: 'End Time (UTC)', priority: 1},
        {id: 'availabilities', title: 'Availabilities (UTC)', priority: 1},
      ],
      offer_details: [
        {id: 'uuid', title: 'UUID', priority: 1},
        {id: 'resource_properties', title: 'Resource Properties', priority: 1},
      ]
    });

    $provide.constant('horizon.dashboard.project.esi.offers.offerFilterFacets', [
      {
        label: gettext('Resource'),
        name: 'resource',
        singleton: true
      },
      {
        label: gettext('Resource Class'),
        name: 'resource_class',
        singleton: true
      },
      {
        label: gettext('Project'),
        name: 'project',
        singleton: true
      },
      {
        label: gettext('Start Time'),
        name: 'start_time',
        singleton: true
      },
      {
        label: gettext('End Time'),
        name: 'end_time',
        singleton: true
      },
      {
        label: gettext('UUID'),
        name: 'uuid',
        singleton: true
      },
      {
        label: gettext('Availabilities'),
        name: 'availabilities',
        singleton: true
      },
      {
        label: gettext('Resource Properties'),
        name: 'resource_properties',
        singleton: true
      },
    ]);
  }

})();
