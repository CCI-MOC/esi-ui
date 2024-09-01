(function () {
    'use strict';

    angular
        .module('horizon.dashboard.esi.lessee.nodes.unprovisioning', [])
        .config(config)
        .constant('horizon.dashboard.esi.lessee.nodes.unprovisioning.modal-spec', {
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
        var basePath = $windowProvider.$get().STATIC_URL + 'dashboard/esi/lessee/nodes/unprovisioning/';
        $provide.constant('horizon.dashboard.esi.lessee.nodes.unprovisioning.basePath', basePath);
    }

})();
