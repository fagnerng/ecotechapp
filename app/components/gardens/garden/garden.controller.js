/**
 * Created by fagnerng on 24/10/2015.
 */
(function () {
    'use strict';

    angular.module('EcotechApp')
            .controller('GardenController', gardenController);

    function gardenController($stateParams, $scope, Weather) {
        console.log(JSON.stringify($stateParams));
        var vm = this;
        $scope.g = {
            city: '',
        }


        $scope.autocomplete = function() {
            Weather.autocomplete($scope.g.city).then(function (response){
                console.log(JSON.stringify(response.data));
            });
        }
    }

})();