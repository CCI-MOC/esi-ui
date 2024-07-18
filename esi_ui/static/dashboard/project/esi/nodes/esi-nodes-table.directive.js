(function () {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi.nodes')
    .directive('esiNodesTable', esiNodesTable);

  esiNodesTable.$inject = [
    'horizon.dashboard.project.esi.nodes.basePath'
  ];

  function esiNodesTable(basePath) {
    var directive = {
      restrict: 'E',
      scope: {},
      controller: 'horizon.dashboard.project.esi.nodes.EsiNodesTableController as ctrl',
      templateUrl: basePath + 'esi-nodes-table.html',
    };

    return directive;
  }
})();