(function () {
  'use strict';

  angular
    .module('horizon.dashboard.esi.lessee.offers.claim')
    .controller('ClaimWizardController', ClaimWizardController);

    ClaimWizardController.$inject = [
      '$scope',
      'horizon.dashboard.esi.lessee.offers.claim.workflow',
    ];

    function ClaimWizardController($scope, claimWorkflow) {
      $scope.workflow = claimWorkflow;
      $scope.submit = submit;

      const now = new Date();
      const defaultEnd = new Date(now);
      defaultEnd.setDate(now.getDate() + 1);
      defaultEnd.setUTCHours(now.getUTCHours());
      defaultEnd.setUTCMinutes(now.getUTCMinutes());
      defaultEnd.setUTCSeconds(0);
      defaultEnd.setUTCMilliseconds(0);

      $scope.defaultStart = {
        date: new Date(now),
        time: now.toISOString().substr(11, 5)
      };

      $scope.defaultEnd = {
        date: new Date(defaultEnd),
        time: defaultEnd.toISOString().substr(11, 5)
      };

      $scope.stepModels = {
        start_date: $scope.defaultStart.date,
        start_time: $scope.defaultStart.time,
        end_date: $scope.defaultEnd.date,
        end_time: $scope.defaultEnd.time
      };

      function submit(stepModels) {
        let start = null;
        let end = null;

        if (stepModels.start_date && stepModels.start_time) {
          start = new Date(stepModels.start_date);
          const [startHour, startMinute] = stepModels.start_time.split(':');
          start.setUTCHours(parseInt(startHour, 10));
          start.setUTCMinutes(parseInt(startMinute, 10));
          start.setUTCSeconds(0);
          start.setUTCMilliseconds(0);
        }

        if (stepModels.end_date && stepModels.end_time) {
          end = new Date(stepModels.end_date);
          const [endHour, endMinute] = stepModels.end_time.split(':');
          end.setUTCHours(parseInt(endHour, 10));
          end.setUTCMinutes(parseInt(endMinute, 10));
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
