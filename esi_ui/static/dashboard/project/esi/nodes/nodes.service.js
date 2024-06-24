(function() {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi')
    .factory('nodesService', nodesService);
    
  nodesService.$inject = [
    '$q',
    'horizon.framework.util.http.service',
  ];
  
  function nodesService($q, apiService) {
    var service = {
      nodeList: nodeList,
      setPowerState: setPowerState
    };
    return service;

    function nodeList() {
      return apiService.get('/api/esi/nodes/');
    }

    function setPowerState(node, target_state) {
      if (node.power_state === target_state) {
        return $q.reject({
          status: 400,
          data: 'Power state is already ' + target_state
        });
      }

      var data = {
        target: target_state
      };

      return apiService.put('/api/esi/nodes/' + node.uuid + '/states/power', data);
    }
  }
})();
