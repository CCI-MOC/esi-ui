(function() {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi')
    .factory('horizon.dashboard.project.esi.esiOffersTableService', offersService);
    
  offersService.$inject = [
    'horizon.framework.util.http.service',
  ];
  
  function offersService(apiService) {
    var service = {
      offerList: offerList,
      offerClaim: offerClaim,
    };
    return service;

    function offerList() {
      return apiService.get('/api/esi/offers/');
    }

    function offerClaim(offer, times) {
      console.log(times);
      return apiService.put('/api/esi/offers/' + offer.uuid, times);
    }
  }

})();