'use strict';

(function () {
    'use strict';

    var DEBUG_MODE = true;

    // gulp-inject-debug-mode

    angular.module('EcotechApp').run(EcotechAppRun).constant('EcotechAppDebug', DEBUG_MODE).config(EcotechAppConfig);

    function EcotechAppConfig($stateProvider, $compileProvider, $logProvider, $urlRouterProvider, $ionicConfigProvider, EcotechAppDebug) {
        var appState = {
            url: '/app',
            abstract: true,
            cache: true,
            templateUrl: 'main/main.html',
            controller: 'MainController as mainCtrl'
        };

        var dashboardState = {
            url: '/dashboard',
            cache: true,
            abstract: false,
            views: {
                viewContent: {
                    templateUrl: 'dashboard/dashboard.html',
                    controller: 'DashboardController as dashboardCtrl'
                }
            }
        };
        var aboutState = {
            url: '/about',
            cache: true,
            abstract: false,
            views: {
                viewContent: {
                    templateUrl: 'about/about.html'
                }
            }
        };

        var gardensState = {
            url: '/gardens',
            cache: true,
            abstract: false,
            views: {
                viewContent: {
                    templateUrl: 'gardens/gardens.html',
                    controller: 'GardensController as gardensCtrl'
                }
            }
        };

        var tipsState = {
            url: '/tips',
            cache: true,
            abstract: false,
            views: {
                viewContent: {
                    templateUrl: 'tips/tips.html',
                    controller: 'TipsController as tipsCtrl'
                }
            }
        };

        var gardensListState = {
            url: '/list',
            cache: true,
            abstract: false,
            views: {
                viewContent: {
                    templateUrl: 'gardens/gardens.list.html'
                }
            },
            templateUrl: 'gardens/gardens.list.html'
        };

        // Application routing
        $stateProvider.state('app', appState).state('app.dashboard', dashboardState).state('app.about', aboutState).state('app.gardens', gardensState).state('app.tips', tipsState);
        //.state('app.gardens.list', gardensListState);

        // redirects to default route for undefined routes
        $urlRouterProvider.otherwise('/app/dashboard');
        //$urlRouterProvider.otherwise('/app/tips');

        // Disable/Enable SigPatientPlusDebug things
        $compileProvider.debugInfoEnabled(EcotechAppDebug);
        $logProvider.debugEnabled(EcotechAppDebug);

        // Ionic Configs
        $ionicConfigProvider.tabs.style('standard');
        $ionicConfigProvider.tabs.position('top');
    }
    EcotechAppConfig.$inject = ["$stateProvider", "$compileProvider", "$logProvider", "$urlRouterProvider", "$ionicConfigProvider", "EcotechAppDebug"];

    function EcotechAppRun($ionicPlatform, $state, $rootScope) {

        $ionicPlatform.ready(function () {
            $rootScope.$state = $state;

            navigator.globalization.getPreferredLanguage(function (language) {
                $rootScope.language = language.value;
            }, function () {
                $rootScope.language = 'en-US';
            });
        });
    }
    EcotechAppRun.$inject = ["$ionicPlatform", "$state", "$rootScope"];
})();