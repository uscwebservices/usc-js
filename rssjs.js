/**
 * rssjs.js - Convert the XML representation to JSON represention for an RSS feed.
 *
 * Dave Winder, one of the individuals behind RSS has suggested as standard conversion
 * to JSON notation for rss. See http://rssjs.org for specifics. This script seeks to
 * take an XML version of RSS and flip it to the implementation suggested by rssjs.org.
 */
/*jslint browser: true */
(function (global) {
    "use strict";
    // Create a Shadow DOM containing the RSS XML
    // Query that DOM to produce a new JSON copy
    // Return that copy.
    function asRSSJS(xml) {
    }

    global.asRSSJS = asRSSJS;
}(this));
