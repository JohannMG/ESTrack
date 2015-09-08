/*
	for all /data routing and methods
*/

var express = require('express');
var router = express.Router(); 
var passport = require('passport');

var pg = require('pg');
var dbURL = process.env.DATABASE_URL || "postgres://localhost:5432/test_development";
var usertable = process.env.USERS_TABLE || "test_users";


//  server.com/data/
router.get('/', function(req, res, next){
	res.type('html');
	res.send('<h4>Documendation coming </h4><br><p><a href="http://www.twitter.com/johann_mg">bug Johann to make them</a><p>');  
}); 

module.exports = router;