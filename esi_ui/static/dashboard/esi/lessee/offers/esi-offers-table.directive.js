(function () {
  'use strict';

  angular
    .module('horizon.dashboard.esi.lessee.offers')
    .directive('esiOffersTable', esiOffersTable);

  esiOffersTable.$inject = [
    'horizon.dashboard.esi.lessee.offers.basePath'
  ];

  function esiOffersTable(basePath) {
    var directive = {
      restrict: 'E',
      scope: {
        offersDisplay: '=',
        offersSrc: '='
      },
      controller: 'horizon.dashboard.esi.lessee.offers.EsiOffersTableController as ctrl',
      templateUrl: basePath + 'esi-offers-table.html',
    };

    return directive;
  }
})();