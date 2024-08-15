(function () {
  'use strict';

  angular
    .module('horizon.dashboard.project.esi.offers')
    .controller('horizon.dashboard.project.esi.offers.EsiOffersTableController', controller);

  controller.$inject = [
    '$q',
    'horizon.dashboard.project.esi.offers.esiOffersTableService',
    'horizon.dashboard.project.esi.offers.offerConfig',
    'horizon.dashboard.project.esi.offers.offerFilterFacets',
    'horizon.dashboard.project.esi.offers.claim.modal.service',
    'horizon.framework.widgets.toast.service',
    'horizon.framework.widgets.modal-wait-spinner.service',
  ];

  function controller($q, offersService, config, filterFacets, ClaimModalService, toastService, spinnerService) {
    var ctrl = this;

    ctrl.config = config;
    ctrl.filterFacets = filterFacets;
    ctrl.offersDisplay = [];
    ctrl.offersSrc = [];

    ctrl.offerClaim = offerClaim;

    ////////////////

    spinnerService.showModalSpinner('Getting Offers');
    init();

    function init() {
      return offersService.offerList()
      .then(function(response) {
        ctrl.offersSrc = response.data.offers;
        ctrl.offersDisplay = ctrl.offersSrc;
        console.log(ctrl.offersSrc);
        spinnerService.hideModalSpinner();
      })
      .catch(function(response) {
        toastService.add('error', 'Unable to retrieve ESI offers. ' + (response.data ? response.data : ''));
        spinnerService.hideModalSpinner();
      })
    }

    function offerClaim(offers) {
      if (offers.length === 0) {
        toastService.add('error', 'No offers were selected to claim.');
        return;
      }

      ClaimModalService.open()
      .then(function(times) {
        spinnerService.showModalSpinner('Claiming Offer(s)');

        var promises = [];
        angular.forEach(offers, function(offer) {
          promises.push(offersService.offerClaim(offer, times));
        });

        $q.all(promises)
        .then(function(response) {
          init();
        })
        .catch(function(response) {
          toastService.add('error', 'Unable to claim an offer. ' + (response.data ? response.data : ''));
          spinnerService.hideModalSpinner();
        });
      });
    }
  }

})();