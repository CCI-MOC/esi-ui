(function () {
  'use strict';

  angular
    .module('horizon.dashboard.esi.create-offers', [])
    .config(config)
    .constant('horizon.dashboard.esi.create-offers.modal-spec', {
      backdrop: 'static',
      controller: 'ModalContainerController',
      template: '<wizard class="wizard" ng-controller="CreateOffersWizardController"></wizard>'
    });
  
  config.$inject = [
    '$provide',
    '$windowProvider'
  ];

  function config($provide, $windowProvider) {
    var basePath = $windowProvider.$get().STATIC_URL + 'dashboard/esi/create-offers/';
    $provide.constant('horizon.dashboard.esi.create-offers.basePath', basePath);
  }

})();
