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
	// throw "usc.browser_test.js runs in a web browser.";
}

// Getting that objects are initialized.
harness.push({callback: function (test_label) {
	assert.ok(USC, "Should have a USC object.");
	assert.strictEqual(typeof USC, "object", "USC should be an object.");
	assert.ok(USC.jq, "Should have USC.jq defined.");
	assert.strictEqual(typeof USC.jq, "function",
						"USC.jq should be a function.");
	harness.completed(test_label);
}, label: "Getting that objects are initialized."});


harness.push({callback: function (test_label) {
	var config = {};
	
	assert.ok(USC.configure, "Should have a configured method still.");
	config = USC.configure();
	assert.ok(config, "Should have a copy of the configuration previously loaded");
	assert.ok(config.test, "Shoudl config.test");
	assert.strictEqual(config.test, 1, "config.test === 1");
	assert.strictEqual(config.name, "John Doe", "config.name === 'John Doe'");
	assert.strictEqual(config.email, "john.doe@example.com", "config.email === 'john.doe@example.com'");
	harness.completed(test_label);
}, label: "Test configured USC object."});

harness.push({callback: function (test_label) {
	var s,
		expected_s;
	
	s = USC.argv();
	expected_s = {test: 2};
	console.warn("This test should fail if ?test=2 is not passed to page.");
	assert.ok(s, "Should have an object for s");
	assert.ok(s.test, "Should have s.test available.");
	assert.equal(s.test, expected_s.test, "\n" + s.test + "\n" + expected_s.test);
	harness.completed(test_label);
}, label: "Test getting URL parameters"});

harness.push({callback: function (test_label) {
	var context = USC.userContext();
	
	assert.ok(context, "Should have a user context defined.");
	harness.completed(test_label);
}, label: "Text userContext()"});

harness.push({callback: function (test_label) {
	USC.httpGet("config.json",
		function (error, response) {
			var config = {};
			assert.ok(!error, "Should not get an error: " + error);
			assert.ok(response, "Should get some buffered data back.");
			config = JSON.parse(response.responseText);
			assert.ok(config, "Should have a config object.");
			assert.ok(config.name, "Should have config.name");
			assert.ok(config.test, "Should have config.test");
			assert.ok(config.email, "Should have config.email");
			assert.strictEqual(config.test, 1, "\n" + config.test + "\n" + 1);
			assert.equal(config.name, "John Doe", "\n" + config.name + "\nJohn Doe");
			assert.equal(config.email, "john.doe@example.com", "\n" + config.name + "\njohn.doe@example.com");
			harness.completed(test_label);
		});
	
}, label: "Test httpGet()"});

harness.RunIt("usc.browser_test.js", 1000);
