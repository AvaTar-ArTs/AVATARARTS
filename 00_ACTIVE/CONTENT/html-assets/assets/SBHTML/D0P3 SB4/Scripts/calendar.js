function my_cal()
{
if (Lang == "ca"){
var days_sett = new Array('d','l','m','m','j','v','s','d');
}
if (Lang == "en"){
var days_sett = new Array('s','m','t','w','t','f','s','s');
}
if (Lang == "fr"){
var days_sett = new Array('d','l','m','m','j','v','s','d');
}
if (Lang == "de"){
var days_sett = new Array('s','m','d','m','d','f','s','s');
}

var month_year = new Array('January','Feburary','March','April','May','June','July','August','September','October','November','December');
var days_month = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
var Calendar = new Date();
var Clock = new Date();
var year = Calendar.getFullYear();	//year
var month = Calendar.getMonth();		//month (by 0 to 11)
var today = Calendar.getDate(); 	//numero day (by 1 to 31)
var day = Calendar.getDay();		//day settimana (by 0 to 6)
var time_clock = Clock.getHours();
var time_minute = Clock.getMinutes();
var time_second = Clock.getSeconds();
var num_days = 7;
var day;
var cal;
var clock = time_clock;
var PM_AM = 'AM';

cal =  '<TABLE CELLPADDING="0" CELLSPACING="0" BORDER="0"><TR>';

if(time_clock > 12)
	clock = time_clock-12;
else if(time_clock <= 0)
	clock = time_clock+12;

if(clock < 10 & time_minute < 10)
	cal += '<TD ROWSPAN="3" CLASS="clock">0' + clock + ':0' + time_minute + '</TD>';
else if(clock > 9 & time_minute < 10)
	cal += '<TD ROWSPAN="3" CLASS="clock">' + clock + ':0' + time_minute + '</TD>';
else if(clock < 10 & time_minute > 9)
	cal += '<TD ROWSPAN="3" CLASS="clock">0' + clock + ':' + time_minute + '</TD>';
else if(clock > 9 & time_minute > 9)
	cal += '<TD ROWSPAN="3" CLASS="clock">' + clock + ':' + time_minute + '</TD>';

if(time_clock > 11)
	PM_AM = 'PM';

if(time_second < 10)
	cal += '<TD ROWSPAN="3" CLASS="second">:0' + time_second + '<br />' + PM_AM + '</TD>';
else
	cal += '<TD ROWSPAN="3" CLASS="second">:' + time_second + '<br />' + PM_AM + '</TD>';
cal += '</TR><TR><TD CLASS="month">' + month_year[month] + '</TD></TR><TR><TD CLASS="year">' + year + '</TD></TR></TABLE>';
cal +=	'<TABLE CELLPADDING="0" CELLSPACING="0" BORDER="0"><TR>';

var day = day;
for(index=0; index < num_days; index++) {
	if (day == index)
		cal += '<TD CLASS="days_s">' + days_sett[index] + '</TD>';
	else
		cal += '<TD CLASS="days">' + days_sett[index] + '</TD>';
}

cal += '</TR><TR>';
for(index=0; index < num_days; index++) {
		var yesterday_tomorrow = today - (day-index);
		var this_month = days_month[month];
	if (day == index)
		cal += '<TD CLASS="numbers_days_s">' + today + '</TD>';
	else if (yesterday_tomorrow < this_month+1 & yesterday_tomorrow > 0)
		cal += '<TD CLASS="numbers_days">' + yesterday_tomorrow + '</TD>';
	else
		cal += '<TD CLASS="numbers_days"></TD>';
}

cal += '</TR></TABLE>';
document.getElementById("week").innerHTML = cal;
setTimeout("my_cal()",1000);
}

function init(){
my_cal();
}