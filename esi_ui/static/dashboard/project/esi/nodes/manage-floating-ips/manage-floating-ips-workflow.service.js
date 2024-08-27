(function () {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi.nodes.manage-floating-ips')
    .factory('horizon.dashboard.project.esi.nodes.manage-floating-ips.workflow', manageFloatingIPsWorkflow);

  manageFloatingIPsWorkflow.$inject = [
    'horizon.dashboard.project.esi.nodes.manage-floating-ips.basePath',
    'horizon.app.core.workflow.factory'
  ];

  function manageFloatingIPsWorkflow(basePath, dashboardWorkflow) {
    return dashboardWorkflow({
      title: gettext('Manage Floating IPs'),

      steps: [
        {
          id: 'attach',
          title: gettext('Attach'),
          templateUrl: basePath + 'attach/attach.html',
          formName: 'attachFloatingIPsForm'
        },
        {
          id: 'detach',
          title: gettext('Detach'),
          templateUrl: basePath + 'detach/detach.html',
          formName: 'detachFloatingIPsForm'
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