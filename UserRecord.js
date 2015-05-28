var ESID_CACHE = {}; //notes below with cleanESID_CACHE() on proper use
var dbTable;
var dbURL;
var initiated = false;

var pg = require('pg');
var activations = require('./activations.js');

function setUp(db, table) {
	dbTable = table;
	dbURL = this.db;
	initiated = true;
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
		var selectstring = "SELECT * FROM " + dbTable + " WHERE esid=$1";
		pg.connect(dbURL, function (err, client, done) {
			client.query(selectstring, [_esid],
				function (err, result) {
					if (err) { console.log('trouble w check user in table '); console.error(err); }
	
					if (result && result.rows.length > 0) {
						ESID_CACHE[_esid] = new Date();
						updateExsitingUser(_location, _room, _esid);
						userExists = true;
					}
					else {  //no user, add user		
						var insertString = "INSERT INTO " + dbTable + " (esid) VALUES($1)"
						client.query(insertString, [_esid],
							function (err, result) {
								if (err) { console.log('trouble w check user in table '); console.error(err); }
								if (result) {
									console.log("Added USER to table " + _esid);
									updateExsitingUser(_location, _room, _esid);
	
									ESID_CACHE[_esid] = new Date();
									userExists = true;
								}
							});
						}
					done();
				});
		});
	}
	else if (validESID){ //user is in cache
		updateExsitingUser(_location, _room, _esid);
	}
	
	else {
		//invalid ESID
	}


}//end updateRecord()



function updateExsitingUser(_location, _room, _esid) {
			
	var validActivation, loc, column;
	
	 activations. getColumn(_location, _room, function getActivations(found, location, table_column) {
		 validActivation = found; 
		 loc = location; 
		 column = table_column; 
	 }); 
	 
	 if (validActivation){
		 var updateString = "UPDATE " + dbTable + " SET " + column + "= CURRENT_TIMESTAMP WHERE esid=$1"; 
		 
		 pg.connect(dbURL, function (err, client, done) {
			 client.query(updateString, [_esid], function (err, result)  {
				 if (err) { console.log("trouble updating user ESID: " + _esid);  }
				 if (result) { console.log("uspdated user ESID: " + _esid); }
			 }) ; 
			 var updateLocation =  "UPDATE " + dbTable + " SET location=$1 WHERE esid=$2"; 
			 client.query(updateLocation, [loc, _esid], function (err, result) {
				 if (result) { console.log("updated location of esid " + _esid + " to " + loc ); }
			 });
			 
			 done(); 
		 }); 
		 
		 
	 }
	 
	 else{
		 //location or room invalid
	 }
	
	


}


/*---------------------------------------------------------------------------------------
	ESID cache will hold recent users in memory for up to 2 hours after last appearance.
	This will speed up the SELECT SQL check to see if a User is already in existence.  
	
	A user's ESID must only be added to this if and only after they are inserted into the Database
	or were recently re-confirmed to be in the database. 
	
	Example structure of the the cache --> 
	ESID_CACHE = {
		'1111-1111-1111': 'Mon May 25 2015 23:05:17 GMT-0400 (EDT)', 
		'1111-1111-2222': 'Mon May 25 2015 23:06:14 GMT-0400 (EDT)', 
	};
	
	note the value in each key: value is the last appearance of the user. UPDATE THIS  
---------------------------------------------------------------------------------------*/

function cleanESID_CACHE(params) {
	//clean ESID older than 2 hours
	//TODO: implement 
	
}

exports.updateRecord = updateRecord;
exports.setUp = setUp; 


