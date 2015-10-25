/**
 * Created by fagnerng on 21/10/2015.
 */
(function() {
    'use strict';

    angular.module('EcotechApp')
            .controller('PlantsController', PlantsController);

    function PlantsController($state) {
        var vm = this;
        vm.plantsList = {
            alecrim: 'alecrim',
            cebolinha: 'cebolinha',
            coentro: 'coentro',
            hortela: 'hortela',
            manjericao: 'manjericao',
            oregano: 'oregano',
            salsinha: 'salsinha',
            salvia: 'salvia',
            tomilho: 'tomilho'
        };

        vm.show = function (item) {
            $state.go('plant', {type: item});
        };
    }

})();