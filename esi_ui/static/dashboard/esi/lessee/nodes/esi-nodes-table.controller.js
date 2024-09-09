(function () {
  'use strict';

  angular
    .module('horizon.dashboard.esi.lessee.nodes')
    .controller('horizon.dashboard.esi.lessee.nodes.EsiNodesTableController', controller);

  controller.$inject = [
    '$q',
    '$timeout',
    'horizon.dashboard.esi.lessee.nodes.esiNodesTableService',
    'horizon.dashboard.esi.lessee.nodes.nodeConfig',
    'horizon.dashboard.esi.lessee.nodes.nodeFilterFacets',
    'horizon.dashboard.esi.lessee.nodes.manage-networks.modal.service',
    'horizon.dashboard.esi.lessee.nodes.manage-floating-ips.modal.service',
    'horizon.dashboard.esi.lessee.nodes.provisioning.modal.service',
    'horizon.dashboard.esi.lessee.nodes.unprovisioning.modal.service',
    'horizon.dashboard.esi.delete-leases.modal.service',
    'horizon.framework.widgets.toast.service',
    'horizon.framework.widgets.modal-wait-spinner.service',
    'horizon.app.core.openstack-service-api.keystone',
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

  function controller($q, $timeout, nodesService, config,
                      filterFacets, manageNetworksModalService,
                      manageFloatingIPsModalService, provisioningModalService,
                      unprovisioningModalService, deleteLeasesModalService,
                      toastService, spinnerService, keystoneAPI) {
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
    ctrl.manageFloatingIPs = manageFloatingIPs;

    ////////////////

    spinnerService.showModalSpinner('Getting nodes');
    init();

    function init() {
      var promises = [keystoneAPI.getCurrentUserSession(), nodesService.nodeList()];
      return $q.all(promises)
      .then(function(responses) {
        ctrl.project_name = responses[0].data.project_name;
        ctrl.nodesSrc = responses[1].data.nodes.filter(function(node) {
          return node.leases.length === 0
                 || node.leases[0].project === ctrl.project_name
                 || (node.owner === ctrl.project_name && node.leases[0].status === 'created');
        });
        ctrl.nodesDisplay = ctrl.nodesSrc;
        console.log(ctrl.nodesSrc);

        var in_provision_transition = false;
        ctrl.nodesSrc.forEach(function(node) {
          node.network_operation = null; 
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
            node.is_operation_initiated = true;
            node.target_provision_state = 'in progress';
    
            nodesService.provision(node, provision_params)
              .then(function() {
                return pollNodeStatus(node);
              })
              .catch(function(error) {
                node.target_provision_state = null;
                node.is_operation_initiated = false;
                toastService.add('error', `Failed to provision node ${node.name}: ${error.data}`);
              });
          });
        });
    }
    
    function unprovision(nodes) {
      var launchContext = {
        nodes: nodes
      };
    
      unprovisioningModalService.open(launchContext)
        .then(function(confirmed) {
          if (confirmed) {
            angular.forEach(nodes, function(node) {
              node.is_operation_initiated = true;
              node.target_provision_state = 'in progress';
    
              nodesService.unprovision(node)
                .then(function() {
                  return pollNodeStatus(node);
                })
                .catch(function(error) {
                  node.target_provision_state = null;
                  node.is_operation_initiated = false;
                  toastService.add('error', `Failed to unprovision node ${node.name}: ${error.data}`);
                });
            });
          }
        });
    }
    
    function pollNodeStatus(node) {
      const stopPolling = (errorMessage) => {
        node.target_provision_state = null;
        node.is_operation_initiated = false;
        if (errorMessage) {
          toastService.add('error', errorMessage);
        }
      };
    
      const checkStatus = function() {
        nodesService.nodeList()
          .then(function(response) {
            var updatedNode = response.data.nodes.find(n => n.uuid === node.uuid);
            node.provision_state = updatedNode.provision_state;
            node.target_provision_state = updatedNode.target_provision_state;
    
            if (PROVISION_ERROR_STATES.has(node.provision_state)) {
              stopPolling(`Deployment failed for node ${node.name}`);
            } else if (PROVISION_STABLE_STATES.has(node.provision_state)) {
              stopPolling();
            } else {
              $timeout(checkStatus, REFRESH_RATE);
            }
          })
          .catch(function(error) {
            stopPolling(`Failed to update node status for ${node.name}: ${error.data}`);
          });
      };
    
      checkStatus();
    }

    function manageNodeNetworks(node) {
      var launchContext = {
       node: node
      };
     
      if (ctrl.networkOperationInProgress) {
       return;
      }
     
      ctrl.networkOperationInProgress = true;
     
      manageNetworksModalService.open(launchContext)
       .then(function(response) {
        if (response.action === 'attach') {
         node.network_operation = 'attaching';
         toastService.add('success', 'Attaching network, please wait...');
     
         nodesService.networkAttach(node, response.attach)
          .then(function() {
           return init();
          })
          .then(function() {
           node.network_operation = null;
           toastService.add('success', 'Network attached successfully.');
           ctrl.networkOperationInProgress = false;
          })
          .catch(function() {
           node.network_operation = null;
           toastService.add('error', 'Failed to attach network.');
           ctrl.networkOperationInProgress = false;
          });
     
        } else if (response.action === 'detach') {
         node.network_operation = 'detaching';
         toastService.add('success', 'Detaching network, please wait...');
     
         nodesService.networkDetach(node, response.detach)
          .then(function() {
           return init();
          })
          .then(function() {
           node.network_operation = null;
           toastService.add('success', 'Network detached successfully.');
           ctrl.networkOperationInProgress = false;
          })
          .catch(function() {
           node.network_operation = null;
           toastService.add('error', 'Failed to detach network.');
           ctrl.networkOperationInProgress = false;
          });
        }
       });
    }

    function manageFloatingIPs(node) {
      var launchContext = {
        ports: [],
        detachable_floating_ips: [],
      };

      var network_port_names = node['network_port_names'];
      var floating_ips = node['floating_ips'];
      for (var i = 0; i < floating_ips.length; i++) {
        if (network_port_names[i].length > 0) {
          if (floating_ips[i].length == 0) {
            launchContext.ports.push(network_port_names[i]);
          }
          if (floating_ips[i].length > 0) {
            launchContext.detachable_floating_ips.push(floating_ips[i] + ' (' + network_port_names[i] + ')');
          }
        }
      }

      manageFloatingIPsModalService.open(launchContext)
      .then(function (response) {
        const stepModels = response.stepModels;
        const floatingIPs = response.floatingIPs;
        const ports = response.ports;
        if (stepModels.action === 'attach') {
          spinnerService.showModalSpinner('Attaching Floating IP');
          const floatingIPAddress = stepModels.attach.floating_ip.floating_ip_address;
          const floatingIPId = floatingIPAddress === 'Create new one' ? 'Create new one' : floatingIPs.filter(ip => ip.ip === floatingIPAddress)[0]?.id;
          const port = ports.filter(port => port.name === stepModels.attach.port)[0];
          const portID = port?.id + "_" + port?.fixed_ips[0]?.ip_address;
          const floatingIPNetworkId = floatingIPs.filter(ip => ip.ip !== 'Create new one')[0]?.floating_network_id;
          nodesService.floatingIPAttach({
            id: floatingIPId,
            networkID: floatingIPNetworkId
          }, portID)
          .then(function() {
            init();
          }).catch(err => {
            console.log(err);
          });
        } else {
          spinnerService.showModalSpinner('Detaching Floating IP');
          const floatingIPString = stepModels.detach.floating_ip.split(" ")[0];
          const floatingIPtoDetach = floatingIPs.filter(ip => ip.ip === floatingIPString)[0]?.id;
          nodesService.floatingIPDetach(floatingIPtoDetach)
          .then(function() {
            init();
          }).catch(err => {
            console.log(err);
          });
        }
      });
    }
  }

})();