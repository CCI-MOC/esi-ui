(function () {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi.nodes.manage-floating-ips')
    .factory(
      'horizon.dashboard.project.esi.nodes.manage-floating-ips.modal.service',
      ManageFloatingIPsModalService
    );

  ManageFloatingIPsModalService.$inject = [
    '$uibModal',
    'horizon.dashboard.project.esi.nodes.manage-floating-ips.modal-spec'
  ];

  function ManageFloatingIPsModalService($uibModal, modalSpec) {
    var service = {
      open: open
    };

    return service;

    function open(launchContext) {
      var localSpec = {
        resolve: {
          launchContext: function () {
            return launchContext;
          }
        }
      };

      angular.extend(localSpec, modalSpec);

      return $uibModal.open(localSpec).result;
    }
  }

})();