/// <reference path="../typings/node/node.d.ts"/>

//express
var express = require('express');
var app = express(); 
var pg = require('pg');
app.set('port', process.env.PORT || 3000);
app.use(  express.static( __dirname + '/public')  );



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

app.get('/track.*', function (req, res) {
	res.type('text/plain');
	res.status(200);

	var dbURL = process.env.DATABASE_URL || "postgres://localhost:5432/";

	pg.connect(dbURL, function (err, client, done) {
		client.query('SELECT * FROM test_table', function (err, result) {
			done();
			if (err){ 
				console.error(err); 
				res.send("Error: "+ err);
			}
			else{ res.send(result.rows); }
		})
	}) //END pg.connect
	
}); //END GET '/track.*'


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

//listen SERVER
app.listen(app.get('port'), function () {
	console.log('Express started on localhost:' + app.get('port')  );
});