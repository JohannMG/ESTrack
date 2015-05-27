var ESID_CACHE; //notes below with cleanESID_CACHE() on proper use
var dbTable; 
var dbURL; 

var pg = require('pg');
var rooms = require ('./activations.js'); 

function setUp(table, db) {
	dbTable = table; 
	dbURL = this.db; 
	
}

function updateRecord( _location, _room, _esid ){
	
	
	var userExists = (typeof ESID_CACHE[ _esid ] !== 'undefined'); //is user in chache?
	
	//if user does not esxist in chache, check database
	if (!userExists){
		
		var selectstring = "SELECT * FROM " + dbTable + " WHERE esid='$1';"; 
		
		pg.connet(dbURL, function (err, client, done) {
			client.query(selectstring, [], 
				function (err, result) {
					if (err){ console.log('trouble w check user in table ' ); }
					
					if (result){
						result.forEach(function(element) {
							
						}, this);
					}
			});
			done();
		});
	}//end check if in DB  
	
	
	
	
	
	
	
	//check ESID and Activation included
	if ( typeof data_in.esid == 'undefined' || typeof data_in.activation == 'undefined' ){ 
		console.log('No missing ESID or activation send in req.'); 
		res.send(''); 
		return;
	}
	
	if (ESID[ data_in.esid ]){
		//update existing DB record
		pg.connect(dbURL, function (err, client, done) {
			client.query("UPDATE $1 SET $2=CURRENT_TIMESTAMP WHERE esid='$3'", 
				[usertable, roomTags.getActivation(data_in.activation), data_in.esid ] , 
				function (err, result) {
				
				if (err){ console.log('error updating user with ESID' + data_in.activation); console.error(err);}
			});
		});
		
	}
	else{
		 //check if in DB
		 
		//create DB record. Add room if there.
		pg.connect(dbURL, function (err, client, done) {
			client.query('', function (err, result) {
				done();
				if (err) {
					
				}else {}
				
			}); 
		});
		
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
