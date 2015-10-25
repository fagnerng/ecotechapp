(function() {
    'use strict';

    var DEBUG_MODE = true;

    // gulp-inject-debug-mode

    angular.module('EcotechApp')
        .run(EcotechAppRun)
        .constant('EcotechAppDebug', DEBUG_MODE)
        .config(EcotechAppConfig);

    function EcotechAppConfig($stateProvider, $compileProvider, $logProvider,$urlRouterProvider,
                                  $ionicConfigProvider, EcotechAppDebug) {
        var appState = {
            url: '/app',
            abstract: true,
            cache: true,
            templateUrl: 'main/main.html',
            controller: 'MainController as mainCtrl',
        };
        var dashboardState = {
            url: '/dashboard',
            cache: true,
            abstract: false,
            views: {
                viewContent: {
                    templateUrl: 'dashboard/dashboard.html',
                    controller: 'DashboardController as dashboardCtrl',
                },
            },
        };
        var aboutState = {
            url: '/about',
            cache: true,
            abstract: false,
            views: {
                viewContent: {
                    templateUrl: 'about/about.html',
                },
            },
        };
        var plantsState = {
            url: '/plants',
            cache: true,
            abstract: false,
            views: {
                viewContent: {
                    templateUrl: 'plants/plants.html',
                    controller: 'PlantsController as plantsCtrl'
                },
            },
        };
        var tipsState = {
            url: '/tips',
            cache: true,
            abstract: false,
            views: {
                viewContent: {
                    templateUrl: 'tips/tips.html',
                    controller: 'TipsController as tipsCtrl'
                },
            },
        };
        var plantState = {
            url: '/plant:type',
            cache: false,
            abstract: false,
            templateUrl: 'plant/plant.html',
            controller: 'PlantController as plantCtrl'
        };

        // Application routing
        $stateProvider
            .state('app', appState)
            .state('app.dashboard', dashboardState)
            .state('app.about', aboutState)
            .state('app.plants', plantsState)
            .state('app.tips', tipsState)
            .state('plant', plantState);
            //.state('app.gardens.list', gardensListState);

        // redirects to default route for undefined routes
        $urlRouterProvider.otherwise('/app/plants');
        //$urlRouterProvider.otherwise('/app/tips');

        // Disable/Enable SigPatientPlusDebug things
        $compileProvider.debugInfoEnabled(EcotechAppDebug);
        $logProvider.debugEnabled(EcotechAppDebug);

        // Ionic Configs
        $ionicConfigProvider.tabs.style('standard');
        $ionicConfigProvider.tabs.position('top');

    }


    function EcotechAppRun($ionicPlatform, $state, $rootScope) {

        $ionicPlatform.ready(function() {
            $rootScope.$state = $state;

            navigator.globalization.getPreferredLanguage(
                function(language) {$rootScope.language = language.value;},
                function() {$rootScope.language = 'en-US';}
            );
        });

    }

})();
