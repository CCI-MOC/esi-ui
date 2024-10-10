(function () {
  'use strict';

  angular
    .module('horizon.dashboard.esi.lessee.nodes.provisioning')
    .controller('ProvisioningWizardController', ProvisioningWizardController);

  ProvisioningWizardController.$inject = [
    '$scope',
    'provisioningModel',
    'horizon.dashboard.esi.lessee.nodes.provisioning.workflow',
  ];

  function ProvisioningWizardController($scope, provisioningModel, provisioningWorkflow) {
    $scope.workflow = provisioningWorkflow;
    $scope.model = provisioningModel;
    $scope.submit = $scope.model.submit;

    $scope.model.initialize();
    $scope.uploadSSHKey = function() {
      var inputElement = document.getElementById('uploadedKeyFile');
      var file = inputElement.files[0];
    
      if (file) {
        $scope.model.uploadedKeyFile = file;
        $scope.stepModels.uploadedKey = true;
        console.log("Uploaded SSH key file:", file.name);
      } else {
        $scope.stepModels.uploadedKey = false;
      }
    };
  }

})();