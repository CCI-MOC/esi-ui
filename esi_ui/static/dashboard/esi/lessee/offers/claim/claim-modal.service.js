(function () {
  'use strict';

  angular
    .module('horizon.dashboard.esi.lessee.offers.claim')
    .factory(
      'horizon.dashboard.esi.lessee.offers.claim.modal.service',
      ClaimModalService
    );

  ClaimModalService.$inject = [
    '$uibModal',
    'horizon.dashboard.esi.lessee.offers.claim.modal-spec'
  ];

  function ClaimModalService($uibModal, modalSpec) {
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