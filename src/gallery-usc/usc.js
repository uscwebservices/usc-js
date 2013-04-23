/**
 * USC.js - A YUI3 USC module for sites and apps.
 * @author R. S. Doiel, <rsdoiel@usc.edu>
 *
 * copyright (c) 2013 University of Southern California
 * All rights reserved.
 */
/*jslint browser: true, undef: true, newcap: true, indent: 4, maxerr: 12 */
/*global YUI */
YUI.add("usc", function (Y) {
	"use strict";
	var cache_ready = false,
		// Semi-constant variables
		seconds = 1000,
		minutes = seconds * 60,
		hours = minutes * 60,
		days = hours * 24;

	Y.StorageLite.on("storage-lite:ready", function () {
		cache_ready = true;
	});
	
	/**
	 * Return the boolean of storage being ready or not.
	 */
	function storageReady() {
		return cache_ready;
	}

	/**
	 * parseUrl: construct a parsed URL object.
	 * @method parseUrl
	 * @param {String} the url to parse. If undefined then use window.location.href
	 * @return {Object} A Url object with properties of protocol, hostname, port, path, query args, and hash
	 */
	function parseUrl(href) {
		var url = href || window.location.href || "",
			self = {
				protocol: '',
				hostname: '',
				pathname: '',
				basename: '',
				extname: '',
				querystring: null,
				query: {},
				hash: null
			},
			params = [],
			cur = 0,
			i = 0,
			j = 0;

		// Trim off any hash tag
		i = url.indexOf('#');
		if (i > -1) {
			self.hash = url.substr(i + 1);
			url = url.substr(0, i);
		}
		// Trim off any parameters found
		i = url.indexOf('?');
		if (i > -1) {
			self.querystring = url.substr(i + 1);
			url = url.substr(0, i);
			/*
			if (self.querystring.indexOf('&') > -1) {
				params = self.querystring.split('&');
				for (i = 0; i < params.length; i += 1) {
					params[i] = decodeURI(params[i]);
					j = params[i].indexOf('=');
					if (j > -1) {
						self.query[params[i].substr(0, j)] = params[i].substr(j + 1);
					}
				}
			} else if (self.querystring.indexOf('=') > -1) {
				params = decodeURI(self.querystring);
				j = params.indexOf('=');
				if (j > -1) {
					self.query[params.substr(0, j)] = params.substr(j + 1);
				}
			}
			*/
			self.query = Y.QueryString.parse(self.querystring);
		}

		// Now process and parse the URL for self.
		if (url) {
			i = url.indexOf('://');
			if (i > -1) {
				self.protocol = url.substr(cur, i);
				cur = i + self.protocol.length - 1;
			}
			i = url.substr(cur).indexOf('/');
			if (i > -1) {
				self.hostname = url.substr(cur, i);
				cur += self.hostname.length;
			}
			self.pathname = url.substr(cur);
			// Now get directory, then basename and finally extension
			cur = self.pathname.indexOf('/');
			i = self.pathname.lastIndexOf('/');
			if (cur > -1 && i > -1 && cur < i) {
				self.basename = self.pathname.substr(i + 1);
				self.path = self.pathname.substr(0, i);
				i = self.basename.lastIndexOf('.');
				if (i > -1) {
					self.extname = self.basename.substr(i);
				}
			}
		}
			
		return self;
	}

	/**
	 * Clear cached url's data or everything in cache.
	 * @method clearData
	 * @param url {String} the url that was cached, if undefined, then clear everything
	 */
	function clearData(api_uri) {
		if (storageReady === true) {
			if (typeof api_uri === "undefined") {
				return Y.StorageLite.clear();
			} else {
				return Y.StorageLite.removeItem(api_uri);
			}
		}
		return true;
	}
	
	
	/**
	 * Using Y.io fetch data, cache via Y.StorageLite with an experiation time.
	 * @method getData
	 * @param api_uri {String} - the url to fetch
	 * @param view_callback {Function} - the Callback to pass the data retrieved to
	 * @param expires_in_minutes {Number} - the number of minutes before the cache is considered stale. 
	 */
	function getData(api_uri, view_callback, expires_in_minutes) {
		var item, now = new Date(), refresh_minutes = 15 * minutes;
		
		if (typeof expires_in_minutes !== "undefined") {
			refresh_minutes = 1000 * 60 * expires_in_minutes;
		} else if (expires_in_minutes === false || expires_in_minutes < 1) {
			refresh_minutes = 0;
		}
		
		Y.log("Getting up API data", "debug");
		function onSuccess(id, res, args) {
			var items;
			
			try {
				items = JSON.parse(res.responseText);
			} catch (e) {
				view_callback(e, null);
				return;
			}
			view_callback(null, items);
			if (storageReady() === true && refresh_minutes > 0) {
				Y.StorageLite.setItem(api_uri, {expires: (now + refresh_minutes), data: items, args: args}, true);
			}
		}
			
		function onFailure(id, response, args) {
			view_callback({
				toString: function () {
					return [api_uri, "error"].join(" ");
				},
				id: id,
				response: response,
				args: args
			}, null);
		}
		
		if (storageReady() === true && refresh_minutes > 0) {
			item = Y.StorageLite.getItem(api_uri);
			if (item && refresh_minutes &&
					typeof item.expires !== "undefined" &&
					item.expires > now) {
				view_callback(null, item.data);
				return;
			}
		}

		Y.io(api_uri, {
			on: {
				success: onSuccess,
				failure: onFailure
			}
		});
    }
	
	/**
	 * Timie Unit is an object containing common time visions in microseconds. It
	 * also provides a simple relativeTime() method against and an initial date object.
	 * @class TimeUnits
	 * @property seconds (i.e. 1000 is one second)
	 * @property minutes (i.e. 60 * seconds)
	 * @property hours (i.e. 60 * minutes)
	 * @property days (i.e. 24 * hours)
	 */
	function TimeUnits() {
		return {
			seconds: seconds,
			minutes: minutes,
			hours: hours,
			days: days,
			/*
			 * @method relativeTime - compute the relative time based on an existing Date object and
			 * a simple time notation (e.g. +2 hours, -60 days)
			 * @param {Date} 
			 * @param {String} A relative time notation string (e.g. +15m, -2h)
			 * @return new {Date}
			 */
			relativeTime: function (date_object, time_notation) {
				/* toks maps units to milliseconds scaling value */
				var toks = {
						/* 24*60*60*1000 */
						d: 86400000,
						dy: 86400000,
						day: 86400000,
						days: 86400000,
						/* 60*60*1000 */
						h: 3600000,
						hr: 3600000,
						hour: 3600000,
						hours: 3600000,
						/* 60*1000 */
						m: 60000,
						min: 60000,
						minute: 60000,
						minutes: 60000,
						/* 1000 */
						s: 1000,
						sec: 1000,
						secs: 1000,
						second: 1000,
						seconds: 1000
					},
					result = date_object.valueOf(),
					tokens = time_notation.toLowerCase().split(" "),
					val = 0,
					scale = 1,
					tok,
					i = 0,
					j = 0,
					cur = -1;
				
				for (i = 0; i < tokens.length; i += 1) {
					tok = false;
					if (Number(tokens[i])) {
						val = tokens[i];
					} else {
						cur = tokens[i].match(/[a-z]/);
						if (cur) {
							j = cur.index;
							tok = tokens[i].substr(j);
							if (j > 0) {
								val = tokens[i].substr(0, j);
							}
						} else {
							tok = tokens[i];
						}
			
						if (tok && val) {
							scale = toks[tok];
							result += val * scale;
							val = 0;
							tok = false;
						}
					}
				}
				return new Date(result);
			}
		};
	}
	
	/**
	 * A data unit takes a URL data a source and applies a Handlebars template
	 * to it updating a target CSS selector.
	 *
	 * @method DataUnit
	 * @param refresh_in {Number} the number of microseconds since the Unix Epoc (i.e. how setTimeout() counts time)
	 */
	function DataUnit(refresh_in) {
		Y.log("Creating DataUnit", "debug");
		if (typeof refresh_in_minutes === "undefined") {
			refresh_in = 15 * TimeUnits.minutes;
		}
		return {
			calendarAPI: "http://web-app.usc.edu/ws/url-cache/api/ecal3",
			newsAPI: "http://web-app.usc.edu/ws/url-cache/api/news",
			refresh_in: refresh_in,
			templates: {},
			/*
			 * Get, compile the template from an HRef or CSS selector
			 * @method getTemplate
			 * @param {String} CSS selector pointing template. Used as key when referring to template.
			 * @return {Function} template, results from Y.Handlebars.compile()
			 */
			getTemplate: function (selector) {
				var template;
				if (typeof this.templates[selector] === "function") {
					return this.templates[selector];
				} else if (selector.indexOf("://") > -1) {
					throw "getTemplate() from URL not implemented.";
				}
				
				selector = Y.one(selector);
				if (selector) {
					template = Y.Handlebars.compile(selector.getHTML());
				} else {
					throw "Can't find selector for template";
				}
				// Save the compiled template for later				
				this.templates[selector] = template;
				return template;
			},
			
			/*
			 * @method: render
			 * @param api_url {String}
			 * @param template_selector {String}
			 * @param target_selector {String}
			 */
			render: function (api_url, template_selector, target_selector) {
				var template = this.getTemplate(template_selector),
					target = Y.one(target_selector);
				Y.log("Getting " + api_url, "debug");
				getData(api_url, function (error, data) {
					if (error) {
						Y.log(error, "error");
					}
					Y.log("Rendering template()", "debug");
					target.setHTML(template({error: error || "", data: data}));
				}, refresh_in);
			}
		};
	}

	// Now export the methods applied to the USC object.
	if (typeof Y.USC === "undefined") {
		Y.USC = {};
	}
	
	
	Y.USC.TimeUnits = TimeUnits;
	Y.USC.DataUnit = DataUnit;
	Y.USC.parseUrl = parseUrl;
	Y.USC.getData = getData;
	Y.USC.clearData = clearData;
	Y.USC.storageReady = storageReady;
}, '0.0.1-pre', {
	debug: true,
	requires: [ "node-base", "io-base", "querystring-parse", "handlebars", "gallery-storage-lite" ]
});
