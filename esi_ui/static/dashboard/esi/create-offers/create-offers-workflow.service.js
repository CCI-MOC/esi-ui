(function () {
  'use strict';

  angular
    .module('horizon.dashboard.esi.create-offers')
    .factory('horizon.dashboard.esi.create-offers.workflow', createOffersWorkflow);

  createOffersWorkflow.$inject = [
    'horizon.dashboard.esi.create-offers.basePath',
    'horizon.app.core.workflow.factory'
  ];

  function createOffersWorkflow(basePath, dashboardWorkflow) {
    return dashboardWorkflow({
      title: gettext('Create Offers'),

      steps: [
        {
          id: 'createOffers',
          title: gettext('Create Offer'),
          templateUrl: basePath + 'create-offers.html',
          formName: 'createOffersForm'
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
