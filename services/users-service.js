var testusers = { 'test': { username: 'johannmg', password: 'alpine' } };

var valid = require('validator');

var pg = require('pg');
var dbURL = process.env.DATABASE_URL || "postgres://localhost:5432/test_development";
var mgmtTable = process.env.MGMT_USERS || "mgmt_users";

/*
	Finds user in user table, returns user object if exists.
	_callback(err) sends back err: an error object or null && user: {username: "bromley", password:"password123"}
	that password better be hashed, damn it! <3  
*/
exports.findUser = function (username, _callback) {
	
	//get from DB usually, this return is for testing
	_callback(null, testusers['test']);
};

//REQUIRES user.password, user.username
//optional: email, firstname, lastname
//_callback(err, user)
exports.addUser = function (user, _callback) {

	if (!user || user.password === undefined || user.username === undefined) {
		_callback(new Error('Must have username and password'), null);
		return;
	}

	if (!(valid.isAlphanumeric(user.username))
		|| valid.escape(user.username) !== user.username
		) {
		_callback(new Error('Invalid User Name'), null);
		return;
	}

	if (!(valid.isAscii(user.password))
		|| valid.escape(user.password) !== user.password
		) {
		_callback(new Error('Invalid Password'));
		return;
	}

	var addUserString = 'INSERT INTO ' + mgmtTable;
	addUserString += ' (firstname, lastname, username, pass, email) ';
	addUserString += ' ($1, $2, $3, $4, $5) ';
	
	var firstnameDb = (user.firstname) ? valid.escape(user.firstname) : "" ;
	var lastnameDb = (user.lastname) ? valid.escape(user.lastname) : "";   
	
	var userDeatils = [ 
		
	 ]

	var client = new pg.Client(dbURL); 
	client.query(addUserString, function (err, result) {

		if (err) {
			_callback(new Error('Problem with DB query'), null);
			console.log('Error with DB query ');
			return;
		}


		client.end();
	}); //end client query




}