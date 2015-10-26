/**
 * Created by fagnerng on 23/10/2015.
 */
(function () {
    'use strict';

    angular.module('EcotechApp')
            .controller('PlantController', PlantController);

    function PlantController($location, $ionicScrollDelegate, $scope, $window, $stateParams) {
        var vm = this;
        vm.type = $stateParams.type;

        vm.plants = [0,1,2,3];
        vm.currentPage = 0;
        var widthPage = $window.innerWidth;
        var handle = $ionicScrollDelegate.$getByHandle('content');

        vm.moveLeft = function() {
            scrollToAnchorWithinCurrentPage('page_'+(++vm.currentPage));
        };

        vm.moveRight = function() {
            scrollToAnchorWithinCurrentPage('page_' + (--vm.currentPage));
        };

        function scrollToAnchorWithinCurrentPage(anchor) {
            $location.hash(anchor);
            handle.anchorScroll(true);
            $scope.$applyAsync();
        }

        vm.shouldScrollLeft = function() {
            return vm.currentPage < (vm.plants.length -1);
        };

        vm.shouldScrollRight = function() {
            return vm.currentPage > 0;
        };

        vm.onScroll = function () {
            var currentPosition = handle.getScrollPosition().left;
            if (currentPosition % widthPage === 0) {
                vm.currentPage = currentPosition/widthPage;
                $scope.$applyAsync();
            }
        };

        vm.goTo = function(page) {
            vm.currentPage = page;
            scrollToAnchorWithinCurrentPage('page_' + page);
        };

    }


})();