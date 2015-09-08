module.exports = function () {

	var bcrypt = require('bcrypt');
	var userService = require('../services/users-service.js');
	var passport = require('passport');
	var LocalStrategy = require('passport-local').Strategy;

	passport.use(new LocalStrategy(
		function (username, password, done) {
			userService.findUser({ username: username }, function (err, user) {
				
				//if good request --> "return done(null, user);"
				//if bad request --> "return done(null, false, {message: "say what's up here"});"
				//if error --> "return done(err);" 
				
				
				if (err) { return done(err); }
				
				if (!user) {
					return done(null, false, { message: 'credentials incorrect' });
				}
				
				//this MUST use bCrypt hashes later
				if (user.password === password) {
					return done(null, user); 
				}
				
				return done(null, false, { message: 'credentials incorrect' });

			});
		})
	); //end passport.use for local strategy
	
	passport.serializeUser(function(user, done) {
		done(null, user.username);
	});

	passport.deserializeUser(function(username, done) {
		userService.findUser(username, function (err, user) {
			done(err, user);
		});
	});

};


