//handlebars
var handlebars = require('handlebars');
var fs = require('fs');
var pg = require('pg');

var dbTable =  process.env.usertable || "test_users";
var dbURL = process.env.DATABASE_URL || "postgres://localhost:5432/test_development";



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
		{
			location: "MB",
			visits: 57823,
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



function getData(){
	
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



