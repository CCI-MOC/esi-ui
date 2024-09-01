(function () {
  'use strict';

  angular
    .module('horizon.dashboard.esi.lessee.nodes.manage-floating-ips', [])
    .config(config)
    .constant('horizon.dashboard.esi.lessee.nodes.manage-floating-ips.modal-spec', {
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
    var basePath = $windowProvider.$get().STATIC_URL + 'dashboard/esi/lessee/nodes/manage-floating-ips/';
    $provide.constant('horizon.dashboard.esi.lessee.nodes.manage-floating-ips.basePath', basePath);
  }

})();