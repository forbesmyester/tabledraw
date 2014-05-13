var calendarBarTable = require('../../js/libs/calendarBarTable.js'),
	expect = require('expect.js');

describe('calendarBarTable....',function() {
	
	
	it('can draw a calendar for 2 months from day one',function() {
		
		var dates = [
			new Date(2013,8,15),
			new Date(2013,8,16),
			new Date(2013,8,17),
			new Date(2013,9,3),
			new Date(2013,9,5),
			new Date(2013,10,7),
			new Date(2013,11,12)
		];
		
		var momentMock = function(date) {
		
			return { format: function(format) {
				
				if (format !== 'MMMM') {
					throw "Expecting MMMM";
				}
				
				var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Octob', 'Nov', 'Dec'];
				
				return monthNames[date.getMonth()];
				
			} };
			
		};
		
		var expected = {
			Sep: [ 15, 16, 17 ],
			Octob: [ 3, 5 ],
			Nov: [ 7 ],
			Dec: [ 12 ]
		};
		
		expect(
			calendarBarTable.structureifyCalData(momentMock, dates)
		).to.eql(expected);
		
	});
	
});
