(function() {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi')
    .factory('horizon.dashboard.project.esi.esiOffersTableService', offersService);
    
  offersService.$inject = [
    '$uibModal',
    'horizon.framework.util.http.service',
    'horizon.dashboard.project.esi.basePath',
  ];
  
  function offersService($uibModal, apiService, basePath) {
    var service = {
      offerList: offerList,
      editClaim: editClaim,
      offerClaim: offerClaim,
    };
    return service;

    function offerList() {
      return apiService.get('/api/esi/offers/');
    }

    function editClaim() {
      var modalConfig = {
        backdrop: 'static',
        keyboard: false,
        controller: 'horizon.dashboard.project.esi.OfferModalFormController as ctrl',
        templateUrl: basePath + 'forms/offer-modal-form.html'
      };

      return $uibModal.open(modalConfig).result;
    }

    function offerClaim(offer, times) {
      console.log(times);
      return apiService.put('/api/esi/offers/' + offer.uuid, times);
    }
  }

})();