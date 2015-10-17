/**
 * Created by fagner on 8/21/15.
 */
(function() {
    'use strict';

    angular
        .module('Utils')
        .service('TimeUtils', TimeUtilService);

    function TimeUtilService() {
        /**
         * service returned containing functions
         * @type {{hhMMss: hhMMss, hhMM: hhMM, daysTo: daysTo, ddmmyyyy: ddmmyyyy, Hl7ToDate: convertHl7dateTojsDate}}
         */
        var timeUtil = {
            hhMMss: hhMMss,
            hhMM: hhMM,
            daysTo: daysTo,
            ddmmyyyy: ddmmyyyy,
            Hl7ToDate: convertHl7dateTojsDate,
        };

        return timeUtil;

        /**
         * function to generate a string like hh:mm:ss
         * @param value
         * @returns {string}
         */
        function hhMMss(value) {
            var date = hhMMssArray(value);
            for (var i in date) {
                date[i] = date[i] < 10 ? '0' + date[i] : date[i];
            }

            return date.join(':');
        }

        /**
         * function to generate a string like hh:mm
         * @param value
         * @returns {string}
         */
        function hhMM(value) {
            var dateStr = hhMMss(value);
            return dateStr.substring(0, 5);
        }

        /**
         * function to generate a array containing hour(0) , minutes(1) and seconds(2)
         * @param value
         * @returns {*}
         */
        function hhMMssArray(value) {
            try {
                var date = new Date(value);
                var MM = date.getMinutes();
                var hh = date.getHours();
                var ss = date.getSeconds();

                //NaN verification := NaN !== NaN
                if (ss === ss) {
                    return [hh, MM, ss];
                }
            } catch (e) {
                console.error(e);
            }

            return [];
        }

        /**
         * private function to generate a array containing day(0), month(1) and year(2)
         * @param value
         * @returns {*}
         */
        function ddmmyyyyArray(value) {
            try {
                var date = new Date(value);
                var dd = date.getDate();
                var mm = date.getMonth() + 1;
                var yyyy = date.getFullYear();

                //NaN verification := NaN !== NaN
                if (dd === dd) {
                    return [dd, mm, yyyy];
                }
            } catch (e) {
                console.error(e);
            }

            return [];
        }

        /**
         * function to determinate days between dates
         * @param value
         * @param tovalue (optional)
         * @returns {*}
         */
        function daysTo(value, tovalue) {
            var values = ddmmyyyyArray(value);
            tovalue = tovalue || new Date();
            var todayArray = ddmmyyyyArray(tovalue);
            if (values.length === 3) {
                return ((todayArray[2] - values[2]) * 365) +
                    ((todayArray[1] - values[1]) * 30) +
                    ((todayArray[0] - values[0]));
            }

            return Number.MAX_VALUE;
        }

        /**
         * generate string like dd/mm/yyyy
         * @param value
         * @returns {string}
         */
        function ddmmyyyy(value) {
            var date = ddmmyyyyArray(value);
            for (var i in date) {
                date[i] = date[i] < 10 ? '0' + date[i] : date[i];
            }

            return date.join('/');
        }

        /**
         * function to convert a hl7 timestamp to milliseconds
         * @param hl7date like yyyyMMddhhmmss.mmm+GMT
         * @return milliseconds plus 1 january 1970 0:00
         */
        function convertHl7dateTojsDate(hl7Date) {

            //'yyyyMMddhhmmss.mmm+GMT'
            var year = hl7Date.substring(0, 4);
            var month = hl7Date.substring(4, 6);
            var day = hl7Date.substring(6, 8);
            var hour = hl7Date.substring(8, 10);
            var minute = hl7Date.substring(10, 12);
            var second = hl7Date.substring(12, 14);
            var miliseconds = hl7Date.substring(15, 18);
            var GMT = hl7Date.substring(18, 23);
            var outdate = year + '-' + month + '-' + day +
                'T' + hour + ':' + minute + ':' + second + '.' + miliseconds + GMT;

            //    "2015-03-25T12:00:00:00.000+0000"
            return new Date(outdate).getTime();
        }
    }

})();
