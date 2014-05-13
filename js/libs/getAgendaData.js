(function (root, factory) { // UMD from https://github.com/umdjs/umd/blob/master/returnExports.js
	if (typeof exports === 'object') {
		module.exports = factory();
	} else if (typeof define === 'function' && define.amd) {
		define(factory);
	} else {
		root.getWorkingDay = factory();
	}
})(this, function () {
	
// Author: Matthew Forrester <matt_at_keyboardwritescode.com>
// Copyright: Matthew Forrester
// License: MIT/BSD-style

"use strict";

var getHourlyData = function(year, month, day, utcStartHours, utcEndHours) {
	
	var curDate = new Date(year, month - 1, day),
		tmpInWorkingDay = false,
		r = []
		;
		
	while (curDate.getDate() == day) {
		tmpInWorkingDay = false;
		if (
			(
				(utcStartHours < utcEndHours) &&
				(curDate.getUTCHours() >= utcStartHours) && 
				(curDate.getUTCHours() < utcEndHours)
			) ||
			(
				(utcStartHours > utcEndHours) &&
				(
					(curDate.getUTCHours() >= utcStartHours) || 
					(curDate.getUTCHours() < utcEndHours)
				)
			)
		) {
			tmpInWorkingDay = true;
		}
		r.push({ date: curDate, inWorkingDay: tmpInWorkingDay });
		curDate = new Date(curDate.getTime() + (30 * 60 * 1000));
	}
	
	return r;
	
};

var prePrepareForDisplay = function(moment, hourlyData) {
	
	var translateHour = function(date) {
		var fmt = ':mm';
		var isHour = false;
		if (date.getMinutes() == 0) {
			fmt = 'LT';
			isHour = true;
		}
		return {
			text: moment(date).format(fmt),
			isHour: isHour
		};
	}
	
	return hourlyData.map(function(dataObj) {
		var dateInfo = translateHour(dataObj.date);
		dateInfo.inWorkingDay = dataObj.inWorkingDay;
		dateInfo.date = dataObj.date;
		return dateInfo;
	});
};

var prepareTableData = function(prePreparedDatas) {
	
	var i, l,
		r = [];
		
	var getLeftRight = function(prePreparedData) {
		var cls = prePreparedData.isHour ? 'hour-start' : 'hour-middle',
			text = prePreparedData.text,
			y = (
					prePreparedData.date.getHours() * 2
				) + (prePreparedData.date.getMinutes() ? 1 : 0),
			workingCss = prePreparedData.inWorkingDay ? 'working' : 'not-working';
		
		return [
			{
				x: 0,
				y: y,
				w: 1,
				h: 1,
				text: text,
				cls: [cls, 'time-side', workingCss],
				date: prePreparedData.date,
				isHour: true
			},
			{
				x: 1,
				y: y,
				w: 1,
				h: 1,
				text: '',
				cls: [cls, 'appointment-side', workingCss],
				date: prePreparedData.date,
				isHour: false
			}
		];
		
	};
	
	
	for (i=0, l = prePreparedDatas.length; i<l; i++) {
		r = r.concat(getLeftRight(prePreparedDatas[i]));
	}
	
	return r;
	
};

return {
	getHourlyData: getHourlyData,
	prePrepareForDisplay: prePrepareForDisplay,
	prepareTableData: prepareTableData
}

});
