//handlebars
var handlebars = require('handlebars');
var fs = require('fs');
var pg = require('pg');
var fails = require('./lib/FailSilent'); 
var dates = require('./GetDates.js'); 
var REPORT_LOCATIONS = ['orlando']; 

var dbTable =  process.env.usertable || "test_users";
var dbURL = process.env.DATABASE_URL || "postgres://localhost:5432/test_development";


//DATA TO MERGE INTO EMAIL
var emailData = {
	thing: "THIS THING!!",
	
	locations : [ 
		{
			location: "Orlando",
			visits: 38129,
			room: [
				{name: "Frontpage", hits: 2000},
				{name: "page1", hits: 1000}
			]
			
		},
	],
	
	date: "",
};
var emailTemplate; 
var html;

fs.readFile('./views/dailyEmail.handlebars', 'utf-8', function(err, source){
	
	emailTemplate = handlebars.compile(source);
	html = emailTemplate(emailData);
	sendEmail(); 
}); 


/*------------------------------
gets and loads locations data into the emailData object
------------------------------*/

function getData(location){
	//get date ranges
	var beginOfYesterday, endOfYesterday; 
	dates.getYesterdayDateRange(function(b,e){
		beginOfYesterday = b; 
		endOfYesterday = e;
	});
	
	//1: Count all rows of users incoming. If <0 terminate report, send simple email
	// var countString = "SELECT (esid) FROM "+ dbTable +" WHERE firstping >= '" + beginOfYesterday+ "' AND firstping <= '"+ endOfYesterday +"' AND location = '" + location + "' ORDER BY firstping ASC;"
	
	// function getTotal Users(params) {
	// 	var t = 5; 
	// }
	
	function checkUserInTable(_esid, _location, _room, client){
		var selectstring = "SELECT * FROM " + dbTable + " WHERE esid=$1";
		client.query(selectstring, [_esid],
			function selectUserCallback (err, result) {
				if (err) { console.log('trouble w check user in table '); console.error(err); }
		
				if (result && result.rows.length > 0) {
					ESID_CACHE[_esid] = Date.now();
					updateExsitingUser(_location, _room, _esid);
					return true;
				}
		});
		return false; 
	}
	
}




function sendEmail() {
	console.log(html); 
}


//console.log(temp.render( 'dailyEmail', {thing: "yes"}  )); 



