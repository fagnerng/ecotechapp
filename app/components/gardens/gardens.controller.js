/**
 * Created by fagnerng on 21/10/2015.
 */
(function() {
    'use strict';

    angular.module('EcotechApp')
            .controller('GardensController', GardensController);

    function GardensController($log) {
        $log.debug('GardensController');
        var vm = this;
        vm.gardensList = [1,2,3,4,5,6,7,8,9.0];
    }

})();