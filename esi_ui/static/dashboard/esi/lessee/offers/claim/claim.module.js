(function () {
  'use strict';

  angular
    .module('horizon.dashboard.esi.lessee.offers.claim', [])
    .config(config)
    .constant('horizon.dashboard.esi.lessee.offers.claim.modal-spec', {
      backdrop: 'static',
      controller: 'ModalContainerController',
      template: '<wizard class="wizard" ng-controller="ClaimWizardController"></wizard>'
    });
  
  config.$inject = [
    '$provide',
    '$windowProvider'
  ];

  function config($provide, $windowProvider) {
    var basePath = $windowProvider.$get().STATIC_URL + 'dashboard/esi/lessee/offers/claim/';
    $provide.constant('horizon.dashboard.esi.lessee.offers.claim.basePath', basePath);
  }

})();