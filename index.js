/// <reference path="../typings/node/node.d.ts"/>

//express
var express = require('express');
var app = express(); 
var pg = require('pg');
app.set('port', process.env.PORT || 3000);
app.use(  express.static( __dirname + '/public')  );

var dbURL = process.env.DATABASE_URL || "postgres://localhost:5432/";

 //for later to switch tables with config vars
var usertable = "test_users";
if (process.env.usertests === true ) {usertable = "test_users";}

var ESID_CACHE; 

//Testing Middleware
app.use(function(req, res, next){
	res.locals.showTests = (app.get('env')  !== 'production') && (req.query.test ==='1') ; 
	next();
});


//----BEGIN ROUTING-----
app.get('/', function (req, res) {
	res.type('text/plain');
	res.status(200);
	console.log(req.query);
	res.send('got that!');
	
});//END GET '/' 

app.get('/testdb.*', function (req, res) {
	res.type('text/plain');
	res.status(200);
	console.log(req.query);

	pg.connect(dbURL, function (err, client, done) {
		client.query('SELECT * FROM test_users', function (err, result) {
			done();
			if (err){ 
				console.error(err); 
				res.send("Error: "+ err);
			}
			else{ res.send(result.rows); }
		});
	}); //END pg.connect
	
}); //END GET '/testdb.*'


app.get('/tk.*', function (req,res) {
	res.type('text/plain');
	res.status(200);
	var data_in = req.query; 
	
	if ( typeof data_in.esid == 'undefined' || typeof data_in.activation == 'undefined' ){ 
		console.log('No missing ESID or activation send in req.'); 
		res.send(''); 
		return;
	}
	
	if (ESID[ data_in.esid ]){
		//update existing DB record
		pg.connect(dbURL, function (err, client, done) {
			client.query('INSERT', function (err, result) {
				
			});
		});
		
	}
	else{
		 //check if in DB
		 
		//create DB record. Add room if there.
		pg.connect(dbURL, function (err, client, done) {
			client.query('INSERT', function (err, result) {
				done();
				if (err) {
					
				}else {}
				
			}); 
		});
		
	}
	
	
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
	console.log('Express started on localhost:' + app.get('port')  );
});