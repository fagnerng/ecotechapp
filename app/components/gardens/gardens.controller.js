/**
 * Created by fagnerng on 21/10/2015.
 */
(function() {
    'use strict';

    angular.module('EcotechApp')
            .controller('GardensController', GardensController);

    /*jshint esnext: true */
    const PREFIX = 'com.fagnerng.prefs';
    function GardensController($ionicPlatform, $window, $q, $scope, $state) {
        var mPrefs;
        $scope.gardens = [];
        $scope.loading = true;
        $ionicPlatform.ready(function() {
            mPrefs = $window.plugins.appPreferences;
            getValue('gardens').then(function (response) {
                console.log(JSON.stringify(response));
                $scope.loading = false;
                if (response) {
                    $scope.gardens = response;
                }
                $scope.$applyAsync();
            });
        });

        function getValue(key) {
            if (mPrefs) {
                return $q(function(resolve, reject) {
                    mPrefs.fetch(resolve, reject, PREFIX, key);
                });
            }
        }

        function putValue(key, value) {
            if (mPrefs) {
                return $q(function(resolve, reject) {
                    mPrefs.store(resolve, reject, PREFIX, key, value);
                });
            }

        }

        $scope.addGarden = function() {
            if (!$scope.gardens) {
                $scope.gardens = [];
            }

            $scope.gardens.push({creationDate: new Date().toISOString()});
            console.log(JSON.stringify($scope.gardens));
            putValue('gardens', $scope.gardens);
            $scope.$applyAsync();
        };

        $scope.show = function($index) {
            $state.go('garden', {id: $index});
        }
    }

})();