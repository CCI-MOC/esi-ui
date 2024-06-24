(function() {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi')
    .factory('actionsService', actionsService);

  actionsService.$inject = [
    '$q',
    'nodesService',
    'horizon.dashboard.project.esi.basePath',
    'horizon.framework.widgets.modal-wait-spinner.service',
  ];

  /*
    structure of what perform functions should return so that
    the controller's resultHandler can properly handle
    
    return $q.resolve({
      type: 'row'/'batch'
      name: 'exampleAction',
      data: exampleData,
    });
  
    return $q.reject(msg)
  */

  function actionsService($q, nodesService, basePath, spinnerService) {
    var menuAction = {
      type: 'row',
      service: {
        allowed: function(node) {
          return $q.resolve(true);
        },
        perform: function(node) {
          console.log('actionsService: menuAction ', node);
        }
      },
      template: {
        url: basePath + 'actions/actions-button.html'
      }
    };

    var setPowerOnAction = {
      type: 'row',
      service: {
        allowed: function(node) {
          return $q.resolve(true);
        },
        perform: function(node) {
          spinnerService.showModalSpinner('Sending request');
          return setPowerState(node, 'power on');
        }
      },
      template: {
        text: 'Power On',
      }
    };

    var setPowerOffAction = {
      type: 'row',
      service: {
        allowed: function(node) {
          return $q.resolve(true);
        },
        perform: function(node) {
          spinnerService.showModalSpinner('Sending request');
          return setPowerState(node, 'power off');
        }
      },
      template: {
        text: 'Power Off',
      }
    };

    var refreshAction = {
      type: 'batch',
      service: {
        allowed: function() {
          return $q.resolve(true);
        },
        perform: function() {
          return $q.resolve({action: {name: 'refresh'}});
        }
      },
      template: {
        text: 'Refresh Nodes'
      }
    };

    var itemActions = [
      menuAction,
      setPowerOnAction,
      setPowerOffAction,
    ];
    var batchActions = [
      refreshAction,
    ];
    return {
      getItemActions: function() {
        return itemActions;
      },
      getBatchActions: function() {
        return batchActions;
      },
    };

    function setPowerState(node, target_state) {
      return nodesService.setPowerState(node, target_state)
      .then(function(response) {
        spinnerService.hideModalSpinner();
        response.action = {
          name: 'setPower'
        };
        return $q.resolve(response);
      })
      .catch(function(response) {
        response.data = 'Unable to set power state. ' + response.data;
        return $q.reject(response);
      });
    }
  }
})();