require.config({
	baseUrl: 'js',
	paths: {
		"use": "vendor-bower/use.js/use",
		"moment": "vendor-bower/momentjs/moment"
	},
	use: {
		"js/vendor/zeptojs.com/zepto.js": {
			attach: function() { return $; }
		}
	}
});

define(
	['Tabledraw','use!js/vendor/zeptojs.com/zepto.js', "moment", 'libs/getDatesForDrawingANMonthCalendar', 'libs/calendarBarTable', 'libs/getAgendaData'],
	function(Tabledraw, zepto, moment, getDatesForDrawingANMonthCalendar, calendarBarTable, getAgendaData)
{

var dayselectorTableTbody = new Tabledraw({
	boundTo: '#dayselector-table-tbody',
	jq: zepto,
	returnJqCell: true
});

calendarBarTable.drawCalendar(
	dayselectorTableTbody,
	calendarBarTable.structureifyCalData(
		moment,
		getDatesForDrawingANMonthCalendar(new Date(), 1, 20)
	)
);

var agendaTableTbody = new Tabledraw({
	boundTo: '#agenda-table-tbody',
	jq: zepto,
	returnJqCell: true
});

var agendaTableData = getAgendaData.prepareTableData(
	getAgendaData.prePrepareForDisplay(
		moment,
		getAgendaData.getHourlyData(2013, 10, 24, 10, 21)
	)
);

var i, l;

for (i=0, l=agendaTableData.length; i<l; i++) {
	var cell = agendaTableTbody.getCell(
		agendaTableData[i].x,
		agendaTableData[i].y,
		agendaTableData[i].w,
		agendaTableData[i].h,
		agendaTableData[i].x == 0 ? 0 : 1
	);
	cell.text(agendaTableData[i].text).addClass(agendaTableData[i].cls.join(' '));
}


});
