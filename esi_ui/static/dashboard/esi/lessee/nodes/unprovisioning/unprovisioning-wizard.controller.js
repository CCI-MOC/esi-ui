(function () {
    'use strict';
  
    angular
      .module('horizon.dashboard.esi.lessee.nodes.unprovisioning')
      .controller('UnprovisioningWizardController', UnprovisioningWizardController);
  
    UnprovisioningWizardController.$inject = [
      '$scope',
      'horizon.dashboard.esi.lessee.nodes.unprovisioning.workflow'
    ];
  
    function UnprovisioningWizardController($scope, unprovisioningWorkflow) {
      $scope.workflow = unprovisioningWorkflow;
      $scope.submit = submit;
    
      // console.log($scope.launchContext.nodes);
      function submit(stepModels) {
        return Promise.resolve({
            unprovisionNodes: stepModels.unprovisionNodes
        });
      }
    }
  
  })();
  