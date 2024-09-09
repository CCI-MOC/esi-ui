(function () {
  'use strict';

  angular
    .module('horizon.dashboard.esi.create-leases')
    .factory('horizon.dashboard.esi.create-leases.workflow', createLeasesWorkflow);

  createLeasesWorkflow.$inject = [
    'horizon.dashboard.esi.create-leases.basePath',
    'horizon.app.core.workflow.factory'
  ];

  function createLeasesWorkflow(basePath, dashboardWorkflow) {
    return dashboardWorkflow({
      title: gettext('Create Leases'),

      steps: [
        {
          id: 'createLeases',
          title: gettext('Create Lease'),
          templateUrl: basePath + 'create-leases.html',
          formName: 'createLeasesForm'
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