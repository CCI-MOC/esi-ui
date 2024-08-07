(function () {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi')
    .directive('esiOffersTable', esiOffersTable);

  esiOffersTable.$inject = [
    'horizon.dashboard.project.esi.basePath'
  ];

  function esiOffersTable(basePath) {
    var directive = {
      restrict: 'E',
      scope: {
        offersDisplay: '=',
        offersSrc: '='
      },
      controller: 'horizon.dashboard.project.esi.EsiOffersTableController as ctrl',
      templateUrl: basePath + 'offers/esi-offers-table.html',
    };

    return directive;
  }
})();