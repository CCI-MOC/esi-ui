(function() {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi.nodes')
    .factory('horizon.dashboard.project.esi.nodes.esiNodesTableService', nodesService);
    
  nodesService.$inject = [
    'horizon.framework.util.http.service',
    'horizon.framework.widgets.toast.service',
  ];
  
  function nodesService(apiService, toastService) {
    var service = {
      nodeList: nodeList,
      setPowerState: setPowerState,
      deleteLease: deleteLease,
      provision: provision,
      unprovision: unprovision,
      networkAttach: networkAttach,
      networkDetach: networkDetach,
    };
    return service;

    function nodeList() {
      return apiService.get('/api/esi/nodes/').catch(err => {
        toastService.add('error', 'Unable to retrieve ESI nodes. ' + (err.data ? err.data : ''))
        return Promise.reject(err);
      });
    }

    function setPowerState(node, target_state) {
      var data = {
        target: target_state
      };

      return apiService.put('/api/esi/nodes/' + node.uuid + '/states/power', data).catch(err => {
        toastService.add('error', 'Unable to set power state. ' + (err.data ? err.data : ''))
        return Promise.reject(err);
      });
    }

    function deleteLease(lease_uuid) {
      return apiService.delete('/api/esi/lease/' + lease_uuid).catch(err => {
        toastService.add('error', 'Unable to delete lease(s). ' + (err.data ? err.data : ''))
        return Promise.reject(err);
      });
    }

    function provision(node, provision_params) {
      return apiService.put('/api/esi/nodes/' + node.uuid + '/deploy/', provision_params).catch(err => {
        toastService.add('error', 'Unable to provision a node. ' + (err.data ? err.data : ''))
        return Promise.reject(err);
      });
    }

    function unprovision(node) {
      return apiService.put('/api/esi/nodes/' + node.uuid + '/undeploy/').catch(err => {
        toastService.add('error', 'Unable to unprovision a node. ' + (err.data ? err.data : ''))
        return Promise.reject(err);
      });
    }    

    function networkAttach(node, network_params) {
      return apiService.post('/api/esi/nodes/' + node.uuid + '/vifs', network_params).catch(err => {
        toastService.add('error', 'Unable to attach network. ' + (err.data ? err.data : ''))
        return Promise.reject(err);
      });
    }

    function networkDetach(node, network_params) {
      return apiService.delete('/api/esi/nodes/' + node.uuid + '/vifs/' + network_params.port).catch(err => {
        toastService.add('error', 'Unable to detach network. ' + (err.data ? err.data : ''))
        return Promise.reject(err);
      });
    }
  }

})();
