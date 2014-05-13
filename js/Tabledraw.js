(function (root, factory) { // UMD from https://github.com/umdjs/umd/blob/master/returnExports.js
	if (typeof exports === 'object') {
		module.exports = factory(
			require('Tabledata')
		);
	} else if (typeof define === 'function' && define.amd) {
		define([
				'Tabledata'
			],
			factory
		);
	} else {
		root.Tabledraw = factory(root.Tabledata);
	}
})(this, function (Tabledata) {
	
// Author: Matthew Forrester <matt_at_keyboardwritescode.com>
// Copyright: Matthew Forrester
// License: MIT/BSD-style

var Tabledraw = function(options) {
	this._tabledata = new Tabledata(1, 1, options);
	this._classPrepend = 'tabledraw';
	this._boundTo = false;
	this._returnJqCell = false;
	
	if (options && options.hasOwnProperty('classPrepend')) {
		this._classPrepend = options.classPrepend;
	}
	
	if (options && options.hasOwnProperty('returnJqCell')) {
		this._returnJqCell = options.returnJqCell;
	}
	
	if (
		options &&
		options.hasOwnProperty('boundTo') && 
		options.hasOwnProperty('jq')
	) {
		this._boundTo = options.boundTo;
		this._jq = options.jq;
		
		this._jq(this._boundTo).html(
			'<tr class="' + this._classPrepend + '-0 even">' +
			this._getHtmlForCell(0, 0, 1, 1, 2) +
			'</tr>'
		);
		
		this._tabledata.on('filled-in', this._addCell.bind(this));
		this._tabledata.on('added', this._addCell.bind(this));
		this._tabledata.on('removed', this._removeCell.bind(this));
		
	}
};

Tabledraw.prototype._removeCell = function(rectData) {
	
	// console.log("REM: ", rectData);
	
	var jElement = this._jq(this._boundTo).find(
			"." + this._getClassForCell(
				rectData.x,
				rectData.y,
				rectData.w,
				rectData.h
			)
		),
		jParent = $(jElement).parent();
	
	if (jParent.children().length < 2) {
		jParent.remove();
		return;
	}
	jElement.remove();
	
};

Tabledraw.prototype._addCell = function(rectData) {
			
	// console.log("ADD: ", rectData);
	
	// These never change
	var cellHtml = this._getHtmlForCell(
			rectData.x,
			rectData.y,
			rectData.w,
			rectData.h,
			rectData.t
		),
		rowSelector = 'tr.' + this._classPrepend + '-' + rectData.y,
		rowCells = this._jq(this._boundTo).find(rowSelector).children();
	
	// Working variables
	var before = -1;
	
	var getBefore = function(classPrepend, rowCells, row, x) {
		
		var classes,
			regExp,
			reMatches,
			r = null,
			b = -1,
			i,
			j,
			l;
		
		for (i=0, l=rowCells.length; i<l; i++) {
			classes = this._jq(rowCells.get(i)).attr('class').split(' ');
			for (j = 0; j < classes.length; j++) {
				regExp = new RegExp(classPrepend + '\-([0-9]+)');
				if (
					(reMatches = regExp.exec(classes[j])) &&
					(parseInt(reMatches[1], 10) > x) &&
					(
						(b === -1) ||
						(parseInt(reMatches[1], 10) < b)
					)
				)
				{
					b = parseInt(reMatches[1], 10);
					r = classes[j];
				}
			}
		}
		
		return r;
		
	}.bind(this);
	
	if (!this._jq(this._boundTo).find(rowSelector).length) {
		this._jq(this._boundTo).append(
			'<tr class="' +
				this._classPrepend + '-' + rectData.y + 
				((rectData.y % 2) ? ' z even' : ' z odd') + 
				'">' +
				'</tr>'
		);
	}
	tablerow = this._jq(this._boundTo).find(
		'.' + this._classPrepend + '-' + rectData.y
	);
	
	before = getBefore(
		this._classPrepend,
		rowCells,
		rectData.y,
		rectData.x
	);
	
	if (before === null) {
		return this._jq(tablerow).append(cellHtml);
	}
	
	this._jq(tablerow).find("." + before).before(cellHtml);
	
};

Tabledraw.prototype._getClassForCell = function(x, y, w, h) {
	return [this._classPrepend, x, y, w, h].join('-');
};

Tabledraw.prototype.getCell = function(x, y, w, h, t) {

	var cell;
	
	this._tabledata.addRectangle(x, y, w, h, t);
	if (this._boundTo !== false) {
		cell = this._jq(
			this._boundTo + ' .' + this._getClassForCell(x, y, w, h)
		);
		return this._returnJqCell ? cell : cell.get(0);
	}
	return this._getClassForCell(x, y, w, h);
};

Tabledraw.prototype._rectanglesSort = function(a, b) {
	if (a.y < b.y) { return -1; }
	if (a.y > b.y) { return 1; }
	if (a.x < b.x) { return -1; }
	if (a.x > b.x) { return 1; }
	return 0;
};

Tabledraw.prototype._getHtmlForCell = function(x, y, w, h, t) {
	return ((t == 1) ? '<th' : '<td') +
		(w > 1 ? ' colspan="' + w +'"' : '') +
		(h > 1 ? ' rowspan="' + h +'"' : '') +
		' class="' +
		this._getClassForCell(x, y, w, h) +
		(t == 2 ? ' ' + this._classPrepend + '-not-requested' : '') +
		'"' +
		'>';
};

Tabledraw.prototype.getHtml = function() {
	
	var rectangles = this._tabledata.getData(),
		currentRow = rectangles[0].y,
		html = ['<tr>'],
		i,
		l;
	
	rectangles.sort(this._rectanglesSort);
	
	for (i = 0, l = rectangles.length; i < l; i++) {
		if (rectangles[i].y != currentRow) {
			html.push('</tr><tr>');
			currentRow = rectangles[i].y;
		}
		html.push(this._getHtmlForCell(
			rectangles[i].x,
			rectangles[i].y,
			rectangles[i].w,
			rectangles[i].h,
			rectangles[i].t
		));
	}
	html.push('</tr>');
	
	return html.join('');
};

return Tabledraw;

var _oldEmit = function(event, rectData) {
	
    console.log(event,rectData);
    
	if (event == 'removed') { 
		return;
    }
	
	rectDemo.append("svg:rect")
		.attr("x", xScale(rectData.x))
		.attr("y", yScale(rectData.y))
		.attr("width", xScale(rectData.w))
		.attr("height", yScale(rectData.h))
		.attr('stroke', 'red')
		.attr('fill', (function(th) {
			if (th === 0) { return 'blue'; }
				if (th === 1) { return 'red'; }
				return 'grey';
		}(rectData.t)))
		.attr('id','behind');
};


});
