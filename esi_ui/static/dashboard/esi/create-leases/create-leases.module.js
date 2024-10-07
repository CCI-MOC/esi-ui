(function () {
  'use strict';

  angular
    .module('horizon.dashboard.esi.create-leases', [])
    .config(config)
    .constant('horizon.dashboard.esi.create-leases.modal-spec', {
      backdrop: 'static',
      controller: 'ModalContainerController',
      template: '<wizard class="wizard" ng-controller="CreateLeasesWizardController"></wizard>'
    });
  
  config.$inject = [
    '$provide',
    '$windowProvider'
  ];

  function config($provide, $windowProvider) {
    var basePath = $windowProvider.$get().STATIC_URL + 'dashboard/esi/create-leases/';
    $provide.constant('horizon.dashboard.esi.create-leases.basePath', basePath);
  }

})();