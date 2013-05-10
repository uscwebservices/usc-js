/**
 * usc-url.js - A simple object to working with URLs.
 * Based on NodeJS' url module.
 * @author R. S. Doiel, <rsdoiel@usc.edu>
 * copyright (c) 2013 University of Southern California
 * all rights reserved.
 */
/*jslint browser: true, indent: 4 */
(function (GLOBAL) {
    "use strict";
    // Create a USC namespace if needed.
    var USC = GLOBAL.USC || {};

    // Add Url object factory to USC namespace.
    USC.Url = function () {
        return {
            parse: function (url) {
                var pos = 0,
                    cur = 0,
                    s = url,
                    kv,
                    self = {
                        protocol: null,
                        // includes port
                        host: null,
                        // excludes port
                        hostname: null,
                        // port number as string
                        port: null,
                        // includes parameters
                        path: "/",
                        // excludes parameters
                        pathname: "/",
                        // unparsed querystring including ?
                        search: "",
                        // parsed key/value pairs from querystring
                        query: null,
                        auth: null,
                        hash: null,
                        href: url
                    };
                 
                // Node makes query {} if ? is anywhere in the URL
                if (s.indexOf("?")) {
                    if (self.query === null) {
                        self.query = {};
                    }
                }
                cur = s.indexOf("#");
                if (cur > -1) {
                   self.hash = s.substr(cur); 
                   s = s.substr(0,cur);
                }
                cur = s.substr(pos).indexOf("://");
                if (cur > -1) {
                    self.protocol = s.substr(pos, cur + 1);
                    // Advance pos
                    pos += cur + 3;
                }
                cur = s.substr(pos).indexOf("@");
                if (cur > -1) {
                    self.auth = s.substr(pos, cur);
                    // Advance pos
                    pos += cur + 1
                }
                cur = s.substr(pos).indexOf("/");
                if (cur > -1) {
                    self.host = s.substr(pos, cur);
                    // Advance pos
                    pos += cur;
                } else {
                    self.host = s.substr(pos);
                    // Advance pos to end, there is nothing left.
                    pos = s.length;
                }
                cur = self.host.indexOf(":");
                if (cur > -1) {
                    self.port = self.host.substr(cur + 1);
                    self.hostname = self.host.substr(0, cur);
                } else {
                    self.hostname = self.host;
                    self.port = null;
                }
                self.path = s.substr(pos);
                cur = s.substr(pos).indexOf('?');
                if (cur > -1) {
                    self.search = s.substr(pos + cur);
                    self.search.substr(1).split('&').forEach(function (item) {
                        kv = item.split('=', 2);
                        if (kv.length === 2) {
                            self.query[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]);                    
                        }
                    });
                }
                if (self.path === null || self.path === "") {
                    self.path = '/';
                }
                cur = self.path.indexOf('?');
                if (cur > -1) {
                    self.pathname = self.path.substr(0, cur);
                } else {
                    self.pathname = self.path;
                }
                if (self.pathname === "/" &&
                        self.href.lastIndexOf("/") !== self.href.length - 1) {
                    if (self.hash === null) {
                        self.href = self.href + "/";
                    } else if (self.href.indexOf("/#") < 0) {
                        self.href = self.href.replace(/#/, "/#");
                    }
                }
                return self;
            },
            format: function (url) {
                var output = [];
                if (typeof url.protocol !== "undefined" && url.protocol.length > 0) {
                    output.push(url.protocol);
                    output.push("//");
                }
                if (typeof url.auth !== "undefined" && url.auth !== null) {
                    output.push(url.auth);
                    output.push("@");
                }
                if (typeof url.hostname !== "undefined" && url.hostname.length > 0) {
                    output.push(url.hostname);
                }
                if (typeof url.port !== "undefined" && url.port !== null) {
                    output.push(":");
                    output.push(url.port);
                }
                if (typeof url.pathname !== "undefined" && url.pathname.length > 1) {
                    output.push(url.pathname);
                }
                if (typeof url.query === "object" && url.query !== null) {
                    Object.keys(url.query).forEach(function (ky, i) {
                        if (i === 0) {
                            output.push('?');
                        } else {
                            output.push('&');
                        }
                        output.push(encodeURIComponent(ky));
                        output.push('=');
                        output.push(encodeURIComponent(url.query[ky]));
                    });
                }
                if (typeof url.hash !== "undefined" && url.hash !== null) {
                    output.push(url.hash);
                }
                return output.join("");        
            }
        };
    };
    
    if (exports) {
        exports.Url = USC.Url;
    }
    GLOBAL.USC = USC;
    return GLOBAL;
}(this));
