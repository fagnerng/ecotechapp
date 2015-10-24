/**
 * Created by fagnerng on 23/10/2015.
 */
(function () {
    'use strict';

    angular.module('EcotechApp')
            .controller('TipsController', tipsController);

    function tipsController($location, $ionicScrollDelegate, $scope, $window) {
        var vm = this;
        vm.tips = [0,1,2,3,4,5,6];
        vm.currentPage = 0;
        var widthPage = $window.innerWidth;
        var handle = $ionicScrollDelegate.$getByHandle('content');

        vm.moveLeft = function() {
            scrollToAnchorWithinCurrentPage('page_'+(++vm.currentPage));
        };
        vm.moveRight = function() {
            if (vm.currentPage < 8 && vm.currentPage > 0) {
                scrollToAnchorWithinCurrentPage('page_' + (--vm.currentPage));
            }
        };
        function scrollToAnchorWithinCurrentPage(anchor) {
            $location.hash(anchor);
            handle.anchorScroll(true);
            $scope.$applyAsync();
        }

        vm.shouldScrollLeft = function() {
            return vm.currentPage < (vm.tips.length -1);
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