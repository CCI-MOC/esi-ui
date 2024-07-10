(function() {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi')
    .factory('horizon.dashboard.project.esi.esiNodesTableService', nodesService);
    
  nodesService.$inject = [
    'horizon.framework.util.http.service',
  ];
  
  function nodesService(apiService) {
    var service = {
      nodeList: nodeList,
      setPowerState: setPowerState,
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
  }

})();
