(function () {
  'use strict';

  angular
    .module('horizon.dashboard.esi.create-offers')
    .factory(
      'horizon.dashboard.esi.create-offers.modal.service',
      CreateOffersModalService
    );

  CreateOffersModalService.$inject = [
    '$uibModal',
    'horizon.dashboard.esi.create-offers.modal-spec'
  ];

  function CreateOffersModalService($uibModal, modalSpec) {
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
