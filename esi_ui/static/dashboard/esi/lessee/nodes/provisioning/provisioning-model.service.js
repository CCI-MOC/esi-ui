(function () {
  'use strict';

  var noop = angular.noop;

  angular
    .module('horizon.dashboard.esi.lessee.nodes.provisioning')
    .factory('provisioningModel', provisioningModel);

  provisioningModel.$inject = [
    'horizon.app.core.openstack-service-api.glance',
    'horizon.app.core.openstack-service-api.neutron',
    'horizon.app.core.openstack-service-api.nova',
    'horizon.app.core.openstack-service-api.network',
  ];

  function provisioningModel(glanceAPI, neutronAPI, novaAPI, networkAPI) {
    var model = {
      loaded: {
        images: false,
        networks: false,
        keypairs: false,
        floatingIPs: false
      },

      images: [],
      networks: [],
      keypairs: [],
      floatingIPs: [],

      initialize: initialize,
      submit: submit
    };

    return model;

    ////////////////

    function initialize() {
      glanceAPI.getImages().then(onGetImages, noop);
      neutronAPI.getNetworks().then(onGetNetworks, noop);
      novaAPI.getKeypairs().then(onGetKeypairs, noop);
      networkAPI.getFloatingIps().then(onGetFloatingIPs, noop);
    }

    
    function submit(stepModels) {
    
      return new Promise((resolve, reject) => {
        if (stepModels.sshOption === 'upload' && stepModels.uploadedKeyFile) {
          const reader = new FileReader();
    
          reader.onload = function(event) {
            stepModels.ssh_keys = [event.target.result];
            delete stepModels.uploadedKeyFile; 
    
            finalizeStepModels(stepModels, resolve);
          };
    
          reader.onerror = function(error) {
            reject(error); 
          };
          reader.readAsText(stepModels.uploadedKeyFile);
    
        } else {
          finalizeStepModels(stepModels, resolve);
        }
      });
    }
    
    function finalizeStepModels(stepModels, resolve) {
      if (stepModels.sshOption === 'existing' && stepModels.keypair) {
        stepModels.ssh_keys = [stepModels.keypair.trim()];
        delete stepModels.keypair;
      }
    
      if (stepModels.sshOption === 'none') {
        delete stepModels.ssh_keys;
      }
    
      if (stepModels.network) {
        stepModels.nics = [{ network: stepModels.network }];
        delete stepModels.network;
      }
    
      if (stepModels.floatingIP) {
        stepModels.floating_ips = [stepModels.floatingIP];
        delete stepModels.floatingIP;
      }

      delete stepModels.sshOption;
      resolve(stepModels);
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

    function onGetFloatingIPs(response) {
      model.floatingIPs = response.data.items.filter(function(ip) {
        return !ip.port_id;
      });
      model.loaded.floatingIPs = true;
    }
  }

})();
