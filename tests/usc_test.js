//
// usc_test.js - Test code for usc.js
// @author: R. S. Doiel <rsdoiel@usc.edu>
// Examples and documentation: https://github.com/uscwebservices/usc-js
// copyright (c) 2012 University of Southern California
// all rights reserved
// Version 0.0.1 (Sept. 2012)
//
/*jslint devel: true, node: true, maxerr: 50, indent: 4,  vars: true, sloppy: true */

var path = require("path"),
    assert = require("assert"),
    harness = require("../lib/harness"),
    USC = require("../usc").USC;

harness.push({callback: function () {
    var test_date = new Date("09/17/2012"),
        test_date2 = new Date(),
        s,
        expected_s,
        lzero = function (s) {
            s = "0" + s;
            return s.substr(s.length - 2);
        };

    assert.ok(USC, "Should have a USC object create.");
    assert.equal(typeof USC.sqlDate, "function", "Should have a sqlDate method");
    assert.ok(typeof USC.relativeDate, "function", "Should have a relativeDate method");

    s = USC.sqlDate(test_date);
    expected_s = "2012-09-17";
    assert.equal(s, expected_s, "Should have toYYYYMMDD() date.");

    test_date2.setYear(test_date2.getFullYear() + 1);
    s = USC.sqlDate("+1 year");
    expected_s = test_date2.getFullYear() + "-" + lzero(1 + test_date2.getMonth()) + "-" + test_date2.getDate();

    assert.equal(s, expected_s, "toYYYYMMDD() should render relative year date.");
}, label: "Test date methods on the USC object."});

if (require.main === module) {
    harness.RunIt(path.basename(module.filename), 10, true);
} else {
    exports.RunIt = harness.RunIt;
}
