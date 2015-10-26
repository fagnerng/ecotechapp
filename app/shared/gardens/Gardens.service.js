/**
 * Created by fagnerng on 24/10/2015.
 */
(function () {
    'use strict';

    angular.module('GardensModule', [])
            .service('Gardens', GardensService);

    function GardensService($ionicPlatform, $window, $q) {
        var mPrefs;
        var GARDENS_KEY = 'gardens';
        var PREFIX = 'com.fagnerng.prefs';
        var gardens;
        var service = {
            getGarden: getGardens,
            getAllGardens: getGardens,
            save: save,
            addGarden: addGarden,
            removeGarden: '',
        };


        $ionicPlatform.ready(function() {
            mPrefs = $window.plugins.appPreferences;
            getGardens();
        });

        function save(gardens) {
            _putValue(GARDENS_KEY, gardens);
        }

        function getGardens() {
            return $q(function(resolve) {
                _getValue(GARDENS_KEY).then(function (response) {
                    if (response) {
                        gardens = response;
                        resolve(gardens);
                    } else {
                        gardens = [];
                        resolve(gardens);
                    }
                });
            });
        }
        function _getValue(key) {
            if (mPrefs) {
                return $q(function(resolve, reject) {
                    mPrefs.fetch(resolve, reject, PREFIX, key);
                });
            }
        }

        function _putValue(key, value) {
            if (mPrefs) {
                return $q(function(resolve, reject) {
                    mPrefs.store(resolve, reject, PREFIX, key, value);
                });
            }

        }

        function addGarden(garden) {

            if(!gardens) {
                gardens = [];
            }

            gardens.push(garden);
            _putValue(GARDENS_KEY, gardens);
        }

        return service;
    }

})();