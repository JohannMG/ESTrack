/// <reference path="../typings/node/node.d.ts"/>

var express = require('express');
var app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

//PostGres
var pg = require('pg');
var dbURL = process.env.DATABASE_URL || "postgres://localhost:5432/test_development";
//for later to switch tables with config vars
var usertable  = (process.env.usertests) ?  "test_users" : "test_users" ; 

var record = require('./UserRecord.js');
record.setUp(dbURL , usertable); 

//Testing Middleware
app.use(function (req, res, next) {
	res.locals.showTests = (app.get('env') !== 'production') && (req.query.test === '1');
	next();
});


//----BEGIN ROUTING-----
app.get('/', function (req, res) {
	res.type('text/plain');
	res.status(200);
	console.log(req.query);
	res.send('got that!');

});//END GET '/' 



/*---------------------------------------------------------------------------------------
	MAIN TRACKING PIXEL DOWNLOAD
	
	send GET with query strong containing info on the user
	must have the following params in url or will return HTTP: 400 :(
		location=
		room=
		esid=
	e.g., //[domain].com/tk.gif?location=orlando&room=entrance&esid=1n5g4375g2vby378n5
	
	available locations and rooms kept in ./activations.js
---------------------------------------------------------------------------------------*/
app.get('/tk.*', function (req, res) {
	res.type('text/plain');
	res.status(200);
	
	//To Log, must have all fields. 
	if (typeof req.query.location  !== 'string' || 
		typeof req.query.room  !== 'string' || 
		typeof req.query.esid  !== 'string') 
	{
		res.status(400);
		res.send('must include location, room, and esid');
		return; 
	} //else continue and log info
	
	record.updateRecord(req.query.location, req.query.room, req.query.esid);
	console.log("tag sent. location: " + req.query.location + " Room: " + req.query.room + " ESID: " + req.query.esid ); 

	res.send('');//send nothing back
	
	
});









app.get('/testdb.*', function (req, res) {
	res.type('text/plain');
	res.status(200);
	console.log(req.query);

	pg.connect(dbURL, function (err, client, done) {
		client.query('SELECT * FROM test_table', function (err, result) {
			done();
			if (err) {
				console.error(err);
				res.send("Error: " + err);
			}
			else { res.send(result.rows); }
		});

		if (err) { console.log('connect error to' + dbURL); }
	}); //END pg.connect
	
}); //END GET '/testdb.*'


//404 Page
app.use(function (req, res) {
	res.type('text/plain');
	res.status(404);
	res.send('404 - Not Found');
});

//500 page
app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.type('text/plain');
	res.status(500);
	res.send('500 - internal server error');
});

//---END MAIN ROUTING

//start SERVER
app.listen(app.get('port'), function () {
	console.log('Express started on localhost:' + app.get('port'));
});