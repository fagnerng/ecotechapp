/**
 * Created by fagnerng on 18/10/2015.
 */
(function() {
    'use strict';
angular.module('translations')
    .config(TranslationsConfig);

    function TranslationsConfig($translateProvider) {
        $translateProvider.translations('br', {
            appName: 'Ecotech App',
            menu: {
                home: 'Inicio',
                about: 'Sobre',
                leaf: 'hortas',
            },
        });
        $translateProvider.preferredLanguage('br');
    }
})();