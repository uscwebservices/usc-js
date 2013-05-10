/**
 * usc-url_test.js - Test methods for USC.Url() constructed object.
 * @author: R. S. Doiel, <rsdoiel@usc.edu>
 * copyright (c) 2013 University of Southern California
 * all rights reserved
 *
 * This is based usc-url.js on the NodeJS url module.
 */
/*jslint node: true, indent: true */
var USC = require("../usc-url"),
    assert = require("assert"),
    url = require("url"),
    expected_url_strings = [
        "http://www.usc.edu",
        "http://www.usc.edu:8080",
        "http://web-app.usc.edu/ws/eo3/api/details/32?limit=10",
        "http://web-app.usc.edu:8081/ws/eo3/api/details/32?limit=10",
        "http://tommy.trojan@web-app.usc.edu/web/ecal3/api/details/32?limit=10&category=film",
        "https://tommy.trojan@web-app.usc.edu/web/ecal3/api/details/32?limit=10&category=film",
        "https://tommy.trojan@web-app.usc.edu:3000/web/ecal3/api/details/32?limit=10&category=film",
        "http://tommy.trojan:T1R3B1T3R@web-app.usc.edu/web/ecal3/api/details/32?limit=10&category=film",
        "https://tommy.trojan:T1R3B1T3R@web-app.usc.edu/web/ecal3/api/details/32?limit=10&category=film",
        "http://tommy.trojan:T1R3B1T3R@web-app.usc.edu:3000/web/ecal3/api/details/32?limit=10&category=film",
        "http://www.usc.edu#one",
        "http://www.usc.edu:8080#two",
        "http://web-app.usc.edu/ws/eo3/api/details/32?limit=10#two",
        "http://web-app.usc.edu:8081/ws/eo3/api/details/32?limit=10#three",
        "http://tommy.trojan@web-app.usc.edu/web/ecal3/api/details/32?limit=10&category=film#four",
        "https://tommy.trojan@web-app.usc.edu/web/ecal3/api/details/32?limit=10&category=film#five",
        "https://tommy.trojan@web-app.usc.edu:3000/web/ecal3/api/details/32?limit=10&category=film#six",
        "http://tommy.trojan:T1R3B1T3R@web-app.usc.edu/web/ecal3/api/details/32?limit=10&category=film#seven",
        "https://tommy.trojan:T1R3B1T3R@web-app.usc.edu/web/ecal3/api/details/32?limit=10&category=film#eight",
        "http://tommy.trojan:T1R3B1T3R@web-app.usc.edu:3000/web/ecal3/api/details/32?limit=10&category=film#nine",
        "http://tommy.trojan:T1R3B1T3R@web-app.usc.edu/web/ecal3/api/details/32#ten?limit=10&category=film#seven",
        "https://tommy.trojan:T1R3B1T3R@web-app.usc.edu/web/ecal3/api/details/32#eleven?limit=10&category=film#eight",
        "http://tommy.trojan:T1R3B1T3R@web-app.usc.edu:3000/web/ecal3/api/details/32?limit=10#twelve&category=film"
    ];

function testObject(expected_url, test_url, expected_url_string, test_url_string) {
    var keys = ["protocol", "hostname", "host", "port", "pathname", "path", "search", "query", "auth", "href"];

    console.log("\nChecking parse\nexpected_url", expected_url, "\ntest_url",  test_url);
    keys.forEach(function (ky, i) {
        var obj;
        if (typeof expected_url[ky] === "object" && expected_url[ky] !== null) {
            obj = expected_url[ky];
            Object.keys(obj).forEach(function (qky, i) {
                assert.strictEqual(expected_url[ky][qky], test_url[ky][qky], i + "th qkey '" + qky + "' for " + JSON.stringify(test_url[ky]));
            });
        } else {
            assert.strictEqual(expected_url[ky], test_url[ky], i + "th key '" + ky + "': [" + test_url[ky] + "] expected: [" + expected_url[ky] + ']');        
        }
    });
    console.log("Checking format\n\texpected", expected_url_string, "\n\t    test", test_url_string);
    assert.strictEqual(expected_url_string, test_url_string);
}

console.log("Starting tests...");

expected_url_strings.forEach(function (expected_url_string) {
    var u = new USC.Url(),
        expected_url = url.parse(expected_url_string, true),
        test_url_string,
        test_url;

    test_url = u.parse(expected_url_string);
    test_url_string = u.format(expected_url);
    testObject(expected_url, test_url, expected_url_string, test_url_string);
});
    
console.log("Success!");

