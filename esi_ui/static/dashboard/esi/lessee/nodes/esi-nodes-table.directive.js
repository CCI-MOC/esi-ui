(function () {
  'use strict';

  angular
    .module('horizon.dashboard.esi.lessee.nodes')
    .directive('esiNodesTable', esiNodesTable);

  esiNodesTable.$inject = [
    'horizon.dashboard.esi.lessee.nodes.basePath'
  ];

  function esiNodesTable(basePath) {
    var directive = {
      restrict: 'E',
      scope: {},
      controller: 'horizon.dashboard.esi.lessee.nodes.EsiNodesTableController as ctrl',
      templateUrl: basePath + 'esi-nodes-table.html',
    };

    return directive;
  }
})();