(function () {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi.offers.claim')
    .factory('horizon.dashboard.project.esi.offers.claim.workflow', claimWorkflow);

  claimWorkflow.$inject = [
    'horizon.dashboard.project.esi.offers.claim.basePath',
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