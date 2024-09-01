(function () {
    'use strict';

    angular
      .module('horizon.dashboard.esi.lessee.nodes.unprovisioning')
      .factory('horizon.dashboard.esi.lessee.nodes.unprovisioning.workflow', unprovisioningWorkflow);

    unprovisioningWorkflow.$inject = [
      'horizon.dashboard.esi.lessee.nodes.unprovisioning.basePath',
      'horizon.app.core.workflow.factory'
    ];

    function unprovisioningWorkflow(basePath, dashboardWorkflow) {
      return dashboardWorkflow({
        title: gettext('Unprovision Node'),

        steps: [
          {
            id: 'unprovision',
            title: gettext('Unprovision'),
            templateUrl: basePath + 'unprovisioning.html',
            formName: 'unprovisionForm'
          },
        ],

        btnText: {
          finish: gettext('Unprovision')
        },

        btnIcon: {
          finish: 'fa-times'
        }
      });
    }

})();
