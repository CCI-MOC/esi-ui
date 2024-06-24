(function() {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi')
    .controller('EsiController', EsiController);
    
  EsiController.$inject = [
    '$timeout',
    'nodesService',
    'horizon.dashboard.project.esi.config',
    'horizon.dashboard.project.esi.filterFacets',
    'actionsService',
    'horizon.framework.widgets.toast.service',
    'horizon.framework.widgets.modal-wait-spinner.service',
  ];
  
  function EsiController($timeout, nodesService, config, filterFacets, actionsService, toastService, spinnerService) {
    var ctrl = this;

    ctrl.config = config;
    ctrl.filterFacets = filterFacets;
    ctrl.batchActions = actionsService.getBatchActions();
    ctrl.itemActions = actionsService.getItemActions();
    ctrl.nodes = [];
    ctrl.nodesSrc = [];

    ctrl.resultHandler = resultHandler;

    ////////////////

    spinnerService.showModalSpinner('Refreshing');
    init()
    .then(function() {
      spinnerService.hideModalSpinner();
    });

    function init() {
      ctrl.nodes.length = 0;
      return nodesService.nodeList()
      .then(function(response) {
        console.log('controller: init response: ', response);
        ctrl.nodes = response.data.nodes;
        ctrl.nodesSrc = response.data.nodes;
      })
      .catch(function(response) {
        toastService.add('error', 'Unable to retrieve ESI nodes. ' + (response.data ? response.data : ''));
      });
    }

    function resultHandler(promise) {
      promise
      .then(function(response) {
        if (response.action) {
          switch (response.action.name) {
          case 'refresh':
            spinnerService.showModalSpinner('Refreshing');
            init()
            .then(function() {
              spinnerService.hideModalSpinner();
            });
            break;
          case 'setPower':
            toastService.add('success', 'Request submitted.');
            console.log('Controller: Request submitted. ', response);
            refreshUntilUpdated();
            break;
          default:
            toastService.add('success', 'Request submitted.');
            console.log('Controller: Request submitted. ', response);
          }
        }
      })
      .catch(function(response) {
        spinnerService.hideModalSpinner();
        toastService.add('error', 'Request failed. ' + (response.data ? response.data : ''));
        console.log('Controller: Request failed. ', response);
      });
    }

    function refreshUntilUpdated() {
      nodesService.nodeList()
      .then(function(response) {
        nodes = response.data.nodes;
        ctrl.nodes.length = 0;
        ctrl.nodes = nodes;
        ctrl.nodesSrc = nodes;
        for (var i = 0, len = nodes.length; i < len; ++i) {
          if (nodes[i].target_power_state !== null && nodes[i].power_state !== nodes[i].target_power_state) {
            $timeout(refreshUntilUpdated, 10000);
            break;
          }
        }
      })
      .catch(function(response) {
        toastService.add('error', 'Cannot automatically refresh. ' + (response.data ? response.data : ''));
      });
    }
  }
})();
