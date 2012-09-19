//
// usc.browser_test.js - Browser based tests for USC object
// and jQuery plugin.
//
/*jslint sloppy: true, css: true, cap: true, on: true, fragment: true, browser: true, devel: true, indent: 4, maxlen: 80 */
/*global USC, jQuery, harness, process, assert */

// Tests if console is available
if (console === undefined || console.log === undefined) {
	throw "Console not available in this browser.";
}
try {
	if (harness) {
		console.log("Harness Available.");
	}
} catch (err) {
	console.log("usc.browser_test.js runs in a web browser.");
	process.exit(1);
//	throw "usc.browser_test.js runs in a web browser.";
}

// Getting that objects are initialized.
harness.push({callback: function () {
	assert.ok(USC, "Should have a USC object.");
	assert.strictEqual(typeof USC, "object", "USC should be an object.");
	assert.ok(USC.jq, "Should have USC.jq defined.");
	assert.strictEqual(typeof USC.jq, "function",
                       "USC.jq should be a function.");
}, label: "Getting that objects are initialized."});



if (document && window) {
	harness.RunIt("usc.browser_test.js", 1, true);
} else {
	alert("Cannot run harness in your browser.");
}