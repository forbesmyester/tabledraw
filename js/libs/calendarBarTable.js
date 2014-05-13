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

var structureifyCalData = function(moment, calData) {

	var r = {},
		l,
		monthName;
		
	for (var i=0, l=calData.length; i<l; i++) {
		monthName = moment(calData[i]).format('MMMM');
		if (!r.hasOwnProperty(monthName)) {
			r[monthName] = [];
		}
		r[monthName].push(calData[i].getDate());
	}
	
	return r;
	
};

var drawCalendar = function(table, structCalData) {
		
	var k,
		l,
		i,
		calendarMonthPos = 0;

	for (k in structCalData) {
		if (structCalData.hasOwnProperty(k)) {
			table.getCell(
				calendarMonthPos,
				0,
				structCalData[k].length,
				1,
				1
			).text(k);
			for (i=0, l=structCalData[k].length; i<l; i++) {
				table.getCell(calendarMonthPos + i, 1, 1, 1).text(structCalData[k][i]);
			}
			calendarMonthPos = calendarMonthPos + structCalData[k].length;
		}
	}

};

return {
	structureifyCalData: structureifyCalData,
	drawCalendar: drawCalendar
};

});
