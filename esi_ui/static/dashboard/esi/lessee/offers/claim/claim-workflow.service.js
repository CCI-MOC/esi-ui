(function () {
  'use strict';

  angular
    .module('horizon.dashboard.esi.lessee.offers.claim')
    .factory('horizon.dashboard.esi.lessee.offers.claim.workflow', claimWorkflow);

  claimWorkflow.$inject = [
    'horizon.dashboard.esi.lessee.offers.claim.basePath',
    'horizon.app.core.workflow.factory'
  ];

  function claimWorkflow(basePath, dashboardWorkflow) {
    return dashboardWorkflow({
      title: gettext('Claim Offers'),

      steps: [
        {
          id: 'claim',
          title: gettext('Claim'),
          templateUrl: basePath + 'claim.html',
          formName: 'claimForm'
        },
      ],

      btnText: {
        finish: gettext('Submit')
      },

      btnIcon: {
        finish: 'fa-cloud-upload'
      }
    });
  }

})();