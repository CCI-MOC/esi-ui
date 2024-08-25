(function () {
  'use strict';

  var noop = angular.noop;

  angular
    .module('horizon.dashboard.project.esi.nodes.manage-floating-ips')
    .factory('manageFloatingIPsModel', manageFloatingIPsModel);

  manageFloatingIPsModel.$inject = [
    'horizon.app.core.openstack-service-api.network',
    'horizon.app.core.openstack-service-api.neutron',
  ];

  function manageFloatingIPsModel(networkAPI, neutronAPI) {
    var floatingIPs = [];
    var ports = [];
    var model = {
      loaded: {
        attachable_floating_ips: false,
        ports: false,
      },

      attachable_floating_ips: [],

      disabled: {
        attachable_floating_ips: false,
      },
      
      initialize: initialize,
      submit: submit
    };

    return model;

    ////////////////

    function initialize() {
      networkAPI.getFloatingIps().then(onGetFloatingIPs, noop);
      neutronAPI.getPorts().then(onGetPorts, noop);
    }

    function submit(stepModels) {
      return Promise.resolve({
        stepModels,
        floatingIPs,
        ports,
      });
    }

    function onGetFloatingIPs(response) {
      floatingIPs = response.data.items;
      if (response.data.items.length < 3) {
        response.data.items.push({
          'floating_ip_address': 'Create new one',
          'status': 'DOWN'
        })
      }
      response.data.items = response.data.items.filter(item => item.status === 'DOWN');
      model.attachable_floating_ips = response.data.items;
      model.loaded.attachable_floating_ips = true;
    }

    function onGetPorts(response) {
      ports = response.data.items;
      model.loaded.ports = true;
    }
  }

})();