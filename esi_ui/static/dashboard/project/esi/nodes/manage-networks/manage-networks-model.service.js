(function () {
  'use strict';

  var noop = angular.noop;

  angular
    .module('horizon.dashboard.project.esi.nodes.manage-networks')
    .factory('manageNetworksModel', manageNetworksModel);

  manageNetworksModel.$inject = [
    'horizon.app.core.openstack-service-api.neutron',
  ];

  function manageNetworksModel(neutronAPI) {
    var model = {
      loaded: {
        networks: false,
        ports: false,
        trunks: false
      },

      networks: [],
      ports: [],
      trunks: [],

      disabled: {
        networks: false,
        ports: false,
        trunks: false
      },
      
      initialize: initialize,
      submit: submit
    };

    return model;

    ////////////////

    function initialize() {
      neutronAPI.getNetworks().then(onGetNetworks, noop);
      neutronAPI.getPorts().then(onGetPorts, noop);
      neutronAPI.getTrunks().then(onGetTrunks, noop);
    }

    function submit(stepModels) {
      return Promise.resolve(stepModels);
    }

    function onGetNetworks(response) {
      model.networks = response.data.items;
      model.loaded.networks = true;
    }

    function onGetPorts(response) {
      model.ports = response.data.items.filter(function (port) {
        return port.name;
      });
      model.loaded.ports = true;
    }

    function onGetTrunks(response) {
      model.trunks = response.data.items;
      model.loaded.trunks = true;
    }
  }

})();