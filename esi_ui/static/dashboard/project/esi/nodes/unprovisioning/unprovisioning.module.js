(function () {
    'use strict';

    angular
        .module('horizon.dashboard.project.esi.nodes.unprovisioning', [])
        .config(config)
        .constant('horizon.dashboard.project.esi.nodes.unprovisioning.modal-spec', {
            backdrop: 'static',
            size: 'lg',
            controller: 'ModalContainerController',
            template: '<wizard class="wizard" ng-controller="UnprovisioningWizardController"></wizard>'
        });

    config.$inject = [
        '$provide',
        '$windowProvider'
    ];

    function config($provide, $windowProvider) {
        var basePath = $windowProvider.$get().STATIC_URL + 'dashboard/project/esi/nodes/unprovisioning/';
        $provide.constant('horizon.dashboard.project.esi.nodes.unprovisioning.basePath', basePath);
    }

})();
