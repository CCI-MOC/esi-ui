(function () {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi')
    .controller('horizon.dashboard.project.esi.EsiNodesTableController', controller);

  controller.$inject = [
    '$q',
    '$timeout',
    'horizon.dashboard.project.esi.esiNodesTableService',
    'horizon.dashboard.project.esi.nodeConfig',
    'horizon.dashboard.project.esi.nodeFilterFacets',
    'horizon.dashboard.project.esi.nodes.manage-networks.modal.service',
    'horizon.framework.widgets.toast.service',
    'horizon.framework.widgets.modal-wait-spinner.service',
  ];

  const REFRESH_RATE = 10000;

  var POWER_ON_TRANSITIONS = [
    {
      state: 'power off',
      buttonDisplay: 'Power Off'
    },
    {
      state: 'soft power off',
      buttonDisplay: 'Soft Power Off'
    },
  ];
  var POWER_OFF_TRANSITIONS = [
    {
      state: 'power on',
      buttonDisplay: 'Power On'
    }
  ];

  const PROVISION_ERROR_STATES = new Set([
    'error',
    'deploy failed',
    'clean failed',
    'service failed',
    'inspect failed',
    'adopt failed',
    'rescue failed',
    'unrescue failed'
  ]);

  const PROVISION_STABLE_STATES = new Set([
    'manageable',
    'available',
    'active',
    'rescue'
  ]);

  function controller($q, $timeout, nodesService, config, filterFacets, manageNetworksModalService, toastService, spinnerService) {
    var ctrl = this;

    ctrl.config = config;
    ctrl.filterFacets = filterFacets;
    ctrl.nodesDisplay = [];
    ctrl.nodesSrc = [];

    ctrl.getPowerTransitions = getPowerTransitions;
    ctrl.setPowerState = setPowerState;
    ctrl.deleteLease = deleteLease;
    ctrl.provision = provision;
    ctrl.unprovision = unprovision;
    ctrl.manageNodeNetworks = manageNodeNetworks;

    ////////////////

    spinnerService.showModalSpinner('Getting nodes');
    init();

    function init() {
      return nodesService.nodeList()
      .then(function(response) {
        ctrl.nodesSrc = response.data.nodes;
        ctrl.nodesDisplay = ctrl.nodesSrc;
        console.log(ctrl.nodesSrc);

        var in_provision_transition = false;
        ctrl.nodesSrc.forEach(function(node) {
          if (PROVISION_ERROR_STATES.has(node.provision_state)) {
            return;
          }

          if (PROVISION_STABLE_STATES.has(node.target_provision_state)) {
            in_provision_transition = true;
          }
        });

        if (in_provision_transition) {
          $timeout(init, REFRESH_RATE);
        }

        spinnerService.hideModalSpinner();
      })
      .catch(function(response) {
        toastService.add('error', 'Unable to retrieve ESI nodes. ' + (response.data ? response.data : ''));
        spinnerService.hideModalSpinner();
      });
    }

    function getPowerTransitions(node) {
      if (node.power_state === 'power on')
        return POWER_ON_TRANSITIONS;

      return POWER_OFF_TRANSITIONS;
    }

    function setPowerState(nodes, target) {
      angular.forEach(nodes, function(node) {
        node.target_power_state = target;

        nodesService.setPowerState(node, target)
        .then(function(response) {
          node.power_state = response.data.power_state;
          node.target_power_state = null;
        })
        .catch(function(response) {
          node.target_power_state = null;
          toastService.add('error', 'Unable to set power state. ' + (response.data ? response.data : ''));
        });
      });
    }

    function deleteLease(nodes) {
      spinnerService.showModalSpinner('Canceling Lease(s)');

      var promises = [];
      angular.forEach(nodes, function(node) {
        promises.push(nodesService.deleteLease(node.lease_uuid)
        .then(function(response) {
          var i = ctrl.nodesSrc.indexOf(node);
          if (i !== -1)
            ctrl.nodesSrc.splice(i, 1);
        }));
      });

      $q.all(promises)
      .then(function(response) {
        ctrl.nodesDisplay = ctrl.nodesSrc;
        spinnerService.hideModalSpinner();
      })
      .catch(function(response) {
        ctrl.nodesDisplay = ctrl.nodesSrc;
        toastService.add('error', 'Unable to cancel lease. ' + (response.data ? response.data : ''));
        spinnerService.hideModalSpinner();
      });
    }

    function provision(nodes) {
      if (nodes.length === 0) {
        toastService.add('error', 'No nodes were selected to provision.');
        return;
      }

      nodesService.editProvision()
      .then(function(provision_params) {
        angular.forEach(nodes, function(node) {
          node.target_provision_state = 'active';
          nodesService.provision(node, provision_params)
          .catch(function(response) {
            toastService.add('error', 'Unable to provision a node. ' + (response.data ? response.data : ''));
          });
        });

        $timeout(init, 60000);
      });
    }

    function unprovision(nodes) {
      if (nodes.length === 0) {
        toastService.add('error', 'No nodes were selected to unprovision.');
        return;
      }

      angular.forEach(nodes, function(node) {
        node.target_provision_state = 'available';
        nodesService.unprovision(node)
        .catch(function(response) {
          toastService.add('error', 'Unable to unprovision a node. ' + (response.data ? response.data : ''));
        });
      });

      $timeout(init, 60000);
    }

    function manageNodeNetworks(node) {
      var launchContext = {
        node: node
      };

      manageNetworksModalService.open(launchContext)
      .then(function (response) {
        console.log('response: ', response);

        nodesService.networkAttach(node, response.action === 'attach' ? response.attach : response.detach)
        .then(function() {
          init();
        });
      });
    }
  }

})();