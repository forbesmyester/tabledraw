(function (root, factory) { // UMD from https://github.com/umdjs/umd/blob/master/returnExports.js
	if (typeof exports === 'object') {
		module.exports = factory();
	} else if (typeof define === 'function' && define.amd) {
		define(factory);
	} else {
		root.getDatesForDrawingANMonthCalendar = factory();
	}
})(this, function () {
	
// Author: Matthew Forrester <matt_at_keyboardwritescode.com>
// Copyright: Matthew Forrester
// License: MIT/BSD-style

"use strict";

return function(startDate, numFullMonths, fromNowIfStartDomGreaterThan) {
	
	var r = [];
	var refDate = startDate;
	
	var day = 1;
	if (
		(fromNowIfStartDomGreaterThan) &&
		(startDate.getDate() > fromNowIfStartDomGreaterThan)
	) {
		day = startDate.getDate();
		numFullMonths = numFullMonths + 1;
	}
	
	var targetDate = new Date(
		refDate.getFullYear(),
		refDate.getMonth() + numFullMonths,
		1,
		4
	);
	
	var getDateAtDayAndHour = function(day) {
		return new Date(
			refDate.getFullYear(),
			refDate.getMonth(),
			day,
			12
		);
	}
	
	var curDate = getDateAtDayAndHour(day);
	
	while (curDate.getTime() < targetDate.getTime()) {
		r.push(curDate);
		curDate = getDateAtDayAndHour(++day);
	}
	
	return r;

};

});
