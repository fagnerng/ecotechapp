/**
 * Created by fagner on 8/26/15.
 */
(function() {
    'use strict';

    angular
        .module('Utils')
        .service('AnimationFrame', AnimationFrame);
    /**
     * alternative for requestAnimationFrame and cancelAnimationFrame
     * @param $timeout
     * @returns {{request, cancel}}
     */
    function AnimationFrame($timeout) {

        var mRequestAnimationFrame = (function() {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback) {
                    return $timeout(callback, 1000 / 60);
                };
        })();

        var mCancelAnimationFrame = (function() {
            return window.cancelAnimationFrame ||
                window.webkitCancelRequestAnimationFrame ||
                window.mozCancelRequestAnimationFrame ||
                window.oCancelRequestAnimationFrame ||
                window.msCancelRequestAnimationFrame ||
                function(timeoutId) {
                    $timeout.cancel(timeoutId);
                };

        })();

        var service = {
            request: request,
            cancel: cancel,
        };

        return service;

        function request(callback) {
            return mRequestAnimationFrame(callback);
        }

        function cancel(rafId) {
            return mCancelAnimationFrame(rafId);
        }

    }
})();
