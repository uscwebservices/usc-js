/**
 * usc.js - JavaScript library of helpful things for USC resources.
 * @author: R. S. Doiel <rsdoiel@usc.edu>
 * Examples and documentation: https://github.com/uscwebservices/usc-js
 * copyright (c) 2012 University of Southern California
 * all rights reserved
 * Version 0.0.1 (Sept. 2012)
 *
 * To use in a web browser load usc.js then load usc.browser.js
 */
/*jslint devel: true, node: true, maxerr: 50, indent: 4,  vars: true, 
 sloppy: true */
(function (global) {
    var USC = {
        config: {},
        configure: function (new_config) {
            var self = this;
            if (new_config === undefined) {
                return self.config;
            }
            
            try {
                Object.keys(new_config).forEach(function (ky) {
                    self.config[ky] = new_config[ky];
                });
            } catch (err) {
                console.error(err);
                return false;
            }
            return self.config;
        },
        user_context: {},
        userContext: function (new_context) {
            var self = this;
            
            if (new_context === undefined) {
                return self.user_context;
            }
            
            try {
                Object.keys(new_context).forEach(function (ky) {
                    self.user_context[ky] = new_context[ky];
                });
            } catch (err) {
                console.error(err);
                return false;
            }
            return self.user_context;
        },
        relativeDateTime: function (date_string, seed_date) {
            var re_relative_date = /now|[\-+0-9]+\s+(day|month|year)/i,
                toks,
                offset,
                unit,
                now;

            if (seed_date === undefined) {
                now = new Date();
            } else if (seed_date instanceof Date) {
                now = seed_date;
            }

            if (date_string === undefined) {
                date_string = "";
            }

            if (date_string.match(re_relative_date)) {
                if (date_string.toLowerCase() === "now" ||
                        date_string.toLowerCase() === "today") {
                    return now;
                } else if (date_string.indexOf(" ") < 0) {
                    throw "Not a relative date string:" + date_string;
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

        sqlDate: function (date_object, use_UTC, seed_date) {
            var dt;

            dt = {
                fromDate: function (date_object, use_UTC) {
                    if (use_UTC === undefined ||
                            use_UTC === false) {
                        this.YYYY = date_object.getFullYear();
                        this.MM = (date_object.getMonth() + 1);
                        this.DD = date_object.getDate();
                    } else if (use_UTC === true) {
                        this.YYYY = date_object.getUTCFullYear();
                        this.MM = date_object.getUTCMonth() + 1;
                        this.DD = date_object.getUTCDate();
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

            if (date_object instanceof Date) {
                dt.fromDate(date_object, use_UTC);
            } else if (seed_date === undefined) {
                dt.fromDate(this.relativeDateTime(date_object));
            } else {
                dt.fromDate(this.relativeDateTime(date_object, seed_date));
            }
            return dt.toString();
        },

        sqlDateTime: function (date_object, use_UTC, seed_date) {
            var dt;

            dt = {
                fromDate: function (date_object, use_UTC) {
                    if (use_UTC === undefined ||
                            use_UTC === false) {
                        this.YYYY = date_object.getFullYear();
                        this.MM = (date_object.getMonth() + 1);
                        this.DD = date_object.getDate();
                        this.hh = date_object.getHours();
                        this.mm = date_object.getMinutes();
                        this.ss = date_object.getSeconds();
                    } else if (use_UTC === true) {
                        this.YYYY = date_object.getUTCFullYear();
                        this.MM = date_object.getUTCMonth() + 1;
                        this.DD = date_object.getUTCDate();
                        this.hh = date_object.getUTCHours();
                        this.mm = date_object.getUTCMinutes();
                        this.ss = date_object.getUTCSeconds();
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

            if (date_object instanceof Date) {
                dt.fromDate(date_object, use_UTC);
            } else if (seed_date === undefined) {
                dt.fromDate(this.relativeDateTime(date_object));
            } else {
                dt.fromDate(this.relativeDateTime(date_object, seed_date));
            }
            return dt.toString();
        },
        
        path: {
            delimiter: '/',
            prefix: null,
            suffix: null,
            join: function () {
                var i, start, end, parts = [];

                if (this.prefix !== null) {
                    parts.push(this.prefix);
                }

                for (i = 0; i < arguments.length; i += 1) {
                    start = 0;
                    end = 0;
                    if (arguments[i].indexOf(this.delimiter) === 0 && i > 0) {
                        start = 1;
                    }
                    if (arguments[i].lastIndexOf(this.delimiter) ===
                            (arguments[i].length - 1)) {
                        end = arguments[i].length - 2;
                    }
                    if (start !== 0 || end !== 0) {
                        parts.push(arguments[i].substr(start, end));
                    } else {
                        parts.push(arguments[i]);
                    }
                }
                if (this.suffix !== null) {
                    parts.push(this.suffix);
                }
                return parts.join(this.delimiter);
            }
        }
    };


    global.USC = USC;
    if (global.exports === undefined) {
        global.exports = {};
    }
    global.exports.USC = USC;
}(this));
