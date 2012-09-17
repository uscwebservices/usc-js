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
    "use strict";
    var USC = {};
    
    var strToDate = function (date_string) {
        var reRelativeDate = /now|[\-+0-9]+\s+(day|month|year)/i,
            toks,
            offset,
            unit,
            now = new Date();

        if (date_string === undefined) {
            date_string = "";
        }

        if (date_string.match(reRelativeDate)) {
            if (date_string.toLowerCase("now") === true || date_string.toLowerCase("today") === true) {
                return now;
            }
            toks = date_string.split(/\s+/, 2);
            offset = Number(toks[0]);
            unit = toks[1].toLowerCase().trim();
            switch (unit) {
            case 'year':
            case 'years':
                // Fixme handle leap years.                
                offset += now.getFullYear();
                now.setYear(offset);
                break;
            case 'month':
            case 'months':
                offset += now.getMonth();
                now.setMonth(offset);
                break;
            case 'day':
            case 'days':
                offset += now.getDate();
                now.setDate(offset);
                break;
            }
            return now;
        }
        return new Date(date_string);
    };
    
    var toYYYYMMDD = function (dateObj, use_UTC) {
        var dt;
        
        if (dateObj instanceof Date) {
            dt = {
                YYYY: dateObj.getFullYear(),
                MM: (dateObj.getMonth() + 1),
                DD: dateObj.getDate(),
                toString: function () {
                    var mm = "0" + this.MM,
                        dd = "0" + this.DD;
                    mm = mm.substr(mm.length - 2);
                    dd = dd.substr(dd.length - 2);
                    return [this.YYYY, mm, dd].join("-");
                }
            };
    
            if (use_UTC === true) {
                dt.YYYY = dateObj.getUTCFullYear();
                dt.MM = dateObj.getUTCMonth() + 1;
                dt.DD = dateObj.getUTCDate();
            }
        } else {
            dt = strToDate(dateObj);
        }
        return dt.toString();
    };

    USC.toYYYYMMDD = toYYYYMMDD;
    USC.strToDate = strToDate;
    global.USC = USC;
        
    if (global.exports === undefined) {
        global.exports = {};
    }
    
    global.exports.USC = USC;
	return global;
}(this));
