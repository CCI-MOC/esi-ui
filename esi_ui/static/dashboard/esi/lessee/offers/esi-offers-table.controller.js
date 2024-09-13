(function () {
  'use strict';

  angular
    .module('horizon.dashboard.esi.lessee.offers')
    .controller('horizon.dashboard.esi.lessee.offers.EsiOffersTableController', controller);

  controller.$inject = [
    '$q',
    'horizon.app.core.openstack-service-api.esiService',
    'horizon.dashboard.esi.lessee.offers.offerConfig',
    'horizon.dashboard.esi.lessee.offers.offerFilterFacets',
    'horizon.dashboard.esi.lessee.offers.claim.modal.service',
    'horizon.framework.widgets.toast.service',
    'horizon.framework.widgets.modal-wait-spinner.service',
  ];

  function controller($q, esiService, config, filterFacets, ClaimModalService, toastService, spinnerService) {
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
      return esiService.offerList()
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
          promises.push(esiService.offerClaim(offer, times));
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