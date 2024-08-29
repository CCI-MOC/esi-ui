(function () {
  'use strict';

  var noop = angular.noop;

  angular
    .module('horizon.dashboard.project.esi.nodes.provisioning')
    .factory('provisioningModel', provisioningModel);

  provisioningModel.$inject = [
    'horizon.app.core.openstack-service-api.glance',
    'horizon.app.core.openstack-service-api.neutron',
    'horizon.app.core.openstack-service-api.nova',
  ];

  function provisioningModel(glanceAPI, neutronAPI, novaAPI) {
    var model = {
      loaded: {
        images: false,
        networks: false,
        keypairs: false
      },

      images: [],
      networks: [],
      keypairs: [],

      initialize: initialize,
      submit: submit
    };

    return model;

    ////////////////

    function initialize() {
      glanceAPI.getImages().then(onGetImages, noop);
      neutronAPI.getNetworks().then(onGetNetworks, noop);
      novaAPI.getKeypairs().then(onGetKeypairs, noop);
    }

    function submit(stepModels) {
      if (stepModels.keypair) {
        stepModels.ssh_keys = [stepModels.keypair.trim()];
        delete stepModels.keypair;
      }
      if (stepModels.network) {
        stepModels.nics = [{network: stepModels.network}];
        delete stepModels.network;
      }

      return Promise.resolve(stepModels);
    }

    function onGetImages(response) {
      model.images = response.data.items;
      model.loaded.images = true;
    }

    function onGetNetworks(response) {
      model.networks = response.data.items;
      model.loaded.networks = true;
    }

    function onGetKeypairs(response) {
      model.keypairs = response.data.items;
      model.loaded.keypairs = true;
    }
  }

})();
