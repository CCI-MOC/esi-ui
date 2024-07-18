(function () {
    'use strict';
  
    angular
      .module('horizon.dashboard.project.esi.nodes.delete-leases')
      .controller('DeleteLeasesWizardController', DeleteLeasesWizardController);
  
    DeleteLeasesWizardController.$inject = [
      '$scope',
      'horizon.dashboard.project.esi.nodes.delete-leases.workflow',
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