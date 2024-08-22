(function () {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi.nodes')
    .controller('horizon.dashboard.project.esi.nodes.EsiNodesTableController', controller);

  controller.$inject = [
    '$q',
    '$timeout',
    'horizon.dashboard.project.esi.nodes.esiNodesTableService',
    'horizon.dashboard.project.esi.nodes.nodeConfig',
    'horizon.dashboard.project.esi.nodes.nodeFilterFacets',
    'horizon.dashboard.project.esi.nodes.manage-networks.modal.service',
    'horizon.dashboard.project.esi.nodes.provisioning.modal.service',
    'horizon.dashboard.project.esi.nodes.unprovisioning.modal.service',
    'horizon.dashboard.project.esi.nodes.delete-leases.modal.service',
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

  function controller($q, $timeout, nodesService, config, filterFacets, manageNetworksModalService, provisioningModalService, unprovisioningModalService, deleteLeasesModalService, toastService, spinnerService) {
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
        });
      });
    }

    function deleteLease(nodes) {
      var launchContext = {
        nodes: nodes
      };

      deleteLeasesModalService.open(launchContext)
      .then(function (response) {
        const leasesToDelete = response.selectedLeases;
        spinnerService.showModalSpinner('Canceling Lease(s)');

        var promises = [];
        angular.forEach(nodes, function(node) {
          promises.push(nodesService.deleteLease(leasesToDelete[node.uuid].id)
          .then(function(response) {
            if (node.leases.length == 1) {
              var i = ctrl.nodesSrc.indexOf(node);
              if (i !== -1)
                ctrl.nodesSrc.splice(i, 1);
            }
          }));
        });

        $q.all(promises)
        .then(function(response) {
          ctrl.nodesDisplay = ctrl.nodesSrc;
          init();
        })
        .catch(function(response) {
          ctrl.nodesDisplay = ctrl.nodesSrc;
          init();
        });
      });
    }

    function provision(nodes) {
      provisioningModalService.open()
      .then(function(provision_params) {
        angular.forEach(nodes, function(node) {
          node.target_provision_state = 'active';
          nodesService.provision(node, provision_params);
        });

        $timeout(init, 60000);
      });
    }

    function unprovision(nodes) {
      if (nodes.length === 0) {
        toastService.add('error', 'No nodes were selected to unprovision.');
        return;
      }
      var launchContext = {
        nodes: nodes
      };

      unprovisioningModalService.open(launchContext)
        .then(function (confirmed) {
          if (confirmed) {
            angular.forEach(nodes, function(node) {
              node.target_provision_state = 'deleted';
              nodesService.unprovision(node)
                .catch(function(error) {
                  toastService.add('error', `Failed to unprovision node ${node.name}: ${error.data}`);
                });
            });

            $timeout(init, 60000);
          }
        });
    }

    function manageNodeNetworks(node) {
      var launchContext = {
        node: node
      };

      manageNetworksModalService.open(launchContext)
      .then(function (response) {
        if (response.action === 'attach') {
          nodesService.networkAttach(node, response.attach)
          .then(function() {
            init();
          });
        } else {
          nodesService.networkDetach(node, response.detach)
          .then(function() {
            init();
          });
        }
      });
    }
  }

})();
