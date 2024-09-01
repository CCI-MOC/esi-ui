(function () {
  'use strict';

  var noop = angular.noop;

  angular
    .module('horizon.dashboard.esi.create-offers')
    .factory('createOffersModel', createOffersModel);

  createOffersModel.$inject = [
    '$q',
    'horizon.app.core.openstack-service-api.esiService',
    'horizon.app.core.openstack-service-api.keystone',
  ];

  function createOffersModel($q, esiService, keystoneAPI) {
    var model = {
      loaded: {
        nodes: false,
      },

      nodes: [],

      initialize: initialize,
      submit: submit
    };

    return model;

    ////////////////

    function initialize() {
      $q.all([keystoneAPI.getCurrentUserSession(), esiService.nodeList()])
      .then(function(responses) {
        model.nodes = responses[1].data.nodes.filter(function(node) {
          return node.owner === responses[0].data.project_name;
        });
        console.log(model.nodes);
        model.loaded.nodes = true;
      });
    }

    function submit(stepModels) {
      var start = null;
      var end = null;

      if (stepModels.start_date) {
        start = new Date();
        start.setUTCFullYear(stepModels.start_date.getUTCFullYear());
        start.setUTCMonth(stepModels.start_date.getUTCMonth());
        start.setUTCDate(stepModels.start_date.getUTCDate());
        start.setUTCHours(stepModels.start_time.getHours());
        start.setUTCMinutes(stepModels.start_time.getMinutes());
        start.setUTCSeconds(0);
        start.setUTCMilliseconds(0);
      }
      if (stepModels.end_date) {
        end = new Date();
        end.setUTCFullYear(stepModels.end_date.getUTCFullYear());
        end.setUTCMonth(stepModels.end_date.getUTCMonth());
        end.setUTCDate(stepModels.end_date.getUTCDate());
        end.setUTCHours(stepModels.end_time.getHours());
        end.setUTCMinutes(stepModels.end_time.getMinutes());
        end.setUTCSeconds(0);
        end.setUTCMilliseconds(0);
      }

      return Promise.resolve({
        start_time: start,
        end_time: end,
        resource_uuid: stepModels.resource_uuid,
      });
    }
  }

})();
