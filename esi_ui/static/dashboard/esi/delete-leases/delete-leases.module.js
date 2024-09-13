(function () {
    'use strict';

    angular
        .module('horizon.dashboard.esi.delete-leases', [])
        .config(config)
        .constant('horizon.dashboard.esi.delete-leases.modal-spec', {
            backdrop: 'static',
            size: 'lg',
            controller: 'ModalContainerController',
            template: '<wizard class="wizard" ng-controller="DeleteLeasesWizardController"></wizard>'
        });

    config.$inject = [
        '$provide',
        '$windowProvider'
    ];

    function config($provide, $windowProvider) {
        var basePath = $windowProvider.$get().STATIC_URL + 'dashboard/esi/delete-leases/';
        $provide.constant('horizon.dashboard.esi.delete-leases.basePath', basePath);
    }

})();