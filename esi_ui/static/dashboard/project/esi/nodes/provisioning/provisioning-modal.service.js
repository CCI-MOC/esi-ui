(function () {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi.nodes.provisioning')
    .factory(
      'horizon.dashboard.project.esi.nodes.provisioning.modal.service',
      ProvisioningModalService
    );

  ProvisioningModalService.$inject = [
    '$uibModal',
    'horizon.dashboard.project.esi.nodes.provisioning.modal-spec'
  ];

  function ProvisioningModalService($uibModal, modalSpec) {
    var service = {
      open: open
    };

    return service;

    function open(launchContext) {
      var localSpec = {
        resolve: {
          launchContext: function () {
            return launchContext;
          }
        }
      };

      angular.extend(localSpec, modalSpec);

      return $uibModal.open(localSpec).result;
    }
  }

})();