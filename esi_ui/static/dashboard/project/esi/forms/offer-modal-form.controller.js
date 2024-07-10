(function () {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi')
    .controller('horizon.dashboard.project.esi.OfferModalFormController', controller);

  controller.$inject = [
    '$uibModalInstance'
  ];

  function controller($uibModalInstance) {
    var ctrl = this;

    ctrl.formTitle = 'Claim Offers';
    ctrl.submitText = 'Submit';
    ctrl.start_date = null;
    ctrl.start_time = null;
    ctrl.end_date = null;
    ctrl.end_time = null;

    ctrl.submit = submit;

    ////////////////

    function submit($event) {
      $event.preventDefault();
      $event.stopPropagation();

      var start = null;
      var end = null;

      if (ctrl.start_date !== null) {
        start = new Date();
        start.setUTCFullYear(ctrl.start_date.getUTCFullYear());
        start.setUTCMonth(ctrl.start_date.getUTCMonth());
        start.setUTCDate(ctrl.start_date.getUTCDate());
        start.setUTCHours(ctrl.start_time.getHours());
        start.setUTCMinutes(ctrl.start_time.getMinutes());
        start.setUTCSeconds(0);
        start.setUTCMilliseconds(0);
      }
      if (ctrl.end_date !== null) {
        end = new Date();
        end.setUTCFullYear(ctrl.end_date.getUTCFullYear());
        end.setUTCMonth(ctrl.end_date.getUTCMonth());
        end.setUTCDate(ctrl.end_date.getUTCDate());
        end.setUTCHours(ctrl.end_time.getHours());
        end.setUTCMinutes(ctrl.end_time.getMinutes());
        end.setUTCSeconds(0);
        end.setUTCMilliseconds(0);
      }

      return $uibModalInstance.close({
        start_time: start,
        end_time: end
      });
    }
  }

})();