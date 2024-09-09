(function () {
  'use strict';

  angular
    .module('horizon.dashboard.esi.create-leases')
    .controller('CreateLeasesWizardController', CreateLeasesWizardController);

  CreateLeasesWizardController.$inject = [
    '$scope',
    'createLeasesModel',
    'horizon.dashboard.esi.create-leases.workflow',
  ];

  function CreateLeasesWizardController($scope, createLeasesModel, createLeasesWorkflow) {
    $scope.workflow = createLeasesWorkflow;
    $scope.model = createLeasesModel;
    $scope.submit = createLeasesModel.submit;

    $scope.model.initialize();
  }

})();