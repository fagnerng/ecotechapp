/**
 * Copyright (C) 2014 Signove Tecnologia. All rights reserved.
 */
'use strict';

(function () {
    'use strict';
    angular.module('Utils').service('RtEcgChart', RtEcgChartObject);

    function RtEcgChartObject() {
        var RtEcgChart = function RtEcgChart(settings) {
            this._init(settings);
        };

        RtEcgChart.prototype = {

            buffering: false,
            resetIndexCount: 0,
            currentPosition: 0,
            onDraw: false,
            dump: 0,
            interval: 0,
            lastTime: 0,

            draw: function draw(diff) {
                if (!this.onDraw) {
                    this.dump += diff;
                    this.onDraw = true;
                    var max = this.carray.pointer();

                    while (this.currentPosition < max && this.interval < this.dump) {
                        this.dump -= this.interval;
                        var value = this.carray.get(this.currentPosition++);
                        this._renderValue(value);
                    }

                    this.onDraw = false;
                }
            },
            render: function render(diff) {
                var carrayLength = this.carray.length();

                if (this.index < carrayLength && carrayLength > this.carrayMinLength && this.carray.diffPointer(this.index) !== 0) {

                    if (diff <= 3000) {

                        var endTimestamp;
                        if (!this.lastValue) {
                            this._resetIndex();
                        }

                        endTimestamp = this.beginTimestamp + diff;
                        while (this.index < carrayLength) {
                            var diffPointer = this.carray.diffPointer(this.index);
                            var value = this.carray.get(this.index);
                            var timeStamp = value[0];

                            if (timeStamp >= this.beginTimestamp && timeStamp <= endTimestamp) {
                                this._endBuffering();
                                this._renderValue(value);
                            } else {
                                if (diffPointer >= this.carrayMaxDiffPointer) {
                                    this._resetIndex();
                                    return;
                                }

                                break;
                            }

                            if (diffPointer !== 0) {
                                this.index = (this.index + 1) % this.carray.capacity();
                            } else {
                                break;
                            }
                        }

                        if (this.updateHourCallbackFunction) {
                            var time = new Date(this.lastValue[0]);
                            this.updateHourCallbackFunction(time);
                        }

                        this.beginTimestamp = endTimestamp;
                    } else {
                        this._resetIndex();
                    }
                } else {
                    this._startBuffering();
                }

                return this.lastValue;
            },

            resize: function resize(w, h) {
                this._setupCanvas({ w: w, h: h, lineColor: this.lineColor });
            },

            _startBuffering: function _startBuffering() {
                if (!this.buffering) {
                    this.startBufferingCallback();
                    this.buffering = true;
                }
            },

            _endBuffering: function _endBuffering() {
                if (this.buffering) {
                    this._setupCanvas({ w: this.w, h: this.h, lineColor: this.lineColor });
                    if (this.endBufferingCallback) {
                        this.endBufferingCallback();
                    }

                    this.buffering = false;
                }
            },

            _renderValue: function _renderValue(value) {
                this.py = this.h - this.h * (value[1] - this.yMin) / (this.yMax - this.yMin);

                var increment = (value[0] - this.lastValue[0]) * this.w / this.range;

                // remove possible overlap
                this.px += increment > 0 ? increment : -increment;
                this.lastValue = value;
                if (this.py >= this.h * 0.99) {
                    this.py = this.h * 0.98;
                } else if (this.py <= 0) {
                    this.py = 1;
                }

                var diff = this.lastTime - value[0];
                if (diff > 1000 || diff < 1000) {
                    this.lastTime = value[0];
                    this.ctx.clearRect(this.w * 0.01, this.h * 0.03, this.w * 0.12, this.h * 0.08);
                    var date = new Date(value[0]);
                    var minute = date.getMinutes();
                    var hour = date.getHours();
                    var seconds = date.getSeconds();
                    seconds = seconds < 10 ? '0' + seconds : seconds;
                    minute = minute < 10 ? '0' + minute : minute;
                    var currentTime = [hour, minute, seconds].join(':');
                    this.ctx.fillText(currentTime, this.w * 0.01, this.h * 0.08);
                }

                this.ctx.clearRect(this.opx, -2, this.scanBarWidth, this.h + 4);

                this.ctx.beginPath();
                this.ctx.lineCap = 'round';
                this.ctx.moveTo(this.opx, this.opy);
                this.ctx.lineTo(this.px, this.py);

                this.ctx.moveTo(this.opx, this.h * 0.01);
                this.ctx.lineTo(this.px, this.h * 0.01);

                this.ctx.moveTo(this.opx, this.h * 0.99);
                this.ctx.lineTo(this.px, this.h * 0.99);

                this.ctx.stroke();
                this.opx = this.px;
                this.opy = this.py;

                if (this.opx > this.w) {
                    this.px = this.opx = 0;
                }
            },

            _init: function _init(settings) {
                this.carray = settings.carray;
                this.carrayMinLength = Math.round(settings.carray.capacity() * 0.02);
                this.carrayMaxDiffPointer = 2 * this.carrayMinLength;
                this.canvas = settings.canvas ? settings.canvas : document.getElementById(settings.canvasId);

                this.scanBarWidth = settings.scanBarWidth ? settings.scanBarWidth : 20;
                this.w = settings.w;
                this.h = settings.h;

                if (settings.range) {
                    this.range = settings.range;

                    //force scale 1mv => 400ms
                    this.yMax = this.h * this.range / (800 * this.w);
                    this.yMin = -this.yMax;
                } else {
                    this.yMax = settings.yMax ? settings.yMax : 1;
                    this.yMin = settings.yMin ? settings.yMin : -1;
                    this.range = 800 * this.w * this.yMax / this.h;
                }

                this.updateHourCallbackFunction = settings.updateHourCallbackFunction;
                this.loggedUserTimezoneOffset = settings.loggedUserTimezoneOffset;
                this.startBufferingCallback = settings.startBufferingCallback;
                this.endBufferingCallback = settings.endBufferingCallback;
                this.index = this.carray.pointer() > 0 ? this.carray.pointer() : 0;

                this.lastValue = [0, this.h / 2];
                this.lineColor = settings.lineColor;
                this._setupCanvas();
            },

            _setupCanvas: function _setupCanvas() {
                this.canvas.width = this.w;
                this.canvas.height = this.h;
                this.ctx = this.canvas.getContext('2d');
                this.ctx.clearRect(0, 0, this.w, this.h);
                this.ctx.strokeStyle = this.lineColor;
                this.ctx.lineWidth = 1;
                this.ctx.font = this.h * 0.05 + 'px Arial';
                this.py = this.h * 0.55;
                this.opy = this.py;
                this.px = 0;
                this.opx = 0;
            },

            _resetIndex: function _resetIndex() {
                this._startBuffering();

                if (this.carray.diffPointer(this.index) !== 0) {

                    var newIndex = this.carray.pointer() - (this.carrayMinLength - 1);

                    if (newIndex < 0) {
                        newIndex = this.carray.capacity() + newIndex;
                    }

                    if (newIndex < this.carray.length()) {
                        var newValue = this.carray.get(newIndex);
                        if (this.lastValue || newValue[0] > this.lastValue[0] || this.resetIndexCount >= this.carrayMinLength) {
                            this.resetIndexCount = 0;
                            this.index = newIndex;
                            this.lastValue = newValue;
                            this.beginTimestamp = newValue[0];
                            this.py = this.h * 0.55;
                            this.opy = this.py;
                            this.px = 0;
                            this.opx = 0;
                        } else {
                            this.resetIndexCount++;
                        }
                    }
                }
            }
        };

        return RtEcgChart;
    }
})();