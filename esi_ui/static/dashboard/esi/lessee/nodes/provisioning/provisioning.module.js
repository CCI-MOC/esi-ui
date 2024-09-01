(function () {
  'use strict';

  angular
    .module('horizon.dashboard.esi.lessee.nodes.provisioning', [])
    .config(config)
    .constant('horizon.dashboard.esi.lessee.nodes.provisioning.modal-spec', {
      backdrop: 'static',
      size: 'lg',
      controller: 'ModalContainerController',
      template: '<wizard class="wizard" ng-controller="ProvisioningWizardController"></wizard>'
    });
  
  config.$inject = [
    '$provide',
    '$windowProvider'
  ];

  function config($provide, $windowProvider) {
    var basePath = $windowProvider.$get().STATIC_URL + 'dashboard/esi/lessee/nodes/provisioning/';
    $provide.constant('horizon.dashboard.esi.lessee.nodes.provisioning.basePath', basePath);
  }

})();