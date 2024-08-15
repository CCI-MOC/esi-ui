(function() {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi.offers')
    .factory('horizon.dashboard.project.esi.offers.esiOffersTableService', offersService);
    
  offersService.$inject = [
    'horizon.framework.util.http.service',
    'horizon.framework.widgets.toast.service',
  ];
  
  function offersService(apiService, toastService) {
    var service = {
      offerList: offerList,
      offerClaim: offerClaim,
    };
    return service;

    function offerList() {
      return apiService.get('/api/esi/offers/').catch(err => {
        toastService.add('error', 'Unable to retrieve ESI offers. ' + (err.data ? err.data : ''))
        return Promise.reject(err);
      });
    }

    function offerClaim(offer, times) {
      console.log(times);
      return apiService.put('/api/esi/offers/' + offer.uuid, times).catch(err => {
        toastService.add('error', 'Unable to claim an offer. ' + (err.data ? err.data : ''))
        return Promise.reject(err);
      });
    }
  }

})();