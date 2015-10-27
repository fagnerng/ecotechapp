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
        var plantList = {
            alecrim: 'alecrim',
            cebolinha: 'cebolinha',
            coentro: 'coentro',
            hortela: 'hortela',
            manjericao: 'manjericao',
            oregano: 'oregano',
            salsinha: 'salsinha',
            salvia: 'salvia',
            tomilho: 'tomilho'
        };

        var service = {
            getGarden: getGarden,
            getAllGardens: getAllGardens,
            save: save,
            addGarden: addGarden,
            removeGarden: '',
            plantList: plantList,

        };

        $ionicPlatform.ready(function() {
            mPrefs = $window.plugins.appPreferences;
            getAllGardens();
        });

        function save(gardens) {
            _putValue(GARDENS_KEY, gardens);
        }
        function getGarden(id) {
            return $q(function(resolve) {
                service.getAllGardens().then(function(response) {
                    resolve(response[id]);
                });

            });
        }

        function getAllGardens() {
            return $q(function(resolve) {
                _getValue(GARDENS_KEY).then(function (response) {
                    console.log(JSON.stringify(response));
                    if (response) {
                        gardens = response;
                        resolve(gardens);
                    } else {
                        gardens = {};
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
                    console.log(JSON.stringify(value));
                    mPrefs.store(resolve, reject, PREFIX, key, value);
                });
            }

        }

        function addGarden(garden) {

            if(!gardens) {
                gardens = {};
            }

            gardens[garden.id] = garden;
            _putValue(GARDENS_KEY, gardens);
        }

        return service;
    }

})();