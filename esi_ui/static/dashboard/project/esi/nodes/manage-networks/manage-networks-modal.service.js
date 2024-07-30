(function () {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi.nodes.manage-networks')
    .factory(
      'horizon.dashboard.project.esi.nodes.manage-networks.modal.service',
      ManageNetworksModalService
    );

  ManageNetworksModalService.$inject = [
    '$uibModal',
    'horizon.dashboard.project.esi.nodes.manage-networks.modal-spec'
  ];

  function ManageNetworksModalService($uibModal, modalSpec) {
    var service = {
      open: open
    };

    return service;

    function open(launchContext) {
      var localSpec = {
        resolve: {
          launchContext: function () {
            launchContext.node.attachable_mac_addresses = launchContext.node.mac_addresses.filter(function(mac_address, index) {
              return !launchContext.node.network_names[index];
            });
            launchContext.node.detachable_ports = launchContext.node.network_port_names.filter(function(port_name) {
              return port_name;
            });

            return launchContext;
          }
        }
      };

      angular.extend(localSpec, modalSpec);

      return $uibModal.open(localSpec).result;
    }
  }

})();