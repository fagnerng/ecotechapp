/**
 * Copyright (C) 2014 Signove Tecnologia.
 * All rights reserved.
 */
'use strict';

(function () {
    'use strict';
    angular.module('Utils').service('CArray', CarrayObject);

    function CarrayObject() {
        var CArray = function CArray(n) {
            this._array = [];
            this._pointer = -1;
            this._capacity = n;
            this._count = 0;
        };

        CArray.prototype.get = function (i) {
            return this._array[i % this._capacity];
        };

        CArray.prototype.push = function (item) {
            this._pointer++;
            if (this._pointer > this._capacity * (this._count + 1)) {
                this._count++;
            }

            this._array[this._pointer % this._capacity] = item;
        };

        CArray.prototype.length = function () {
            return this._array.length;
        };

        CArray.prototype.capacity = function () {
            return this._capacity;
        };

        CArray.prototype.pointer = function () {
            return this._pointer;
        };

        CArray.prototype.diffPointer = function (index) {
            var normalizedIndex = index > this._pointer ? index - this._capacity : index;
            return this._pointer - normalizedIndex;
        };

        CArray.prototype.copyAsArray = function () {
            var nextPointer = (this._pointer + 1) % this._capacity;
            var ret = this._array.slice(0, nextPointer);

            if (this._array.length === this._capacity) {
                var part2 = this._array.slice(nextPointer, this._array.length);
                ret = part2.concat(ret);
            }

            return ret;
        };

        return CArray;
    }
})();