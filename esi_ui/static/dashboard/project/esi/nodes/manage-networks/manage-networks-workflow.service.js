(function () {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi.nodes.manage-networks')
    .factory('horizon.dashboard.project.esi.nodes.manage-networks.workflow', manageNetworksWorkflow);

  manageNetworksWorkflow.$inject = [
    'horizon.dashboard.project.esi.nodes.manage-networks.basePath',
    'horizon.app.core.workflow.factory'
  ];

  function manageNetworksWorkflow(basePath, dashboardWorkflow) {
    return dashboardWorkflow({
      title: gettext('Manage Networks'),

      steps: [
        {
          id: 'attach',
          title: gettext('Attach'),
          templateUrl: basePath + 'attach/attach.html',
          formName: 'attachNetworkForm'
        },
        {
          id: 'detach',
          title: gettext('Detach'),
          templateUrl: basePath + 'detach/detach.html',
          formName: 'detachNetworkForm'
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