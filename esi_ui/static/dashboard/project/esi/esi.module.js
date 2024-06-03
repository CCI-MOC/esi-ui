(function() {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi', [])
    .config(config);

  config.$inject = ['$provide', '$windowProvider'];

  function config($provide, $windowProvider) {
    var basePath = $windowProvider.$get().STATIC_URL + 'dashboard/project/esi/';
    $provide.constant('horizon.dashboard.project.esi.basePath', basePath);

    $provide.constant('horizon.dashboard.project.esi.config', {
      selectAll: true,
      expand: true,
      detailsTemplateUrl: basePath + 'nodes/node-detail.html',
      trackId: 'uuid',
      columns: [
        {id: 'name', title: 'Name', priority: 1, sortDefault: true},
        {id: 'provision_state', title: 'Provision State', priority: 1, itemInTransitionFunction: function(node) {
          return node.target_provision_state !== null && node.provision_state !== node.target_provision_state;
        }},
        {id: 'power_state', title: 'Power State', priority: 1, itemInTransitionFunction: function(node) {
          return node.target_power_state !== null && node.power_state !== node.target_power_state;
        }},
        {id: 'maintenance', title: 'Maintenance', priority: 1},
        {id: 'uuid', title: 'UUID', priority: 1},
      ],
      details: [
        {id: 'lessee', title: 'Lessee', priority: 1},
        {id: 'owner', title: 'Owner', priority: 1},
        {id: 'resource_class', title: 'Resource Class', priority: 1},
        {id: 'lease_uuid', title: 'Lease UUID', priority: 1},
      ]
    });

    $provide.constant('horizon.dashboard.project.esi.filterFacets', [
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
        label: gettext('Lease UUID'),
        name: 'lease_uuid',
        singleton: true
      }
    ]);
  }
})();
