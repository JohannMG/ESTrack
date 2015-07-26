/// <reference path="../typings/node/node.d.ts"/>
//date JS
var moment = require('moment'); 

/*-----------------------------
takes no arguments, returns a function with two 
-------------------------------*/
function getYesterdayDateRange( callbackFN ){
	var begin, end; 
	var yesterday = moment(new Date() ).subtract(1, 'days');
	
	begin = moment(yesterday).startOf('day');
	end = moment(yesterday).endOf('day');
	
	begin = moment(begin).toISOString(); 
	end = moment(end).toISOString(); 
	
	callbackFN(begin, end); 
}

