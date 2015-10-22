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
                gardens: 'Hortas',
            },
            title: {
                home: 'Ecotech',
                about: 'Sobre',
                gardens: 'Hortas',
            },
            alert: {
                noGardens: 'Sem hortas',
                addMoreGardens: 'Adicione novas hortas para continuar'
            }
        });
        $translateProvider.useSanitizeValueStrategy('sanitize');
        $translateProvider.preferredLanguage('br');
    }
})();