/**
 * Created by fagnerng on 21/10/2015.
 */
(function() {
    'use strict';

    angular.module('EcotechApp')
            .controller('PlantsController', PlantsController);

    function PlantsController($state , Gardens) {
        var vm = this;
        vm.plantsList = Gardens.plantsList;

        vm.show = function (item) {
            $state.go('plant', {type: item});
        };
    }

})();