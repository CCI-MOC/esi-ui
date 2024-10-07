(function () {
  'use strict';

  angular
    .module('horizon.dashboard.esi.owner.offers')
    .controller('horizon.dashboard.esi.owner.offers.EsiOffersTableController', controller);

  controller.$inject = [
    '$q',
    'horizon.app.core.openstack-service-api.esiService',
    'horizon.dashboard.esi.owner.offers.offerConfig',
    'horizon.dashboard.esi.owner.offers.offerFilterFacets',
    'horizon.dashboard.esi.create-offers.modal.service',
    'horizon.framework.widgets.toast.service',
    'horizon.framework.widgets.modal-wait-spinner.service',
    'horizon.app.core.openstack-service-api.keystone',
  ];

  function controller($q, esiService, config,
                      filterFacets, createOffersModalService,
                      toastService,
                      spinnerService, keystoneAPI) {
    var ctrl = this;

    ctrl.config = config;
    ctrl.filterFacets = filterFacets;
    ctrl.offersDisplay = [];
    ctrl.offersSrc = [];

    ctrl.createOffer = createOffer;
    ctrl.deleteOffer = deleteOffer;

    ////////////////

    spinnerService.showModalSpinner('Getting offers');
    init();

    function init() {
      var promises = [keystoneAPI.getCurrentUserSession(), esiService.offerList()];
      return $q.all(promises)
      .then(function(responses) {
        ctrl.project_name = responses[0].data.project_name;
        ctrl.offersSrc = responses[1].data.offers.filter(function(offer) {
          return offer.project === ctrl.project_name;
        });
        ctrl.offersDisplay = ctrl.offersSrc;
        console.log(ctrl.offersSrc);
        spinnerService.hideModalSpinner();
      })
      .catch(spinnerService.hideModalSpinner);
    }

    function createOffer() {
      createOffersModalService.open({})
      .then(function (response) {
        spinnerService.showModalSpinner('Creating Offer(s)');

        esiService.createOffer(response)
        .then(function() {
          toastService.add('info', 'Offer create requests sent');
          return init();
        })
        .catch(function() {
          toastService.add('error', 'Some or all offer create requests failed');
          return init();
        });
      });
    }

    function deleteOffer(offers) {
      spinnerService.showModalSpinner('Deleting Offer(s)');

      var promises = [];
      angular.forEach(offers, function(offer) {
        promises.push(esiService.deleteOffer(offer.uuid));
      });

      $q.all(promises).then(init).catch(init);
    }
  }

})();
