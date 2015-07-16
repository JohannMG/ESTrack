//handlebars
var handlebars = require('handlebars');
var fs = require('fs');

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

function sendEmail() {
	console.log(html); 
}


//console.log(temp.render( 'dailyEmail', {thing: "yes"}  )); 



