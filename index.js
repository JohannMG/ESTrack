
var express = require('express');
var app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

//PostGres
var pg = require('pg');
var dbURL = process.env.DATABASE_URL || "postgres://localhost:5432/test_development";
var usertable = (process.env.usertests) ? process.env.users_table || "test_users" : "test_users";

var record = require('./lib/UserRecord.js');
record.setUp(dbURL, usertable); 

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
	res.send("I'm up! What's up?");

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
	
	//console.log(res.query);
	
	//To Log, must have all fields. 
	if (typeof req.query.location !== 'undefined' ||
		typeof req.query.room !== 'undefined' ||
		typeof req.query.esid !== 'undefined' ) 
	{
		record.updateRecord(req.query.location, req.query.room, req.query.esid);
		//console.log("tag sent. location: " + req.query.location + " Room: " + req.query.room + " ESID: " + req.query.esid);
	}
	
	else  //incorrect info
	{ 
		res.status(400);
		res.send('must include location, room, and esid');
		return;
	}
	record.printCacheCount();
	
	res.send('');//send nothing back
	
});

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


/*------------------------------ROUTING FOR TESTS-----------------------------
//copy above 404 to use

app.get('/testdb.*', function (req, res) {
	res.type('application/json');
	res.status(200);
	console.log(req.query);

	pg.connect(dbURL, function (err, client, done) {
		client.query('SELECT * FROM test_users', function (err, result) {
			done();
			if (err) {
				console.error(err);
				res.send("Error: " + err);
			}
			else { res.send(result.rows[0]); }
		});

		if (err) { console.log('connect error to' + dbURL); }
	}); //END pg.connect
	
}); //END GET '/testdb.*'

app.get('/readb', function (req, res) {
	var testy = require('./testpq.js');
	var info;
	testy.getAll(dbURL, function (rows) {
		console.log(rows);
	});
	res.type('application/json');
	res.send(info);

});

app.get('/testact', function (req, res) {
	var actoo = require('./activations.js');
	var locCol;
	actoo.getColumn("orlando", "landing_page", function (found, loc, col) {
		if (found) {
			locCol = [loc, col];
		}
	});
	console.log(locCol);
	res.type('application/json');
	res.send(locCol);

});

app.get('/testESID', function (req, res) {
	var recked = require('./UserRecord.js');
	var ngx = req.query.esid;
	var location = req.query.location; 
	var room = req.query.room;

	recked.setUp(dbURL, usertable);
	recked.updateRecord(location, room, ngx);

	res.type('application/json');
	res.send('done');

});

//------------------------END ROUTING FOR TESTS-----------------------------*/


