/*!
 * USC Events Calendar jQuery Plugin
 * By Cameron Bates
 * Examples and documentation at: http://web-app.usc.edu/ws/eo3/help/jqplugin
 * Copyright (c) 2011 University of Southern California
 * Version: 1.0 (October 2011)
 * Dual licensed under the MIT and GPL licenses.
 */
/*jslint sloppy: true, css: true, cap: true, on: true, fragment: true, browser: true, devel: true, indent: 4, maxlen: 80 */
/*global USC, jQuery */

(function ($) {
	$.uscecal = function (el, cal_id, options) {
		var base = this;
		base.$el = $(el);
		base.el = el;
		base.$el.data("uscecal", base);
        
		base.init = function () {
            var restURL,
                jsonStr,
                jsonOpts,
                event_id;

			if (typeof cal_id === "undefined" || cal_id === null) {
                cal_id = 32;
            }
			base.cal_id = cal_id;

			base.options = $.extend({}, $.uscecal.defaultOptions, options);

			// base path for the eo3 api
			restURL = 'https://web-app.usc.edu/ws/url-cache/api/ecal3/';
			
			// if the detail page is requested grab the event_id from the URL
			if (base.options.view === "detail") {
				event_id = base.getUrlVars().event_id;
				if (parseInt(event_id, 10)) {
					restURL += base.options.view + '/' +
                        parseInt(event_id, 10) + '/';
				} else {
					base.$el.html("ERROR. Invalid event_id");
					return false;
				}
			} else {
				restURL += base.options.view + '/' + base.cal_id + '/' +
                    encodeURIComponent(USC.sqlDate(base.options.startDate)) +
                    '/' +
                    encodeURIComponent(USC.sqlDate(base.options.endDate)) + '/';
			}

			if (base.options.jsonp) {
                restURL += '?callback=?';
			}
			jsonStr = '{';
			jsonStr += '"limit":"' + base.options.limit + '"';
			if (base.options.categories) {
                jsonStr += ', "categories":"' + base.options.categories + '"';
            }
			jsonStr += '}';
			jsonOpts = jQuery.parseJSON(jsonStr);
			
			console.log(restURL);
			$.getJSON(restURL, jsonOpts, function (data) {
				var events = [], imgURL, titleNoHTML, itemHTML;

				// format the data according to the view requested
				switch (base.options.view) {
                case 'highlights':
                    $.each(data, function (i, item) {
                        var itemHTML,
                            imgURL = base.getImageURL(item);
                        itemHTML = '<' + base.options.elem + ' class="' +
                            base.options.className + '">';
                        if (imgURL !== "") {
                            itemHTML += '<div class="image"><a href="' +
                                base.options.baseURL +
                                item.event_id + '"><img src="' + imgURL +
                                '" alt="' +
                                item.title.replace(/(<([^>]+)>)/ig, "") +
                                '" /></a></div>';
                        }
                        itemHTML += '<' + base.options.titleElem +
                            '><a href="' + base.options.baseURL +
                            item.event_id + '">' + item.title + '</a></'
                            + base.options.titleElem + '>';
                        itemHTML += '<p class="event_date">' +
                            base.parseSchedule(item.schedule) + '</p>';
                        itemHTML += '</' + base.options.elem + '>';
                        events.push(itemHTML);
                    });
                    break;
                case 'summaries':
                    $.each(data, function (i, item) {
                        var itemHTML, imgURL = base.getImageURL(item);
                        itemHTML = '<' + base.options.elem +
                            ' class="' + base.options.className + '">';
                        itemHTML += '<' + base.options.titleElem +
                            '><a href="' + base.options.baseURL +
                            item.event_id + '">' + item.title + '</a></' +
                            base.options.titleElem + '>';
                        if (imgURL !== "") {
                            itemHTML += '<img src="' + imgURL + '" alt="' +
                                item.title.replace(/(<([^>]+)>)/ig, "") +
                                '" />';
                        }
                        if (item.subtitle !== "") {
                            itemHTML += '<p class="subtitle">' +
                                item.subtitle + '</p>';
                        }
                        itemHTML += '<p class="schedule">' +
                            base.parseSchedule(item.schedule) + '</p>';
                        itemHTML += '<p class="location">' +
                            base.getAddress(item) + '</p>';
                        itemHTML += '<p class="summary">' + item.summary
                            + '</p>';
                        itemHTML += '</' + base.options.elem + '>';
                        events.push(itemHTML);
                    });
                    break;
                case 'detail':
                    imgURL = base.getImageURL(data);
                    titleNoHTML = data.title.replace(/(<([^>]+)>)/ig, "");
                    itemHTML = '<' + base.options.elem +
                        ' class="' + base.options.className + '">';
                    itemHTML += '<' + base.options.titleElem + '>' +
                        data.title +
                        '</' + base.options.titleElem + '>';
                    if (imgURL !== "") {
                        itemHTML += '<img src="' + imgURL +
                            '" alt="' + titleNoHTML + '" />';
                    }
                    if (data.subtitle !== "") {
                        itemHTML += '<p class="subtitle">' +
                            data.subtitle + '</p>';
                    }
                    itemHTML += '<p class="schedule">' +
                        base.parseSchedule(data.schedule) + '</p>';
                    itemHTML += '<p class="location">' +
                        base.getAddress(data) + '</p>';
                    if (data.cost !== "") {
                        itemHTML += '<p class="cost">Cost: ' +
                            data.cost + '</p>';
                    }
                    if (data.ticket_url !== "") {
                        itemHTML += '<p class="tickets"><a href="' +
                            data.ticket_url + '">Get tickets</a></p>';
                    }
                    itemHTML += '<div class="description">' +
                        data.description + '</div>';
                    if (data.contact_email !== "" ||
                            data.contact_phone !== "") {
                        itemHTML += '<p class="contact">Contact: ';
                        if (data.contact_email !== "") {
                            itemHTML += '<a href="mailto:' +
                                data.contact_email + '?subject=Re: ' +
                                titleNoHTML + '">' +
                                data.contact_email + '</a>';
                        }
                        if (data.contact_phone !== "") {
                            if (data.contact_email !== "") {
                                itemHTML += ' or ';
                            }
                            itemHTML += data.contact_phone;
                        }
                        itemHTML += '</p>';
                    }
                    itemHTML += '</' + base.options.elem + '>';
                    events.push(itemHTML);
                    break;
                default:
                    itemHTML = '<p>Error - view type not recognized.</p>';
				} // end switch
							
				// join the contents of the events array together
                // and add to the page
				if (events.length > 0) {
					base.$el.html(events.join(''));
				} else {
					// if no data is returned from the api 
                    // display an error message.
					base.$el.html('Error - no data from API.');
                    if (console !== undefined &&
                            console.log !== undefined) {
                        console.log("Error - no data from API: " +
                                    restURL);
                    }
				}
			});
		};

		base.getUrlVars = function () {
		    var vars = [], hash, hashes, i;
		    hashes = window.location.href.slice(
                window.location.href.indexOf('?') + 1
            ).split('&');
		    for (i = 0; i < hashes.length; i += 1) {
		        hash = hashes[i].split('=');
		        vars.push(hash[0]);
		        vars[hash[0]] = hash[1];
		    }
		    return vars;
		}; // end getUrlVars
				
		base.formatDate = function (str) {
			var dateParts,
                d,
                dstr,
                month = [
                    "January", "February",
                    "March", "April", "May",
                    "June", "July", "August",
                    "September", "October",
                    "November", "December"
                ];
			dateParts = str.split("/");
			d = new Date(dateParts[2],
                dateParts[0] - 1, (dateParts[1]));
			dstr = month[d.getMonth()] + ' ' +
                d.getDate() + ', ' + d.getFullYear();
			return dstr;
		}; // end formatDate
				
		base.formatTime = function (str) {
			var hours, timeParts = str.split(":");
			if (parseFloat(timeParts[0]) === 0) {
				return '12:' + timeParts[1].replace(/^\s\s*/, '')
                    .replace(/\s\s*$/, '') + 'am';
			} else if (parseFloat(timeParts[0]) < 12) {
				return parseFloat(timeParts[0]) +
                    ':' + timeParts[1].replace(/^\s\s*/, '')
                        .replace(/\s\s*$/, '') + 'am';
			} else if (parseFloat(timeParts[0]) === 12) {
				return timeParts.join(":").replace(/^\s\s*/, '')
                    .replace(/\s\s*$/, '') + 'pm';
			} else {
				hours = parseFloat(timeParts[0]) - 12;
				return hours + ':' +
                    timeParts[1].replace(/^\s\s*/, '')
                        .replace(/\s\s*$/, '') + 'pm';
			}
		}; // end formatTime
				
		base.parseSchedule = function (obj) {
			var schedule = '<span class="dates">',
                // format the dates
                scheduleArr = obj.split(": "),
                i = 0,
                datesArr,
                time,
                timeArr;
			if (scheduleArr[0].indexOf("-") !== -1) {
				datesArr = scheduleArr[0].split("-");
				schedule += base.formatDate(datesArr[0]) +
                    ' through ' +
                    base.formatDate(datesArr[1]);
			} else if (scheduleArr[0].indexOf(",") !== -1) {
				datesArr = scheduleArr[0].split(",");
				for (i = 0; i < datesArr.length; i += 1) {
                    if (i !== 0) {
                        schedule += ', ';
                    }
                    schedule += base.formatDate(datesArr[i]);
				}
			} else {
				schedule += base.formatDate(scheduleArr[0]);
			}
			schedule += '</span>';
			// format the times
			time = '';
			if (scheduleArr[1].indexOf("-") !== -1) {
				timeArr = scheduleArr[1].split("-");
				time = base.formatTime(timeArr[0]) +
                    ' to ' +
                    base.formatTime(timeArr[1]);
			} else if (scheduleArr[1].indexOf(":") !== -1) {
				time = base.formatTime(scheduleArr[1]);
			} else {
				time = scheduleArr[1];
			}
			schedule += '<br /><span class="times">' +
                time + '</span>';
			return schedule;
		}; // end parseSchedule
				
		base.getImageURL = function (item) {
			var imgURL = "";
			if (item.attachments !== undefined &&
                    item.attachments[item.calendar_id]
                        !== undefined &&
                    item.attachments[item.calendar_id][base.options.imgSize]
                        !== undefined) {
				imgURL = item.attachments[
                    item.calendar_id
                ][base.options.imgSize].url;
			} else if (item.attachments !== undefined &&
                    item.attachments[item.parent_calendar_id]
                    !== undefined &&
                    item.attachments[
                        item.parent_calendar_id
                    ][base.options.imgSize] !== undefined) {
				imgURL = item.attachments[
                    item.parent_calendar_id
                ][base.options.imgSize].url;
			}
			return imgURL;
		}; // end getImageURL
		
		base.getAddress = function (item) {
            var address;

			if (item.address === "" ||
                    item.address.replace(/^\s\s*/, '')
                    .replace(/\s\s*$/, '') === ",") {
				address = item.campus;
				if (item.venue !== "") {
                    address += '<br />' + item.venue;
                }
				if (item.room !== "") {
                    address += '<br />' + item.room;
                }
			} else {
				address =
                    item.address.replace(/\n\n/g, '\n')
                        .replace(/\n/g, '<br />');
			}
			return address;
		};
		
        // Run initializer
        base.init();
	};
    
	$.uscecal.defaultOptions = {
		view: 'highlights',
		limit: 10,
		startDate: 'now',
		endDate: '+1 month',
		elem: 'div',
		titleElem: 'h3',
		className: 'event',
		baseURL: '/events/',
		dateFormat: false,
		imgSize: 'image',
		categories: false,
		jsonp: true
	};
    
	$.fn.uscecal = function (cal_id, options) {
		return this.each(function () {
			(new $.uscecal(this, cal_id, options));
		});
	};
    
}(jQuery));