/**
 * Created by fagnerng on 24/10/2015.
 */
(function () {
    'use strict';

    angular.module('EcotechApp')
            .controller('GardenController', gardenController);

    function gardenController($stateParams, $scope, Weather) {
        $scope.g = {
            city: '',
            name: '',
        };

        $scope.autocomplete = function() {
            Weather.autocomplete($scope.g.city).then(function (response){
                $scope.cities = response.data.RESULTS.slice(0,3);
                $scope.showAutoComplete = true;
            });
        };

        $scope.select = function(city) {

            $scope.g.city = city.name;
            $scope.g.zmw = city.zmw;
            console.log(JSON.stringify( $scope.g));
            Weather.hourly(city.zmw).then(function(response) {
                console.log(JSON.stringify(response));
            });

            return $scope.g;
        };

        $scope.dimissPopOver = function() {
            $scope.showAutoComplete = false;
            return $scope.showAutoComplete;
        };

        $scope.cities = [];

    }

})();