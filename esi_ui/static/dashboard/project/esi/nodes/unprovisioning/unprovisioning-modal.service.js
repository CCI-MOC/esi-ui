(function () {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi.nodes.unprovisioning')
    .factory(
      'horizon.dashboard.project.esi.nodes.unprovisioning.modal.service',
      UnprovisioningModalService
    );

  UnprovisioningModalService.$inject = [
    '$uibModal',
    'horizon.dashboard.project.esi.nodes.unprovisioning.modal-spec'
  ];

  function UnprovisioningModalService($uibModal, modalSpec) {
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
