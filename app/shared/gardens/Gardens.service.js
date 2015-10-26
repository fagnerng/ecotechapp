/**
 * Created by fagnerng on 24/10/2015.
 */
(function () {
    'use strict';

    angular.module('GardensModule', [])
            .service('Gardens', GardensService);

    function GardensService($ionicPlatform, $window) {
        var mPrefs;
        var gardens;
        var service = {
            getGarden: '',
            getAllGardens: '',
            addGarden: '',
            removeGarden: '',
            Garden: GardenObeject
        };


        $ionicPlatform.ready(function() {
            mPrefs = $window.plugins.appPreferences;
            _getValue('gardens').then(function (response) {
                if (response) {
                    if (!gardens) {
                        gardens = response;
                    } else {
                        for (var index in response) {
                            gardens.push(response[index]);
                        }
                        _putValue('gardens', gardens);
                    }
                }
             });
        });

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
            _putValue('gardens', gardens);
        }

        function GardenObeject() {
            this.creationDate = new Date().toDateString();
            return this;
        }


        return service;
    }

})();