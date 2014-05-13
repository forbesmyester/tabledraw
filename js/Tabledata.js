(function (root, factory) { // UMD from https://github.com/umdjs/umd/blob/master/returnExports.js
	if (typeof exports === 'object') {
		module.exports = factory(
			require('./libs/addEvents.js')
		);
	} else if (typeof define === 'function' && define.amd) {
		define([
				'libs/addEvents'
			],
			factory
		);
	} else {
		root.Tabledata = factory(root.addEvents);
	}
})(this, function (addEvents) {
	
// Author: Matthew Forrester <matt_at_keyboardwritescode.com>
// Copyright: Matthew Forrester
// License: MIT/BSD-style

"use strict";

var conflictedBoxes = function(boxA, boxB) {
	if (
		((boxA.x < boxB.x + boxB.w) && (boxA.x + boxA.w > boxB.x)) && 
		((boxA.y < boxB.y + boxB.h) && (boxA.y + boxA.h > boxB.y))
	) {
		return true;
	}
	return false;
};

var notEncasedIn = function(keepRect, removedRect) {
	var r = [],
		left,
		width,
		top,
		height;
	
	if (removedRect.y < keepRect.y) {
		r.push({
			x: removedRect.x,
			y: removedRect.y,
			w: removedRect.w,
			h: keepRect.y - removedRect.y,
			t: 2
		});
	}
	
	if (removedRect.y + removedRect.h > keepRect.y + keepRect.h) {
		r.push({
			x: removedRect.x,
			y: keepRect.y + keepRect.h,
			w: removedRect.w,
			h: (removedRect.y + removedRect.h) - (keepRect.y + keepRect.h),
			t: 2
		});
	}
	
	top = Math.max(keepRect.y, removedRect.y);
	height = Math.min(
		keepRect.y+keepRect.h,
		removedRect.y+removedRect.h
	) - top;
		
	if (height < 0) { return r; }
	
	if (removedRect.x + removedRect.w > keepRect.x + keepRect.w) {
		left = keepRect.x + keepRect.w;
		width = removedRect.x + removedRect.w - left;
		r.push({x: left, y: top, w: width, h: height, t: 2});
	}
	
	if (removedRect.x < keepRect.x) {
		r.push({
			x: removedRect.x,
			y: top,
			w: keepRect.x - removedRect.x,
			h: height,
			t: 2
		});
	}
	
	return r;
};

var Tabledata = function(width, height, options) {
	
    this._rectangles = [];
    this._dimensions = [1,1];
	this.addRectangle(0,0,1,1,2);
	
	this._clone = function(src) {
		return JSON.parse(JSON.stringify(src));
	};
	if (options && options.hasOwnProperty('cloneFunc')) {
		this._clone = options.cloneFunc;
	}
	
};

Tabledata.prototype._resize = function(rect) {
	
	var resizeDim = function(isVertical, amount) {
		var rect = {t: 2};
		rect[isVertical ? 'x' : 'y'] = 0;
		rect[isVertical ? 'y' : 'x'] = this._dimensions[isVertical ? 1 : 0];
		rect.w = isVertical ? this._dimensions[0] : (amount - this._dimensions[0]);
		rect.h = isVertical ? (amount - this._dimensions[1]) : this._dimensions[1];
		this._dimensions[isVertical ? 1 : 0] = amount;
		this._add(rect);
	}.bind(this);
	
	var resized = [];
	
	if (rect.x+rect.w > this._dimensions[0]) {
		resizeDim(false, rect.x+rect.w);
		resized.push(false);
	}
	
	if (rect.y+rect.h > this._dimensions[1]) {
		resizeDim(true, rect.y+rect.h);
		resized.push(true);
	}

};

Tabledata.prototype._add = function(newRect) {
  
	var existingLength = this._rectangles.length,
		toAdd = [],
		removed = [],
		i;
	
	for (i=existingLength-1; i>=0; i--) {
		if (conflictedBoxes(this._rectangles[i],newRect)) {
			removed.push(this._rectangles[i]);
			toAdd = toAdd.concat(notEncasedIn(newRect,this._rectangles[i]));
			this._rectangles.splice(i,1);
		}
	}
	
	for (i=0; i<removed.length; i++) {
		this._emit('removed',{
			x: removed[i].x,
			y: removed[i].y,
			w: removed[i].w,
			h: removed[i].h,
			t: removed[i].t
		});
	}
	
	for (i=0; i<toAdd.length; i++) {
		this._rectangles.push(toAdd[i]);
		this._emit('filled-in', {
			x: toAdd[i].x,
			y: toAdd[i].y,
			w: toAdd[i].w,
			h: toAdd[i].h,
			t: toAdd[i].t
		});
	}
	this._emit('added', newRect);
	this._rectangles.push(newRect);

};

Tabledata.prototype.addRectangle = function(x, y, w, h, th) {
	
	var rect = {x: x, y: y, w: w, h: h, t: (th === undefined ? 0 : th)};
	this._resize(rect);
	this._add(rect);
	
};

Tabledata.prototype.getData = function(cloneFunc) {
	return this._clone(this._rectangles)
};

addEvents(Tabledata, ['filled-in', 'added', 'removed']);

return Tabledata;

});
