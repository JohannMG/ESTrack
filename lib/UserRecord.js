var ESID_CACHE = {}; //notes below with cleanESID_CACHE() on proper use
var dbTable;
var dbURL;
var initiated = false;
var MAX_CACHE_TIME = 2 * 60 * 60* 1000; // 2 hours in milliseconds (h*min*sec*ms)
var CACHE_CLEAR_INTERVAL = 30 * 60 * 1000 ; // 30 minutes (mins*sec*ms) 
var cleanESIDs; //interval task


var pg = require('pg');
var activations = require('./lib/activations.js');

function setUp(db, table) {
	dbTable = table;
	dbURL = db;
	initiated = true;
	cleanESIDs = setInterval( cleanESID_CACHE , CACHE_CLEAR_INTERVAL );
}



/*---------------------------------------------------------------------------------------
	Method accessible from the module exports
	send: (location, room, esid)
	location = Geographic Location e.g., orlando, baltimore
	room = activation inside the webapp/physical attraction
	esid = ngx cookie/ uniqie user ID from the
	
	this funciton uses updateExsitingUser() to the record activation. 
	
	checks if user in chache, it means they are in DB —> sent to update fn
	if not in cache checks in DB
		user exists in DB —> update cache -> set to update fn
		user does not exists -> insert into DB & add to cache —> send to update fn   
	
	returns nothing 
---------------------------------------------------------------------------------------*/
function updateRecord(_location, _room, _esid) {
	
	var validESID = false; 
	if (typeof _esid === 'string') { validESID = true; }
	
	var userExists = (typeof ESID_CACHE[_esid] !== 'undefined'); //is user in chache?
	
	//if user does not esxist in chache, check database
	if (!userExists && validESID) {
		
		pg.connect(dbURL, function (err, client, done) {
			if (err) {console.log(err);}
			else {
				//check if user in DB
				//blocking code
				userExists =  checkUserInTable(_esid, _location, _room, client); 
			}
			//---then...
			if (!userExists){
				//blocking code
				userExists = insertUserToDB( _esid, _location, _room, client ); 
			}
			
			done();
		});
	}
	
	else if (validESID){ //user is in cache
		updateExsitingUser(_location, _room, _esid);
	}
	else { /** Invalid ESID */}
	
}//end updateRecord() 


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

function insertUserToDB(_esid, _location, _room, client){
	var insertString = "INSERT INTO " + dbTable + " (esid) VALUES($1)";
	
	client.query(insertString, [_esid], function InsertUserCallback (err, result) {
		if (err) { 
			console.log('trouble w check user in table '); 
			console.error(err); 
			return false; 
		}
		
		if (result) {
			console.log("Added USER to table " + _esid);
			updateExsitingUser(_location, _room, _esid);
	
			ESID_CACHE[_esid] = Date.now();
			return true;
		}
	});
	return false; 
}


function updateExsitingUser(_location, _room, _esid) {
			
	var validActivation, loc, column;
	activations. getColumn(_location, _room, function getActivations(found, location, table_column) {
		 validActivation = found;
		 loc = location;
		 column = table_column; 
	 }); 
	 
	 if (validActivation){
		 pg.connect(dbURL, function (err, client, done) {
			updateUserInDb(_esid, column, loc, client);
			done();
		 });
	 }
}

function updateUserInDb(_esid, column, loc, client){
	
	var updateString = "UPDATE " + dbTable + " SET " + column + "= CURRENT_TIMESTAMP WHERE esid=$1"; 
	 client.query(updateString, [_esid], function (err, result)  {
		 if (err) { console.log("trouble updating user ESID: " + _esid);  }
		 if (result) { console.log("updated user ESID: " + _esid); }
	 }) ; 
	 
	 var updateLocation =  "UPDATE " + dbTable + " SET location=$1 WHERE esid=$2"; 
	 client.query(updateLocation, [loc, _esid], function (err, result) {
		 if (result) {}
	 });
	
}


/*---------------------------------------------------------------------------------------
	ESID cache will hold recent users in memory for up to 2 hours after last appearance.
	This will speed up the SELECT SQL check to see if a User is already in existence.  
	
	A user's ESID must only be added to this if and only after they are inserted into the Database
	or were recently re-confirmed to be in the database. 
	
	Date/time should be stored as UTC milliseconds. use Date.now(); 
	
	Example structure of the the cache --> 
	ESID_CACHE = {
		'1111-1111-1111': '1433008815001', 
		'1111-1111-2222': '1433008855280', 
	};
	
	note the value in each key: value is the last appearance of the user. UPDATE THIS  
---------------------------------------------------------------------------------------*/

function cleanESID_CACHE() {
	//clean ESID older than  MAX_CACHE_TIME 
	
	var cutoff =  Date.now() - MAX_CACHE_TIME; //the oldest (in ms) an ESID can be
	var cleaned =  0; 
	var inCache = 0; 
	
	for (var key in ESID_CACHE){
		if ( !ESID_CACHE.hasOwnProperty(key) ) { continue; }
		
		if (ESID_CACHE[key] < cutoff){ //if older than cutoff, remove
			delete ESID_CACHE[key]; 
			cleaned++;
		} else { inCache++; }
	}
	
	console.log("Cahce objects cleaned:  " + cleaned + " items in cache: " + inCache  ); 
	
} //cleanESID_CACHE()

function printCacheCount(){
	var esidCount = 0; 
	for (var key in ESID_CACHE){
		if ( !ESID_CACHE.hasOwnProperty(key) ) { continue; }
		esidCount++; 
	}
	console.log('cache size count: ' + esidCount);
}



exports.updateRecord = updateRecord;
exports.setUp = setUp; 
exports.printCacheCount = printCacheCount; 


