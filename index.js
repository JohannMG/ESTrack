var express = require('express');
var app = express();
var path = require('path');
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

//sessions
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var passport = require('passport');  
var passportLocal = require('passport-local');  

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(expressSession(
  { secret: 'this better be edited later',
  saveUninitialized: false,
	resave: false
  }));

app.use(passport.initialize());
app.use(passport.session());
var passportConfig = require('./auth/passport-config'); 
passportConfig();

//PostGres
var pg = require('pg');
var dbURL = process.env.DATABASE_URL || "postgres://localhost:5432/test_development";
var usertable = process.env.USERS_TABLE || "test_users";

var record = require('./lib/UserRecord.js');
record.setUp(dbURL, usertable); 

var appRoutes = require('./routes/management');
var dataRoutes = require('./routes/dataRoutes');

//View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Testing Middleware
app.use(function (req, res, next) {
	res.locals.showTests = (app.get('env') !== 'production') && (req.query.test === '1');
	next();
});


//APP routing
app.use('/app', appRoutes); 
app.use('/data', dataRoutes); 

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
		console.log(req.query);
		res.send('');//send nothing back
	}
	
	else  //incorrect info
	{ 
		res.status(400);
		res.send('must include location, room, and esid');
		return;
	}
	
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



