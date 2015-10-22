(function() {
    'use strict';

    angular.module('EcotechApp')
        .controller('MainController', MainController);


    function MainController($log) {
        $log.debug('DashboardController');
        var vm = this;

        vm.menus = _getMenus();

        function _getMenus() {
            return [
                {
                    title: 'menu.home',
                    state: 'app.dashboard',
                    icon: 'ion-home',
                },
                {
                    title: 'menu.gardens',
                    state: 'app.gardens',
                    icon: 'ion-leaf',
                },
                {
                    title: 'menu.about',
                    state: 'app.about',
                    icon: 'ion-help',
                },

            ];
        }

    }

})();
