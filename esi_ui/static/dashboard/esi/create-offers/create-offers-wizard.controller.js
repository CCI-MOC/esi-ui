(function () {
  'use strict';

  angular
    .module('horizon.dashboard.esi.create-offers')
    .controller('CreateOffersWizardController', CreateOffersWizardController);

  CreateOffersWizardController.$inject = [
    '$scope',
    'createOffersModel',
    'horizon.dashboard.esi.create-offers.workflow',
  ];

  function CreateOffersWizardController($scope, createOffersModel, createOffersWorkflow) {
    $scope.workflow = createOffersWorkflow;
    $scope.model = createOffersModel;
    $scope.submit = createOffersModel.submit;

    createOffersModel.initialize();
  }

})();
