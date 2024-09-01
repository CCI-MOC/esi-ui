(function () {
  'use strict';

  angular
    .module('horizon.dashboard.esi.lessee.nodes.manage-networks', [])
    .config(config)
    .constant('horizon.dashboard.esi.lessee.nodes.manage-networks.modal-spec', {
      backdrop: 'static',
      size: 'lg',
      controller: 'ModalContainerController',
      template: '<wizard class="wizard" ng-controller="ManageNetworksWizardController"></wizard>'
    });
  
  config.$inject = [
    '$provide',
    '$windowProvider'
  ];

  function config($provide, $windowProvider) {
    var basePath = $windowProvider.$get().STATIC_URL + 'dashboard/esi/lessee/nodes/manage-networks/';
    $provide.constant('horizon.dashboard.esi.lessee.nodes.manage-networks.basePath', basePath);
  }

})();