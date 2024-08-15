(function () {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi.nodes.provisioning', [])
    .config(config)
    .constant('horizon.dashboard.project.esi.nodes.provisioning.modal-spec', {
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
    var basePath = $windowProvider.$get().STATIC_URL + 'dashboard/project/esi/nodes/provisioning/';
    $provide.constant('horizon.dashboard.project.esi.nodes.provisioning.basePath', basePath);
  }

})();