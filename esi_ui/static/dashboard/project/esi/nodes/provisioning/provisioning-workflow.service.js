(function () {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi.nodes.provisioning')
    .factory('horizon.dashboard.project.esi.nodes.provisioning.workflow', provisioningWorkflow);

  provisioningWorkflow.$inject = [
    'horizon.dashboard.project.esi.nodes.provisioning.basePath',
    'horizon.app.core.workflow.factory'
  ];

  function provisioningWorkflow(basePath, dashboardWorkflow) {
    return dashboardWorkflow({
      title: gettext('Provision Nodes'),

      steps: [
        {
          id: 'provision',
          title: gettext('Provisioning'),
          templateUrl: basePath + 'provisioning.html',
          formName: 'provisioningForm'
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