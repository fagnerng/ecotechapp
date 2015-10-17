'use strict';

(function () {
    'use strict';

    angular.module('EcotechApp').controller('DashboardController', DashboardController);

    function DashboardController($log) {
        $log.debug('DashboardController');
    }
    DashboardController.$inject = ["$log"];
})();