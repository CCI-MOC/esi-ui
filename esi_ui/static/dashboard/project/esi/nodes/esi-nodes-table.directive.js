(function () {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi')
    .directive('esiNodesTable', esiNodesTable);

  esiNodesTable.$inject = [
    'horizon.dashboard.project.esi.basePath'
  ];

  function esiNodesTable(basePath) {
    var directive = {
      restrict: 'E',
      scope: {},
      controller: 'horizon.dashboard.project.esi.EsiNodesTableController as ctrl',
      templateUrl: basePath + 'nodes/esi-nodes-table.html',
    };

    return directive;
  }
})();