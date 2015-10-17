(function() {
    'use strict';

    angular.module('EcotechApp')
        .controller('MainController', MainController);


    function MainController($log) {
        $log.debug('DashboardController')
        var vm = this;

        vm.menus = _getMenus();

        function _getMenus() {
            return [
                {
                    title: 'Home',
                    state: 'app.dashboard',
                    icon: 'icon-home',
                },
                {
                    title: 'About and Help',
                    state: 'app.about',
                    icon: 'icon-about',
                },
            ];
        }

    }

})();
