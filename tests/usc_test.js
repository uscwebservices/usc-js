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
harness = require("harness"),
USC = require("../usc").USC;

// Test object structure
harness.push({callback: function (test_label) {
	assert.ok(USC, "Should have a USC object create.");
	assert.equal(typeof USC.sqlDateTime, "function", "Should have a sqlDateTime method");
	assert.ok(typeof USC.relativeDateTime, "function", "Should have a relativeDateTime method");
	assert.equal(typeof USC.sqlDate, "function", "Should have a sqlDate method");

	harness.completed(test_label);
}, label: "Test object structure"});

// Test sqlDateTime(), relativeDateTime()
harness.push({callback: function (test_label) {
	var today = new Date(),
		test_date1 = new Date(),
		test_date2 = new Date(),
		YY,
		MM,
		DD,
		hh,
		mm,
		ss,
		s,
		expected_s;
	
	YY = today.getFullYear();
	MM = "0" + (today.getMonth() + 1);
	DD = "0" + today.getDate();
	hh = "0" + today.getHours();
	mm = "0" + today.getMinutes();
	ss = "0" + today.getSeconds();
	
	MM = MM.substr(MM.length - 2);
	DD = DD.substr(DD.length - 2);
	hh = hh.substr(hh.length - 2);
	mm = mm.substr(mm.length - 2);
	ss = ss.substr(ss.length - 2);
	
	s = USC.sqlDateTime(test_date1);
	expected_s = [
		YY, "-", MM, "-", DD, " ",
		hh, ":", mm, ":", ss
	].join("");
	assert.equal(s, expected_s, "\n" + s + "\n" + expected_s);
	
	test_date2.setYear(test_date2.getFullYear() + 1);
	YY = test_date2.getFullYear();
	MM = "0" + (test_date2.getMonth() + 1);
	DD = "0" + test_date2.getDate();
	hh = "0" + test_date2.getHours();
	mm = "0" + test_date2.getMinutes();
	ss = "0" + test_date2.getSeconds();
	
	MM = MM.substr(MM.length - 2);
	DD = DD.substr(DD.length - 2);
	hh = hh.substr(hh.length - 2);
	mm = mm.substr(mm.length - 2);
	ss = ss.substr(ss.length - 2);
	
	s = USC.sqlDateTime("+1 year", false, test_date1);
	expected_s = [
		YY, "-", MM, "-", DD, " ",
		hh, ":", mm, ":", ss
	].join("");
	assert.equal(s, expected_s, "\n" + s + "\n" + expected_s);

	harness.completed(test_label);
}, label: "Test sqlDateTime(), relativeDateTime() methods on the USC object."});

// Test sqlDate()
harness.push({callback: function (test_label) {
	var today = new Date(),
		test_date1 = new Date(),
		test_date2 = new Date(),
		YY,
		MM,
		DD,
		s,
		expected_s;
	
	YY = today.getFullYear();
	MM = "0" + (today.getMonth() + 1);
	DD = "0" + today.getDate();
	
	MM = MM.substr(MM.length - 2);
	DD = DD.substr(DD.length - 2);
	
	s = USC.sqlDate(test_date1);
	expected_s = [
		YY, "-", MM, "-", DD
	].join("");
	assert.equal(s, expected_s, "\n" + s + "\n" + expected_s);
	
	test_date2.setYear(test_date2.getFullYear() + 1);
	YY = test_date2.getFullYear();
	MM = "0" + (test_date2.getMonth() + 1);
	DD = "0" + test_date2.getDate();
	
	MM = MM.substr(MM.length - 2);
	DD = DD.substr(DD.length - 2);
	
	s = USC.sqlDate("+1 year", false, test_date1);
	expected_s = [
		YY, "-", MM, "-", DD
	].join("");
	assert.equal(s, expected_s, "\n" + s + "\n" + expected_s);
	
	test_date1 = new Date();
	test_date1.setYear(test_date1.getFullYear() + 1);
	YY = test_date1.getFullYear();
	MM = "0" + (test_date1.getMonth() + 1);
	DD = "0" + test_date1.getDate();
	
	MM = MM.substr(MM.length - 2);
	DD = DD.substr(DD.length - 2);
	
	s = USC.sqlDate(test_date1);
	expected_s = [
		YY, "-", MM, "-", DD
	].join("");
	assert.equal(s, expected_s, "\n" + s + "\n" + expected_s);
	
	test_date2 = new Date();
	test_date2.setYear(test_date1.getFullYear() + 1);
	YY = test_date2.getFullYear();
	MM = "0" + (test_date2.getMonth() + 1);
	DD = "0" + test_date2.getDate();
	
	MM = MM.substr(MM.length - 2);
	DD = DD.substr(DD.length - 2);
	
	s = USC.sqlDate("+1 year", false, test_date1);
	expected_s = [
		YY, "-", MM, "-", DD
	].join("");
	assert.equal(s, expected_s, "\n" + s + "\n" + expected_s);

	harness.completed(test_label);
}, label: "Test sqlDate() methods on the USC object."});

// Test USC object's path processing.
harness.push({callback: function (test_label) {
	var s,
		expected_s;
	
	s = USC.path.join("http://web-app.usc.edu", "ws",
			"eo3", "api");
	expected_s = "http://web-app.usc.edu/ws/eo3/api";
	assert.equal(s, expected_s, "\n" + s + "\n" + expected_s);

	USC.path.delimiter = '\\';
	s = USC.path.join("http://web-app.usc.edu", "ws",
			"eo3", "api");
	expected_s = "http://web-app.usc.edu\\ws\\eo3\\api";
	assert.equal(s, expected_s, "\n" + s + "\n" + expected_s);

	USC.path.delimiter = "/";
	s = USC.path.join("//web-app.usc.edu", "ws",
			"eo3", "api");
	expected_s = "//web-app.usc.edu/ws/eo3/api";
	assert.equal(s, expected_s, "\n" + s + "\n" + expected_s);

	USC.path.prefix = 'https:';
	USC.path.suffix = 'index.html';
	USC.path.delimiter = "/";
	s = USC.path.join("/web-app.usc.edu", "ws",
			"eo3", "api");
	expected_s = "https://web-app.usc.edu/ws/eo3/api/index.html";
	assert.equal(s, expected_s, "\n" + s + "\n" + expected_s);

	USC.path.prefix = 'https:';
	USC.path.suffix = "";
	USC.path.delimiter = "/";
	s = USC.path.join("/web-app.usc.edu", "ws",
			"eo3", "api");
	expected_s = "https://web-app.usc.edu/ws/eo3/api/";
	assert.equal(s, expected_s, "\n" + s + "\n" + expected_s);

	harness.completed(test_label);
}, label: "Test USC object's path processing"});

harness.push({callback: function (test_label) {
	var conf = {db_type: "mongo", db_name: "mystuff"},
		initial_conf = USC.configure(),
		new_conf;

	assert.ok(initial_conf, "Should have an initial configuration object");
	
	assert.equal(initial_conf.db_type, undefined, "Shouldn't have db_type defined yet:" + initial_conf.db_type);

	new_conf = USC.configure(conf);
	assert.ok(new_conf, "Should have an new configuration object");
	assert.equal(conf.db_type, new_conf.db_type, "\n" + conf.db_type + "\n" + new_conf.db_type);
	harness.completed(test_label);
}, label: "Test configure() method"});

harness.push({callback: function (test_label) {
	var context = {
			USER_INFO: {
				user_id: 0,
				username: "guest",
				name: "guest",
				"super": 0,
				active: 0,
				roles: {}
			},
			CALENDAR_INFO: {
				32: {
					name: "USC Public Events",
					description: "USC Events Calendar",
					visible: "1",
					allow_guest_submit: "1",
					activity: "400",
					categories: {
						0: "Music",
						1: "Theater",
						2: "Exhibits",
						3: "Public Lectures",
						4: "Film",
						5: "Sports-Interscholastic",
						6: "Academic Lectures",
						7: "Academic Conferences",
						8: "Medical Lectures",
						9: "Sports-Recreational",
						10: "Student Sponsored Events",
						11: "Banquets/Receptions",
						12: "Commencement Activities",
						13: "Festivals/Fairs",
						14: "Webcasts",
						15: "Ongoing"
					}
				}
			},
			APP_INFO: {
				DOC_URL: "https://miratu.usc.edu",
				BASE_URL: "https://miratu.usc.edu/event-calendar",
				ALLOWED_TITLE_TAGS: "<em><i><b><u><strong>",
				ALLOWED_DESCRIPTION_TAGS: "<p><br><i><b><u><strong><em><ol><ul><li><a>",
				IMAGE_URL: "https://miratu.usc.edu/event-calendar/event_images",
				ACTIVE_API: "read,manage",
				LAUNCH_PAGE: "calendars.html"
			}
		},
		initial_context = {},
		new_context = {};

	initial_context = USC.userContext();
	assert.ok(initial_context, "Should have an initial context");
	assert.equal(initial_context.USER_INFO, undefined, "No USER_INFO expected");
	assert.equal(initial_context.CALENDAR_INFO, undefined, "No CALENDAR_INFO expected");
	assert.equal(initial_context.APP_INFO, undefined, "No CALENDAR_INFO expected");

	new_context = USC.userContext(context);
	assert.ok(new_context, "Should have a new context");
	assert.equal(typeof new_context.USER_INFO, "object", "USER_INFO expected");
	assert.equal(typeof new_context.CALENDAR_INFO, "object", "CALENDAR_INFO expected");
	assert.equal(typeof new_context.APP_INFO, "object", "CALENDAR_INFO expected");

	assert.notEqual(new_context.USER_INFO.user_id, undefined, "\n" + new_context.USER_INFO.user_id + "\n" + context.USER_INFO.user_id);
	assert.notEqual(new_context.USER_INFO.username, undefined, "\n" + new_context.USER_INFO.username + "\n" + context.USER_INFO.username);
	assert.notEqual(new_context.USER_INFO["super"], undefined, "\n" + new_context.USER_INFO["super"] + "\n" + context.USER_INFO["super"]);
	
	assert.equal(new_context.USER_INFO.user_id, context.USER_INFO.user_id, "\n" + new_context.USER_INFO.user_id + "\n" + context.USER_INFO.user_id);
	assert.equal(new_context.USER_INFO.username, context.USER_INFO.username, "\n" + new_context.USER_INFO.username + "\n" + context.USER_INFO.username);
	assert.equal(new_context.USER_INFO["super"], context.USER_INFO["super"], "\n" + new_context.USER_INFO["super"] + "\n" + context.USER_INFO["super"]);

	assert.equal(typeof new_context.CALENDAR_INFO["32"], typeof context.CALENDAR_INFO["32"], "Should have calendar info for 32");	
	assert.equal(typeof new_context.CALENDAR_INFO["32"].name, typeof context.CALENDAR_INFO["32"].name, "Should have calendar info for 32.name");	
	assert.equal(new_context.CALENDAR_INFO["32"].name, context.CALENDAR_INFO["32"].name, "\n" + new_context.CALENDAR_INFO["32"].name + "\n" + context.CALENDAR_INFO["32"].name);	
	harness.completed(test_label);
}, label: "Test userContext() method"});

harness.RunIt(path.basename(module.filename), 750);
