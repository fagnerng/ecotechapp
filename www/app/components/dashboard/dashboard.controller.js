'use strict';

(function () {
    'use strict';

    angular.module('EcotechApp').controller('DashboardController', DashboardController);

    function DashboardController($log, Gardens, Weather, $scope, _, $ionicPlatform, $state) {
        $log.debug('DashboardController');
        $scope.gardens;
        $scope.toShower = [];
        $scope.plantMissing = [];
        var all;
        var ONE_DAY = 1000 * 60 * 60 * 24;

        $ionicPlatform.ready(function () {
            $scope.$on('$ionicView.enter', function () {
                updateGardens();
            });
            updateGardens();
        });

        function updateGardens() {
            all = { alecrim: 0,
                cebolinha: 0,
                coentro: 0,
                hortela: 0,
                manjericao: 0,
                oregano: 0,
                salsinha: 0,
                salvia: 0,
                tomilho: 0
            };
            Gardens.getAllGardens().then(function (response) {
                $scope.gardens = response;

                updateFeeds();
            });
        }

        function updateFeeds() {
            $scope.plantMissing = [];
            $scope.isEmpty = _.isEmpty($scope.gardens);
            if (!$scope.isEmpty) {
                checkShower();
            }
        }

        function checkShower() {
            var now = new Date().getTime();
            $scope.toShower = [];
            for (var key in $scope.gardens) {
                checkWeather($scope.gardens[key].id);
                checkPlants($scope.gardens[key].id);
                if (!$scope.gardens[key].showerAt && $scope.toShower.length < 3) {
                    $scope.toShower.push($scope.gardens[key]);
                } else {
                    var current = new Date($scope.gardens[key].showerAt).getTime();
                    if (current - now > ONE_DAY && $scope.toShower.length < 3) {
                        $scope.toShower.push($scope.gardens[key]);
                    }
                }
            }
        }

        function checkWeather(id) {
            Weather.hourly($scope.gardens[id].zmw).then(function (response) {
                var forecast = response.data.hourly_forecast;
                $scope.gardens[id].url = forecast[0].icon_url;
                $scope.$applyAsync();
            });
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
            selectRandom();
            $scope.$applyAsync();
        }

        $scope.goToGarden = function (id) {
            if (id) {
                $state.go('garden', { id: id });
            } else {
                $state.go('app.gardens');
            }
        };

        function selectRandom() {
            var count = getRandomInt(0, _.size($scope.gardens));
            for (var key in $scope.gardens) {
                count--;
                $scope.selectGarden = $scope.gardens[key];
                if (count <= 0) {
                    break;
                }
            }
            getWeather($scope.selectGarden.zmw);
            $scope.$applyAsync();
        }

        function getWeather(zmw) {
            Weather.hourly(zmw).then(function (response) {
                var forecast = response.data.hourly_forecast[0];
                $scope.selectGarden.timestamp = forecast.FCTTIME.epoch * 1000;
                $scope.selectGarden.humidity = forecast.humidity + '%';
                $scope.selectGarden.icon_url = forecast.icon_url;
                $scope.selectGarden.temp = forecast.temp.metric;
                $scope.selectGarden.condition = forecast.condition;
                $scope.selectGarden.pop = forecast.pop;
            })['catch'](function () {
                console.log('err');
            });
        }
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
    }
    DashboardController.$inject = ["$log", "Gardens", "Weather", "$scope", "_", "$ionicPlatform", "$state"];
})();