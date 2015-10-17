(function() {
    'use strict';

    /**
     * Constante que será setada para `falso` pelo gulp se o parâmetro `--release` for passado no passo de build.
     *
     * @ngdoc constant
     * @memberof SigPatientPlus
     * @name SigPatientPlusDebug
     */
    var DEBUG_MODE = true;

    // gulp-inject-debug-mode

    angular.module('EcotechApp')
        .run(SigPatientPlusRun)
        .constant('SigPatientPlusDebug', DEBUG_MODE)
        .config(SigPatientPlusConfig);

    /**
     * Application Settings
     *
     * @memberof SigPatientPlus
     * @param $stateProvider
     * @param $compileProvider
     * @param $logProvider
     * @param $ionicConfigProvider
     * @param SigPatientPlusDebug
     * @constructor
     */
    function SigPatientPlusConfig($stateProvider, $compileProvider, $logProvider,$urlRouterProvider,
                                  $ionicConfigProvider, SigPatientPlusDebug) {
        var appState = {
            url: '/app',
            abstract: true,
            templateUrl: 'main/main.html',
            controller: 'MainController as mainCtrl',
        };

        var dashboardState = {
            url: '/dashboard',
            cache: false,
            views: {
                viewContent: {
                    templateUrl: 'dashboard/dashboard.html',
                    controller: 'DashboardController as dashboardCtrl',
                },
            },
        };



        // Application routing
        $stateProvider
            .state('app', appState)
            .state('app.dashboard', dashboardState);

        // redirects to default route for undefined routes
        $urlRouterProvider.otherwise('/app/dashboard');

        // Disable/Enable SigPatientPlusDebug things
        $compileProvider.debugInfoEnabled(SigPatientPlusDebug);
        $logProvider.debugEnabled(SigPatientPlusDebug);

        // Ionic Configs
        $ionicConfigProvider.tabs.style('standard');
        $ionicConfigProvider.tabs.position('top');
    }


    function SigPatientPlusRun($ionicPlatform, $state, $rootScope) {
        $rootScope.$state = $state;
        $ionicPlatform.ready(function() {
                navigator.globalization.getPreferredLanguage(
                function(language) {$rootScope.language = language.value;},
                function() {$rootScope.language = 'en-US';}
            );
        });

    }

})();
