(function () {
  'use strict';

  angular
    .module('horizon.dashboard.esi.owner.leases')
    .controller('horizon.dashboard.esi.owner.leases.EsiLeasesTableController', controller);

  controller.$inject = [
    '$q',
    'horizon.app.core.openstack-service-api.esiService',
    'horizon.dashboard.esi.owner.leases.leaseConfig',
    'horizon.dashboard.esi.owner.leases.leaseFilterFacets',
    'horizon.dashboard.esi.create-leases.modal.service',
    'horizon.dashboard.esi.delete-leases.modal.service',
    'horizon.framework.widgets.toast.service',
    'horizon.framework.widgets.modal-wait-spinner.service',
    'horizon.app.core.openstack-service-api.keystone',
  ];

  function controller($q, nodesService, config,
                      filterFacets, createLeasesModalService,
                      deleteLeasesModalService, toastService,
                      spinnerService, keystoneAPI) {
    var ctrl = this;

    ctrl.config = config;
    ctrl.filterFacets = filterFacets;
    ctrl.nodesDisplay = [];
    ctrl.nodesSrc = [];

    ctrl.createLease = createLease;
    ctrl.deleteLease = deleteLease;

    ////////////////

    spinnerService.showModalSpinner('Getting leases');
    init();

    function init() {
      var promises = [keystoneAPI.getCurrentUserSession(), nodesService.nodeList()];
      return $q.all(promises)
      .then(function(responses) {
        ctrl.project_name = responses[0].data.project_name;
        ctrl.nodesSrc = responses[1].data.nodes.filter(function(node) {
          return node.owner === ctrl.project_name;
        });
        ctrl.nodesDisplay = ctrl.nodesSrc;
        console.log(ctrl.nodesSrc);
        spinnerService.hideModalSpinner();
      })
      .catch(spinnerService.hideModalSpinner);
    }

    function createLease(nodes) {
      createLeasesModalService.open({})
      .then(function (response) {
        spinnerService.showModalSpinner('Creating Lease(s)');

        var promises = [];
        angular.forEach(nodes, function(node) {
          response.resource_uuid = node.uuid;
          promises.push(nodesService.createLease(response));
        });

        $q.all(promises)
        .then(function() {
          toastService.add('info', 'Lease create requests sent');
          return init();
        })
        .catch(function() {
          toastService.add('error', 'Some or all lease create requests failed');
          return init();
        })
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
        .then(function() {
          ctrl.nodesDisplay = ctrl.nodesSrc;
          init();
        })
        .catch(function() {
          ctrl.nodesDisplay = ctrl.nodesSrc;
          init();
        });
      });
    }
  }

})();