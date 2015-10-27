/**
 * Created by fagnerng on 24/10/2015.
 */
(function () {
    'use strict';

    angular.module('EcotechApp')
            .controller('GardenController', gardenController);

    function gardenController($stateParams, $scope, Weather, $filter, $ionicPopover, Gardens, $cordovaToast, $state,
                              $ionicPlatform) {
        var popOverTemp = '<ion-popover-view><ion-content><ion-list><ion-item class="button item " ng-repeat="plant in plants" ng-click="addPlant(plant)"><h2 ng-bind-html="plant | translate"></h2></ion-item> </ion-list></ion-content></ion-popover-view>';
        $scope.g = {
            city: '',
            name: '',
            plants: {},
        };
        $ionicPlatform.ready(function() {
            if ($stateParams.id === '_new') {
                $scope.onEdit = true;
                $scope.g = {
                    city: '',
                    name: '',
                    plants: {},
                };
            } else {
                Gardens.getGarden($stateParams.id).then(function(response) {
                    $scope.g = response;
                    $scope.$applyAsync();
                    getPop();
                });
            }
        });


        $scope.autocomplete = function() {
            $scope.g.zmw = null;
            Weather.autocomplete($scope.g.city).then(function (response){
                $scope.cities = response.data.RESULTS.slice(0,3);
                $scope.showAutoComplete = true;
            });
        };

        $scope.select = function(city) {

            $scope.g.city = city.name;
            $scope.g.zmw = city.zmw;
            getPop();

            return $scope.g;
        };

        $scope.dimissPopOver = function() {
            $scope.showAutoComplete = false;
            return $scope.showAutoComplete;
        };

        $scope.addPlant = function(plant){
            $scope.g.plants[plant] = {name:plant, p:1};
            $scope.$broadcast('scroll.refreshComplete');
            //$ionicScrollDelegate.resize()
            $scope.popover.hide();
            $scope.popover.remove();
            return $scope.g;
        };

        $scope.cities = [];


        function getPop() {
            Weather.hourly($scope.g.zmw).then(function(response) {
                var forecast = response.data.hourly_forecast;
                var value;
                for (var key in forecast){
                    var hour =  forecast[key].FCTTIME.epoch * 1000;
                    var humidity = forecast[key].humidity;
                    var pop = forecast[key].pop;
                    var mValue = {
                            timestamp: hour,
                            humidity: humidity,
                            pop: pop,
                        };

                    if (!value){
                        value = mValue;
                    } else {
                        if (mValue.pop < value.pop) {
                            value = mValue;
                        } else if (value.pop === 0 && mValue.humidity > value.humidity ) {
                            value = mValue;
                        }
                    }
                }

                if (parseInt(value.pop) === 0) {
                    $scope.g.pop = 'Sem previs&#227;o de chuva, com humidade m&#225;xima de ' + value.humidity + '% as ' +
                            $filter('date')(value.timestamp, 'HH:mm - dd/MM ');
                } else {
                    $scope.g.pop = 'previs&#227;o de ' + value.pop + '% de chover as ' +
                            $filter('date')(value.timestamp, 'HH:mm - dd/MM ') +
                    '. Aproveite para juntar &#225;gua regar as plantas';
                }

                return $scope.g;
            });
        }

        $scope.shower = function() {
            $scope.g.showerAt = new Date().toISOString();
            return $scope.g;
        };

        $scope.showPopOver = function($event) {
            var allPlants = Gardens.plantList;
            $scope.plants = [];
            var mPlants = $scope.g.plants;
            for (var key in allPlants) {
                if (!mPlants[key]) {
                    $scope.plants.push(key);
                }
            }
            if ( $scope.plants.length > 0) {
                $scope.popover = $ionicPopover.fromTemplate(popOverTemp, {
                    scope: $scope
                });
                $scope.popover.show($event);
            } else {
                showShortBottom("Todos os tipos de plantas ja foram adicionados");
            }
        };


        $scope.save = function() {
            if ($stateParams.id ==='_new') {
                $scope.g.id = new Date().getTime();
            }

            if ($scope.g.name === '') {
                showShortBottom('Nome n&#227;o pode ser vazio');
            } else if (!$scope.g.zmw) {
                showShortBottom('Cidade invalida');
            } else if (!$scope.g.size || !$scope.g.size.w || !$scope.g.size.h) {
                showShortBottom('Tamanho inv&#225;lido');
            } else if ($scope.g.plants === {}) {
                showShortBottom('Voc&#234; deve ter pelo menos um tipo planta');
            } else {
                var count = 0
                for (var key in $scope.g.plants) {
                    count += $scope.g.plants[key].p;
                }
                if (count > 100) {
                    showShortBottom('Propor&#231;&#227;o maior que 100%');
                } else {
                    $scope.g.pop = null;
                    Gardens.addGarden($scope.g);
                    $cordovaToast.showShortBottom('Salvo com sucesso');
                    $scope.$applyAsync();
                    $state.go('app.gardens');
                }
            }
        };

        function showShortBottom(msg) {
            console.log(msg);
            var custom = 'Complete todos os Campos';
            $cordovaToast.showShortBottom(custom);

        }



    }




})();