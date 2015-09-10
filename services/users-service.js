var testusers = { 'test': { username: 'johannmg', password: 'alpine' } };

var valid = require('validator');
var pg = require('pg');
var bcrypt = require('bcrypt'); 

var dbURL = process.env.DATABASE_URL || "postgres://localhost:5432/test_development";
var mgmtTable = process.env.MGMT_USERS || "mgmt_users";

/*
	Finds user in user table, returns user object if exists.
	_callback(err, user) sends back err: an error object or null && user: {username: "bromley", password:"password123"}
	that password better be hashed, damn it! <3  
*/
exports.findUser = function (username, _callback) {
	
	
	var getUserString = 'SELECT * FROM ' + mgmtTable;
	getUserString += ' WHERE LOWER(username)=LOWER($1);'; 
	 
	if (!username || !valid.isAlphanumeric(username) ){
		_callback(new Error('invalid username'));
	}
	
		
	var client = new pg.Client(dbURL); 
	client.connect(function(err){
		if (err){
			console.log('Error with get user DB connection ');
			_callback(err, null);
			return;
		}
		
		client.query(getUserString, [username] ,function (err, result) {
			if (err){
				console.log('Error with get user DB query ');
				_callback(err, null);
				return;
			}
			
			if (result && result.rows.length >0){
				if (result.rows.length > 1){ console.log('more than one user found? returning first'); }
				
				_callback(null, result.rows[0]);
				return;
				
			}
			
			
		});
	});
};

//REQUIRES user.password, user.username
//optional: email, firstname, lastname
//_callback(err, user)
exports.addUser = function (user, _callback) {

	if (!user || user.password === undefined || user.username === undefined) {
		_callback(new Error('Must have username and password'), null);
		return;
	}

	if (!(valid.isAlphanumeric(user.username)) || valid.escape(user.username) !== user.username ) {
		_callback(new Error('Invalid User Name'), null);
		return;
	}

	if (!(valid.isAscii(user.password)) || valid.escape(user.password) !== user.password ) {
		_callback(new Error('Invalid Password'), null);
		return;
	}
	
	//SQL Query creation
	var addUserString = 'INSERT INTO ' + mgmtTable;
	addUserString += ' (firstname, lastname, username, pass, email)';
	addUserString += ' VALUES($1, $2, $3, $4, $5) ';
	
	var firstnameDb = (user.firstname) ? valid.escape(user.firstname) : "" ;
	var lastnameDb = (user.lastname) ? valid.escape(user.lastname) : "";
	var emailDb = ( valid.isEmail( user.email) ) ? valid.normalizeEmail(user.email): "";  
	
	bcrypt.hash(user.password, 7, function(err, passwordHash) {
	
		var userDetails = [ 
			firstnameDb, 
			lastnameDb, 
			user.username, 
			passwordHash, 
			emailDb
		];
	
		var client = new pg.Client(dbURL); 
		client.connect(function(err){
			if (err){
				console.log('Error with user creation, DB connection');
				return _callback(err, null);
			}
			
			client.query(addUserString, userDetails, function (err, result) {
				
				if (err) {
					_callback(new Error('Problem with DB query'), null);
					console.log('Error with user creation, DB query');
					return;
				}
				
				else{
					_callback(null, result);
				}
		
		
				client.end();
			}); //end client query
			
		}); //end client connect
		
	});//end bcrypt callback for Password hash



};