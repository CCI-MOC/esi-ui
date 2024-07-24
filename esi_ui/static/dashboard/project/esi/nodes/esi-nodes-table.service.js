(function() {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi')
    .factory('horizon.dashboard.project.esi.esiNodesTableService', nodesService);
    
  nodesService.$inject = [
    '$uibModal',
    'horizon.framework.util.http.service',
    'horizon.dashboard.project.esi.basePath',
  ];
  
  function nodesService($uibModal, apiService, basePath) {
    var service = {
      nodeList: nodeList,
      setPowerState: setPowerState,
      deleteLease: deleteLease,
      editProvision: editProvision,
      provision: provision,
      unprovision: unprovision,
      editNetworks: editNetworks,
      networkAttach: networkAttach,
      networkDetach: networkDetach,
    };
    return service;

    function nodeList() {
      return apiService.get('/api/esi/nodes/');
    }

    function setPowerState(node, target_state) {
      var data = {
        target: target_state
      };

      return apiService.put('/api/esi/nodes/' + node.uuid + '/states/power', data);
    }

    function deleteLease(lease_uuid) {
      return apiService.delete('/api/esi/lease/' + lease_uuid);
    }

    function editProvision() {
      var modalConfig = {
        backdrop: 'static',
        keyboard: false,
        controller: 'horizon.dashboard.project.esi.ProvisionModalFormController as ctrl',
        templateUrl: basePath + 'forms/provision-modal-form.html'
      }

      return $uibModal.open(modalConfig).result;
    }
    
    function provision(node, provision_params) {
      return apiService.put('/api/esi/nodes/' + node.uuid + '/deploy/', provision_params);
    }

    function unprovision(node) {
      return apiService.put('/api/esi/nodes/' + node.uuid + '/undeploy/');
    }    

    function editNetworks() {
      var modalConfig = {
        backdrop: 'static',
        keyboard: false,
        controller: 'horizon.dashboard.project.esi.NetworkModalFormController as ctrl',
        templateUrl: basePath + 'forms/network-modal-form.html'
      };

      return $uibModal.open(modalConfig).result;
    }

    function networkAttach(node, network_params) {
      return apiService.post('/api/esi/nodes/' + node.uuid + '/vifs', network_params);
    }

    function networkDetach(node, network_params) {
      return apiService.delete('/api/esi/nodes/' + node.uuid + '/vifs/' + network_params.port);
    }
  }

})();
