(function () {
    'use strict';
  
    angular
      .module('horizon.dashboard.esi.delete-leases')
      .controller('DeleteLeasesWizardController', DeleteLeasesWizardController);
  
    DeleteLeasesWizardController.$inject = [
      '$scope',
      'horizon.dashboard.esi.delete-leases.workflow',
    ];
  
    function DeleteLeasesWizardController($scope, deleteLeasesWorkflow) {
      $scope.workflow = deleteLeasesWorkflow;
      $scope.submit = submit;
        
      function submit(stepModels) {
        return Promise.resolve({
            selectedLeases: stepModels.selectedLeases
        });
      }
    }
  
  })();