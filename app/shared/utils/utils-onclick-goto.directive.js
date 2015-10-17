(function() {
    'use strict';

    angular
        .module('Utils')
        .directive('utilsOnclickGoto', utilsOnclickGoto);

    /**
     * Alterado o estado (UI-Route).
     *
     * Restrict To: Attribute.
     *
     * @ngdoc directive
     * @memberof Utils
     * @name utilsOnclickGoto
     * @requires $state
     * @example
     Examplos:

     <button class="button" utils-onclick-goto="app.login"></button>
     <button class="button" utils-onclick-goto="{{controller.variable}}"></button>
     */
    function utilsOnclickGoto($state) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                elem.on('click', function() {
                    if (attrs.utilsOnclickGoto) {
                        var params = JSON.parse(attrs.utilsOnclickGoto);
                        console.log(JSON.stringify(params));
                        if (typeof params === 'string') {
                            $state.go(params);
                        } else if (typeof params === 'object') {
                            $state.go(params.state, {btAddres: params.address, fagner: 'teste'});
                        }
                    } else {
                        console.log('utilsOnclickGoto === undefined');
                    }
                });
            },
        };
    }

})();
