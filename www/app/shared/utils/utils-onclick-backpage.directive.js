'use strict';

(function () {
    'use strict';

    angular.module('Utils').directive('utilsOnclickBackpage', utilsOnclickBackpage);

    /**
     * Volta uma página no historico ao ser clicado.
     *
     * Restrict To: Attribute
     *
     * @ngdoc directive
     * @memberof Utils
     * @name utilsOnclickBackpage
     * @requires $ionicPlatform
     * @example
     Exemplo:
      <button class="button" utils-onclick-backpage> </button>
     */
    function utilsOnclickBackpage($ionicPlatform) {
        return {
            restrict: 'A',
            link: function link(scope, elem) {
                elem.on('click', function () {
                    $ionicPlatform.hardwareBackButtonClick();
                });
            }
        };
    }
    utilsOnclickBackpage.$inject = ["$ionicPlatform"];
})();