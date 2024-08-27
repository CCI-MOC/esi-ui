(function () {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi.nodes.manage-floating-ips')
    .controller('ManageFloatingIPsWizardController', ManageFloatingIPsWizardController);

  ManageFloatingIPsWizardController.$inject = [
    '$scope',
    'manageFloatingIPsModel',
    'horizon.dashboard.project.esi.nodes.manage-floating-ips.workflow',
    'horizon.framework.widgets.wizard.events'
  ];

  function ManageFloatingIPsWizardController($scope, manageFloatingIPsModel, manageFloatingIPsWorkflow, wizardEvents) {
    $scope.workflow = manageFloatingIPsWorkflow;
    $scope.model = manageFloatingIPsModel;
    $scope.submit = $scope.model.submit;

    $scope.model.initialize();

    $scope.$on(wizardEvents.BEFORE_SUBMIT, function() {
      $scope.stepModels.action = ($scope.currentIndex ? 'detach' : 'attach');
    });
  }

})();