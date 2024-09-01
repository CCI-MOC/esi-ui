(function () {
    'use strict';
  
    angular
      .module('horizon.dashboard.esi.lessee.nodes.delete-leases')
      .factory('horizon.dashboard.esi.lessee.nodes.delete-leases.workflow', deleteLeasesWorkflow);
  
    deleteLeasesWorkflow.$inject = [
      'horizon.dashboard.esi.lessee.nodes.delete-leases.basePath',
      'horizon.app.core.workflow.factory'
    ];
  
    function deleteLeasesWorkflow(basePath, dashboardWorkflow) {
      return dashboardWorkflow({
        title: gettext('Delete Leases'),
  
        steps: [
          {
            id: 'delete',
            title: gettext('Delete'),
            templateUrl: basePath + 'delete.html',
            formName: 'deleteLeaseForm'
          },
        ],
  
        btnText: {
          finish: gettext('Delete')
        },
  
        btnIcon: {
          finish: 'fa-trash'
        }
      });
    }
  
  })();