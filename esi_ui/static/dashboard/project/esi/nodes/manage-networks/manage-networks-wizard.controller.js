(function () {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi.nodes.manage-networks')
    .controller('ManageNetworksWizardController', ManageNetworksWizardController);

  ManageNetworksWizardController.$inject = [
    '$scope',
    'manageNetworksModel',
    'horizon.dashboard.project.esi.nodes.manage-networks.workflow',
    'horizon.framework.widgets.wizard.events'
  ];

  function ManageNetworksWizardController($scope, manageNetworksModel, manageNetworksWorkflow, wizardEvents) {
    $scope.workflow = manageNetworksWorkflow;
    $scope.model = manageNetworksModel;
    $scope.submit = $scope.model.submit;

    $scope.model.initialize();

    $scope.$on(wizardEvents.BEFORE_SUBMIT, function() {
      $scope.stepModels.action = ($scope.currentIndex ? 'detach' : 'attach');
    });
  }

})();