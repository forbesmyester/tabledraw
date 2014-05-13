var getDatesForDrawingANMonthCalendar = require('../../js/libs/getDatesForDrawingANMonthCalendar.js'),
	expect = require('expect.js');

describe('getDatesForDrawingANMonthCalendar...',function() {
	
	it('can draw a calendar for 2 months from day one',function() {
		
		var dates = getDatesForDrawingANMonthCalendar(
			new Date(2013,8,5),
			2,
			false
		);
		expect(dates.length).to.equal(61);
		expect(dates[0].getDate()).to.equal(1);
		expect(dates[0].getMonth()).to.equal(8);
		expect(dates[0].getFullYear()).to.equal(2013);
		expect(dates[60].getDate()).to.equal(31);
		expect(dates[60].getMonth()).to.equal(9);
		expect(dates[60].getFullYear()).to.equal(2013);
		
	});
	
	it('can draw a calendar for 4 months from day one if less than fromNowIfStartDomGreaterThan',function() {
		
		var dates = getDatesForDrawingANMonthCalendar(
			new Date(2013,8,15),
			4,
			20
		);
		expect(dates.length).to.equal(122);
		expect(dates[0].getDate()).to.equal(1);
		expect(dates[0].getMonth()).to.equal(8);
		expect(dates[0].getFullYear()).to.equal(2013);
		expect(dates[60].getDate()).to.equal(31);
		expect(dates[60].getMonth()).to.equal(9);
		expect(dates[60].getFullYear()).to.equal(2013);
		expect(dates[121].getDate()).to.equal(31);
		expect(dates[121].getMonth()).to.equal(11);
		expect(dates[121].getFullYear()).to.equal(2013);
		
	});
	
	it('will draw a calendar for 3.5 months from day fifteen if greater than fromNowIfStartDomGreaterThan with a 3 month span',function() {
		
		var dates = getDatesForDrawingANMonthCalendar(
			new Date(2013,8,15),
			3,
			10
		);
		
		expect(dates.length).to.equal(108);
		expect(dates[0].getDate()).to.equal(15);
		expect(dates[0].getMonth()).to.equal(8);
		expect(dates[0].getFullYear()).to.equal(2013);
		expect(dates[107].getDate()).to.equal(31);
		expect(dates[107].getMonth()).to.equal(11);
		expect(dates[107].getFullYear()).to.equal(2013);
		
	});
	
});


