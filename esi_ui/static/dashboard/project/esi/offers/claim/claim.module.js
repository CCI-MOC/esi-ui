(function () {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi.offers.claim', [])
    .config(config)
    .constant('horizon.dashboard.project.esi.offers.claim.modal-spec', {
      backdrop: 'static',
      controller: 'ModalContainerController',
      template: '<wizard class="wizard" ng-controller="ClaimWizardController"></wizard>'
    });
  
  config.$inject = [
    '$provide',
    '$windowProvider'
  ];

  function config($provide, $windowProvider) {
    var basePath = $windowProvider.$get().STATIC_URL + 'dashboard/project/esi/offers/claim/';
    $provide.constant('horizon.dashboard.project.esi.offers.claim.basePath', basePath);
  }

})();