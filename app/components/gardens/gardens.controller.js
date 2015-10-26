/**
 * Created by fagnerng on 21/10/2015.
 */
(function() {
    'use strict';

    angular.module('EcotechApp')
            .controller('GardensController', GardensController);

    /*jshint esnext: true */
    function GardensController($ionicPlatform, $scope, $state,  $ionicListDelegate, $ionicPopup, Gardens) {
        $scope.gardens = [];
        $scope.loading = true;
        $ionicPlatform.ready(function() {
            Gardens.getAllGardens().then(function(response) {
                $scope.loading = false;
                $scope.gardens = response;
                $scope.$applyAsync();
            });
        });

        $scope.addGarden = function() {
            $ionicListDelegate.closeOptionButtons();
            $scope.gardens.push({timestamp: new Date().toISOString()});
            Gardens.save($scope.gardens);
            $scope.$applyAsync();
        };

        $scope.show = function($index) {
            $ionicListDelegate.closeOptionButtons();
            $state.go('garden', {id: $index});
        };

        $scope.showRemoveConfirm = function($index) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Deseja remover horta?',
                template: '<center>Opera&#231;&#227;o n&#227;o pode ser desfeita</center>'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    $scope.gardens.splice($index, 1);
                    Gardens.save($scope.gardens);
                    $scope.$applyAsync();
                }
                $ionicListDelegate.closeOptionButtons();
            });
        };
    }

})();