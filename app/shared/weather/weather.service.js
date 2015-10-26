/**
 * Created by fagnerng on 25/10/2015.
 */
(function () {
    'use strict';

    angular.module('Weathers')
            .service('Weather', weatherService);
    var API_KEY = 'a4f27b907aad9332';
    var LANG = 'BR';
    var URL = 'http://api.wunderground.com/api/';
    var URL_AUTOCOMPLETE = 'http://autocomplete.wunderground.com/aq?c='+ LANG + '&query=';
    var URL_HOURLY = URL + API_KEY + '/hourly/lang:' + LANG + '/q/zmw:';
    function weatherService($http) {
        var service = {
            autocomplete: autocomplete,
            hourly: hourly,
        };
        return service;

        function autocomplete(stringMatch) {
            return $http.get(URL_AUTOCOMPLETE + stringMatch);
        }

        function hourly(zmw) {
            return $http.get(URL_HOURLY + zmw + '.json');
        }
    }

})();