/**
 * Created by fagnerng on 21/10/2015.
 */
(function() {
    'use strict';

    angular.module('EcotechApp')
            .controller('GardensController', GardensController);

    /*jshint esnext: true */
    function GardensController($ionicPlatform, $scope, $state,  $ionicListDelegate, $ionicPopup, Gardens, Weather) {
        $scope.gardens = {};
        $ionicPlatform.ready(function() {
            $scope.$on('$ionicView.enter', function(){
                updateGardens();
            });
            updateGardens();

        });


        function updateGardens() {
            $scope.loading = true;
            Gardens.getAllGardens().then(function(response) {
                $scope.loading = false;
                $scope.gardens = response;
                updateGardensWeather();
                $scope.$applyAsync();
            });
        }

        function updateGardensWeather(){
            for (var key in $scope.gardens) {
                Weather.hourly($scope.gardens[key].zmw).then(function(response) {
                    var forecast = response.data.hourly_forecast;
                    $scope.gardens[key].url = forecast[0].icon_url;
                    $scope.$applyAsync();
                })
            }
        }
        $scope.addGarden = function() {
            $ionicListDelegate.closeOptionButtons();
            $state.go('garden', {id: '_new'});
        };

        $scope.show = function(id) {
            $ionicListDelegate.closeOptionButtons();
            $state.go('garden', {id: id});
        };

        $scope.showRemoveConfirm = function(id) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Deseja remover horta?',
                template: '<center>Opera&#231;&#227;o n&#227;o pode ser desfeita</center>'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    $scope.gardens[id] = undefined;
                    Gardens.save($scope.gardens);
                    $scope.$applyAsync();
                }
                $ionicListDelegate.closeOptionButtons();
            });
        };

        $scope.isEmpty = function() {
            var empty = true;
            if ($scope.gardens) {
                for (var key in $scope.gardens) {
                    empty = false;
                }
            }

            return empty;
        }
    }

})();