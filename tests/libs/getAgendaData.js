var getAgendaData = require('../../js/libs/getAgendaData.js'),
	expect = require('expect.js');

describe('getHourlyData...',function() {
	
	it('With no offset',function() {
		
		var workingDayData = getAgendaData.getHourlyData(
			2013, 10, 24, 10, 21
		);
		
		var mapWorkingDayData = function(dateInfo) {
			
			var i = 0,
				r = {};
			
			for (i = 0; i<dateInfo.length; i++) {
				k = dateInfo[i].date.getHours() * 2;
				if (dateInfo[i].date.getMinutes() != 0) {
					k = k + 1;
				}
				r[k] = dateInfo[i].inWorkingDay;
			}
			
			return r;
			
		};
		
		var totalHoursWorked = function(dateInfo) {
			var r = 0;
			for (var i=0; i<dateInfo.length; i++) {
				if (dateInfo[i].inWorkingDay) {
					r = r + 0.5;
				}
			}
			return r;
		};
		
		var expectedResult = { '0': false, '1': false, '2': false, '3': false, '4': false, '5': false, '6': false, '7': false, '8': false, '9': false, '10': false, '11': false, '12': false, '13': false, '14': false, '15': false, '16': false, '17': false, '18': false, '19': false, '20': false, '21': false, '22': true, '23': true, '24': true, '25': true, '26': true, '27': true, '28': true, '29': true, '30': true, '31': true, '32': true, '33': true, '34': true, '35': true, '36': true, '37': true, '38': true, '39': true, '40': true, '41': true, '42': true, '43': true, '44': false, '45': false, '46': false, '47': false }; // Start at 11am (10amUTC) till 10pm (9pmUTC)
		
		expect(mapWorkingDayData(workingDayData)).to.eql(expectedResult);
		expect(totalHoursWorked(workingDayData)).to.eql(11);
		
		var nightWorkingDayData = getAgendaData.getHourlyData(
			2013, 10, 24, 21, 2
		);
		
		var nightExpectedResult = { '0': true, '1': true, '2': true, '3': true, '4': true, '5': true, '6': false, '7': false, '8': false, '9': false, '10': false, '11': false, '12': false, '13': false, '14': false, '15': false, '16': false, '17': false, '18': false, '19': false, '20': false, '21': false, '22': false, '23': false, '24': false, '25': false, '26': false, '27': false, '28': false, '29': false, '30': false, '31': false, '32': false, '33': false, '34': false, '35': false, '36': false, '37': false, '38': false, '39': false, '40': false, '41': false, '42': false, '43': false, '44': true, '45': true, '46': true, '47': true }; // 10pm (9pmUTC) till 3am (2amUTC)
		
		expect(
			mapWorkingDayData(nightWorkingDayData)
		).to.eql(nightExpectedResult);
		expect(totalHoursWorked(nightWorkingDayData)).to.eql(5);
		
	});
	
	it('Makes a sensible pre structure', function() {
		
		var momentMock = function(date) {
		
			return { format: function(format) {
				
				if (format === 'lt') {
					if (date.getHours() == 0) { return '12am' }
					if (date.getHours() < 13) { return date.getHours() + 'am' }
					return date.getHours()-12 + 'pm';
				}
				if (format === ':mm') {
					if (date.getHours() < 12) {
						return ':' + date.getMinutes();
					}
					if (date.getHours() == 12) {
						return ':' + date.getMinutes()
					};
					return ':' + date.getMinutes();
				}
				
				throw "Expecting ha or h:mm";
				
			} };
			
		};
		
		var preStruct = getAgendaData.prePrepareForDisplay(
			momentMock,
			getAgendaData.getHourlyData(2013, 10, 24, 10, 21)
		);
		
	});
	
	it('Can build data for table',function() {
	
		var momentMock = function(date) {
		
			return { format: function(format) {
				
				if (format === 'lt') {
					if (date.getHours() == 0) { return '12am' }
					if (date.getHours() < 13) { return date.getHours() + 'am' }
					return date.getHours()-12 + 'pm';
				}
				if (format === ':mm') {
					if (date.getHours() < 12) {
						return ':' + date.getMinutes();
					}
					if (date.getHours() == 12) {
						return ':' + date.getMinutes()
					};
					return ':' + date.getMinutes();
				}
				
				throw "Expecting ha or h:mm";
				
			} };
			
		};
		
		var preStruct = getAgendaData.prePrepareForDisplay(
			momentMock,
			getAgendaData.getHourlyData(2013, 10, 24, 10, 21)
		);
	
		var tableStruct = getAgendaData.prepareTableData(preStruct);
		
		console.log(tableStruct);
	});
	
});


