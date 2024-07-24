(function () {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi.nodes.manage-networks', [])
    .config(config)
    .constant('horizon.dashboard.project.esi.nodes.manage-networks.modal-spec', {
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
    var basePath = $windowProvider.$get().STATIC_URL + 'dashboard/project/esi/nodes/manage-networks/';
    $provide.constant('horizon.dashboard.project.esi.nodes.manage-networks.basePath', basePath);
  }

})();