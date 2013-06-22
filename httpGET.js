/*!
 * httpGET.js - a simple http get wrapper for xhr.
 * @author: R. S. Doiel <rsdoiel@usc.edu>
 * Examples and documentation: https://github.com/uscwebservices/usc-js
 * copyright (c) 2012 University of Southern California
 * all rights reserved
 * Version 0.0.1 (Sept. 2012)
 *
 */
/*jslint sloppy: true, css: true, cap: true, on: true, fragment: true, browser: true, devel: true, indent: 4, maxlen: 80 */
(function (global) {
    // httpGet - Grab content via xhr.
    // @param url - the URL to get the content from
    // @param callback - the function to execute when the content is available.
    // callback's parameters are error, response object.
    // @param progress - an optional parameter to process progress from get.
    // progress has two parameters a string for readState and response object
    // @return request object or false.
    var httpGET = function (url, callback, progress) {
        var request;
        
        if (window.XMLHttpRequest) { // Mozilla, Safari, ...
            request = new XMLHttpRequest();
        } else if (window.ActiveXObject) { // IE 8 and older
            try {
                request = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    request = new ActiveXObject("Microsoft.XMLHTTP");
                } 
                catch (e) {}
            }
          }

        if (! request) {
            if (callback !== undefined) {
                callback("Can't create request object");
            } else {
                console.error("Can't create request object.");
            }
            return false;
        }
        if (callback !== undefined) {
            request.onreadystatechange = function () {
                if (progress !== undefined) {
                    switch(request.readyState) {
                    case 0:
                        progress("uninitialized", request);
                        break;
                    case 1:
                        progress("loading", request);
                        break;
                    case 2:
                        progress("loaded", request);
                        break;
                    case 3:
                        progress("interactive", request);
                        break;
                    case 4:
                        progress("complete", request);
                        break;
                    }
                }
                if (request.readyState === 4) {
                    callback(null, request);
                }
            }
        }
        request.open("GET", url);
        request.send();
        
        return request;
    };

    // Export this to the global object
    global.httpGET = httpGET;
}(this)); 
