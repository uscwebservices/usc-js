//
// usc.js - JavaScript library of helpful things for USC resources.
// @author: R. S. Doiel <rsdoiel@usc.edu>
// Examples and documentation: https://github.com/uscwebservices/usc-js
// copyright (c) 2012 University of Southern California
// all rights reserved
// Version 0.0.1 (Sept. 2012)
//
/*jslint devel: true, node: true, maxerr: 50, indent: 4,  vars: true, sloppy: true */
(function (global) {
    var USC = {
        relativeDateTime: function (date_string, seedDate) {
            var reRelativeDate = /now|[\-+0-9]+\s+(day|month|year)/i,
                toks,
                offset,
                unit,
                now;

            if (seedDate === undefined) {
                now = new Date();
            } else if (seedDate instanceof Date) {
                now = seedDate;
            }

            if (date_string === undefined) {
                date_string = "";
            }

            if (date_string.match(reRelativeDate)) {
                if (date_string.toLowerCase("now") === true ||
                        date_string.toLowerCase("today") === true) {
                    return now;
                }
                toks = date_string.split(/\s+/, 2);
                offset = Number(toks[0]);
                unit = toks[1].toLowerCase().trim();
                switch (unit) {
                case 'years':
                case 'year':
                case 'yr':
                case 'y':
                    offset += now.getFullYear();
                    now.setYear(offset);
                    break;
                case 'months':
                case 'month':
                case 'mon':
                case 'mo':
                case 'm':
                    offset += now.getMonth();
                    now.setMonth(offset);
                    break;
                case 'days':
                case 'day':
                case 'dy':
                case 'd':
                    offset += now.getDate();
                    now.setDate(offset);
                    break;
                case 'hours':
                case 'hour':
                case 'hr':
                case 'h':
                    offset += now.getHours();
                    now.setHours(offset);
                    break;
                case 'minutes':
                case 'minute':
                case 'min':
                case 'mn':
                case 'i':
                    offset += now.getMinutes();
                    now.setMinutes(offset);
                    break;
                case 'seconds':
                case 'second':
                case 'sec':
                case 's':
                    offset += now.getSeconds();
                    now.setSeconds(offset);
                    break;
                }
                return now;
            }
            return new Date(date_string);
        },

        sqlDate: function (dateObj, use_UTC, seedDate) {
            var dt;

            dt = {
                fromDate: function (dateObj, use_UTC) {
                    if (use_UTC === undefined ||
                            use_UTC === false) {
                        this.YYYY = dateObj.getFullYear();
                        this.MM = (dateObj.getMonth() + 1);
                        this.DD = dateObj.getDate();
                    } else if (use_UTC === true) {
                        this.YYYY = dateObj.getUTCFullYear();
                        this.MM = dateObj.getUTCMonth() + 1;
                        this.DD = dateObj.getUTCDate();
                    }
                },
                toString: function () {
                    var MM = "0" + this.MM,
                        DD = "0" + this.DD;
                    MM = MM.substr(MM.length - 2);
                    DD = DD.substr(DD.length - 2);
                    return [this.YYYY, MM, DD].join("-");
                }
            };

            if (dateObj instanceof Date) {
                dt.fromDate(dateObj, use_UTC);
            } else if (seedDate === undefined) {
                dt.fromDate(this.relativeDateTime(dateObj));
            } else {
                dt.fromDate(this.relativeDateTime(dateObj, seedDate));
            }
            return dt.toString();
        },

        sqlDateTime: function (dateObj, use_UTC, seedDate) {
            var dt;

            dt = {
                fromDate: function (dateObj, use_UTC) {
                    if (use_UTC === undefined ||
                            use_UTC === false) {
                        this.YYYY = dateObj.getFullYear();
                        this.MM = (dateObj.getMonth() + 1);
                        this.DD = dateObj.getDate();
                        this.hh = dateObj.getHours();
                        this.mm = dateObj.getMinutes();
                        this.ss = dateObj.getSeconds();
                    } else if (use_UTC === true) {
                        this.YYYY = dateObj.getUTCFullYear();
                        this.MM = dateObj.getUTCMonth() + 1;
                        this.DD = dateObj.getUTCDate();
                        this.hh = dateObj.getUTCHours();
                        this.mm = dateObj.getUTCMinutes();
                        this.ss = dateObj.getUTCSeconds();
                    }
                },
                toString: function () {
                    var MM = "0" + this.MM,
                        DD = "0" + this.DD,
                        hh = "0" + this.hh,
                        mm = "0" + this.mm,
                        ss = "0" + this.ss;
                    MM = MM.substr(MM.length - 2);
                    DD = DD.substr(DD.length - 2);
                    hh = hh.substr(hh.length - 2);
                    mm = mm.substr(mm.length - 2);
                    ss = ss.substr(ss.length - 2);
                    return [this.YYYY, MM, DD].join("-") +
                        " " + [hh, mm, ss].join(":");
                }
            };

            if (dateObj instanceof Date) {
                dt.fromDate(dateObj, use_UTC);
            } else if (seedDate === undefined) {
                dt.fromDate(this.relativeDateTime(dateObj));
            } else {
                dt.fromDate(this.relativeDateTime(dateObj, seedDate));
            }
            return dt.toString();
        }
    };


    global.USC = USC;
    if (global.exports === undefined) {
        global.exports = {};
    }
    global.exports.USC = USC;
}(this));
