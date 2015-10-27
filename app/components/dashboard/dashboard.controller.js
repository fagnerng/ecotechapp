(function() {
    'use strict';

    angular.module('EcotechApp')
        .controller('DashboardController', DashboardController);

    function DashboardController($log, Gardens, Weather, $scope, _, $ionicPlatform) {
        $log.debug('DashboardController');
        $scope.info = [];
        $scope.gardens;
        var notShower = [];
        var ShowerLonger = [];
        var plantMissing = [];
        var ONE_DAY = 1000 * 60 * 60 * 24;

        $ionicPlatform.ready(function() {
            $scope.$on('$ionicView.enter', function(){
                updateGardens();
            });
            updateGardens();

        });

        function updateGardens(){
            Gardens.getAllGardens().then(function(response) {
                $scope.gardens = response;

                updateFeeds();
            });


        }

        function updateFeeds() {
            $scope.info = [];
            notShower = [];
            ShowerLonger = [];
            plantMissing = [];
            if (_.isEmpty($scope.gardens)) {
                $scope.info.push("Adicione pelo menos uma horta para aproveitar o aplicativo");
            } else {
                checkShower()
            }
        }

        function checkShower() {
            notShower = [];
            ShowerLonger = [];
            var now = new Date().getTime();
            for (var key in $scope.gardens) {
                checkWeather($scope.gardens[key].id);
                checkPlants($scope.gardens[key].id);
                if (!$scope.gardens[key].showerAt) {
                    notShower.push($scope.gardens[key].id);
                } else {
                    var current = new Date($scope.gardens[key].showerAt).getTime();
                    if ((current - now ) > ONE_DAY) {
                        ShowerLonger.push($scope.gardens[key].id);
                    }
                }
            }
            console.log('não regadas: '  + notShower.join(','));
            console.log(' regadas a mais de 12h: '  + ShowerLonger.join(','));
            console.log('Plantas ausentes '  + plantMissing.join(','));

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
                var plant = $scope.gardens[id].plants[index].name;
                if (plantMissing.indexOf(plant)=== -1) {
                    plantMissing.push(plant);
                }
            }
        }


    }

})();
