(function () {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi.nodes.manage-floating-ips', [])
    .config(config)
    .constant('horizon.dashboard.project.esi.nodes.manage-floating-ips.modal-spec', {
      backdrop: 'static',
      size: 'lg',
      controller: 'ModalContainerController',
      template: '<wizard class="wizard" ng-controller="ManageFloatingIPsWizardController"></wizard>'
    });
  
  config.$inject = [
    '$provide',
    '$windowProvider'
  ];

  function config($provide, $windowProvider) {
    var basePath = $windowProvider.$get().STATIC_URL + 'dashboard/project/esi/nodes/manage-floating-ips/';
    $provide.constant('horizon.dashboard.project.esi.nodes.manage-floating-ips.basePath', basePath);
  }

})();