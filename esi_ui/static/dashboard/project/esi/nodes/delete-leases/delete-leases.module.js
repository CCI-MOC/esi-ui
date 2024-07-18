(function () {
    'use strict';

    angular
        .module('horizon.dashboard.project.esi.nodes.delete-leases', [])
        .config(config)
        .constant('horizon.dashboard.project.esi.nodes.delete-leases.modal-spec', {
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
        var basePath = $windowProvider.$get().STATIC_URL + 'dashboard/project/esi/nodes/delete-leases/';
        $provide.constant('horizon.dashboard.project.esi.nodes.delete-leases.basePath', basePath);
    }

})();