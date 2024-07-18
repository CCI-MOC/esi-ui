(function () {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi')
    .controller('horizon.dashboard.project.esi.ProvisionModalFormController', controller);

  controller.$inject = [
    '$uibModalInstance',
    'horizon.framework.util.http.service',
  ];

  function controller($uibModalInstance, apiService) {
    var ctrl = this;

    ctrl.formTitle = 'Provision Nodes';
    ctrl.submitText = 'Submit';
    ctrl.images = null
    ctrl.networks = null
    ctrl.ssh_keys = null
    ctrl.selected = {
      image: null,
      nics: null,
      ssh_keys: null,
    }

    ctrl.submit = submit;

    ////////////////

    init()

    function init() {
      apiService.get('/api/glance/images/')
      .then(function(response) {
        ctrl.images = response.data.items.map(function(image) {
          return image.name;
        });
      });

      apiService.get('/api/neutron/networks/')
      .then(function(response) {
        ctrl.networks = response.data.items.map(function(network) {
          return network.name;
        });
      });

      apiService.get('/api/nova/keypairs/')
      .then(function(response) {
        console.log(response);
        ctrl.ssh_keys = response.data.items.map(function(keypair) {
          return keypair.keypair;
        });
      });
    }

    function submit($event) {
      $event.preventDefault();
      $event.stopPropagation();

      ctrl.selected.nics = [{network: ctrl.selected.nics}];
      
      ctrl.selected.ssh_keys = [ctrl.selected.ssh_keys.public_key.trim()];

      return $uibModalInstance.close(ctrl.selected);
    }
  }

})();