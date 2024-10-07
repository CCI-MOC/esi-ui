(function () {
  'use strict';

  angular
    .module('horizon.dashboard.esi.create-leases')
    .factory(
      'horizon.dashboard.esi.create-leases.modal.service',
      CreateLeasesModalService
    );

  CreateLeasesModalService.$inject = [
    '$uibModal',
    'horizon.dashboard.esi.create-leases.modal-spec'
  ];

  function CreateLeasesModalService($uibModal, modalSpec) {
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