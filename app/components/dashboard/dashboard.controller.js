(function() {
    'use strict';

    angular.module('EcotechApp')
        .controller('DashboardController', DashboardController);

    function DashboardController($log, Gardens, Weather, $scope, _, $ionicPlatform, $state) {
        $log.debug('DashboardController');
        $scope.gardens;
        $scope.toShower = [];
        $scope.plantMissing = [];
        var all;
        var ONE_DAY = 1000 * 60 * 60 * 24;

        $ionicPlatform.ready(function() {
            $scope.$on('$ionicView.enter', function(){
                updateGardens();
            });
            updateGardens();

        });

        function updateGardens(){
            all = {alecrim: 0,
                cebolinha: 0,
                coentro: 0,
                hortela: 0,
                manjericao: 0,
                oregano: 0,
                salsinha: 0,
                salvia: 0,
                tomilho: 0
            };
            Gardens.getAllGardens().then(function(response) {
                $scope.gardens = response;

                updateFeeds();
            });


        }

        function updateFeeds() {
            $scope.plantMissing = [];
            if (_.isEmpty($scope.gardens)) {
                $scope.info.push("Adicione pelo menos uma horta para aproveitar o aplicativo");
            } else {
                checkShower()
            }
        }

        function checkShower() {
            var now = new Date().getTime();
            for (var key in $scope.gardens) {
                checkWeather($scope.gardens[key].id);
                checkPlants($scope.gardens[key].id);
                if (!$scope.gardens[key].showerAt &&  $scope.toShower.length < 3) {
                    $scope.toShower.push($scope.gardens[key]);
                } else {
                    var current = new Date($scope.gardens[key].showerAt).getTime();
                    if ((current - now ) > ONE_DAY && $scope.toShower.length < 3) {
                        $scope.toShower.push($scope.gardens[key]);
                    }
                }
            }

        }

        function checkWeather(id) {
            Weather.hourly($scope.gardens[id].zmw).then(function(response) {
                var forecast = response.data.hourly_forecast;
                $scope.gardens[id].url = forecast[0].icon_url;
                $scope.$applyAsync();
            })
        }

        function checkPlants(id) {
            for (var index in $scope.gardens[id].plants) {
                all[index]++;
            }

            for (var key in all) {
                if (all[key] === 0 && $scope.plantMissing.indexOf(key) === -1 && $scope.plantMissing.length < 4) {
                    $scope.plantMissing.push(key);
                }
            }

            $scope.$applyAsync();
        }

        $scope.goToGarden = function(id) {
            if (id) {
                $state.go('garden', {id: id});
            } else {
                $state.go('app.gardens');
            }
        }


    }

})();
