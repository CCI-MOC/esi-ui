(function () {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi.offers.claim')
    .controller('ClaimWizardController', ClaimWizardController);

  ClaimWizardController.$inject = [
    '$scope',
    'horizon.dashboard.project.esi.offers.claim.workflow',
  ];

  function ClaimWizardController($scope, claimWorkflow) {
    $scope.workflow = claimWorkflow;
    $scope.submit = submit;

    function submit(stepModels) {
      var start = null;
      var end = null;

      if (stepModels.start_date) {
        start = new Date();
        start.setUTCFullYear(stepModels.start_date.getUTCFullYear());
        start.setUTCMonth(stepModels.start_date.getUTCMonth());
        start.setUTCDate(stepModels.start_date.getUTCDate());
        start.setUTCHours(stepModels.start_time.getHours());
        start.setUTCMinutes(stepModels.start_time.getMinutes());
        start.setUTCSeconds(0);
        start.setUTCMilliseconds(0);
      }
      if (stepModels.end_date) {
        end = new Date();
        end.setUTCFullYear(stepModels.end_date.getUTCFullYear());
        end.setUTCMonth(stepModels.end_date.getUTCMonth());
        end.setUTCDate(stepModels.end_date.getUTCDate());
        end.setUTCHours(stepModels.end_time.getHours());
        end.setUTCMinutes(stepModels.end_time.getMinutes());
        end.setUTCSeconds(0);
        end.setUTCMilliseconds(0);
      }

      return Promise.resolve({
        start_time: start,
        end_time: end
      });
    }
  }

})();