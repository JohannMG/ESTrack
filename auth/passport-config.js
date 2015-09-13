module.exports = function () {

	var bcrypt = require('bcrypt');
	var userService = require('../services/users-service.js');
	var passport = require('passport');
	var LocalStrategy = require('passport-local').Strategy;

	passport.use(new LocalStrategy(
		function (username, password, done) {
			userService.findUser(username,function (err, user) {
				if (err) { return done(err); }
				
				if (!user) {
					return done(null, false, { message: 'credentials incorrect' });
				}
				
				console.log(user);
				bcrypt.compare(password, user.pass, function(err, same) {
					if (err) {
						return done(err);
					}
					//incorrect pass
					if (!same) {
						 done(null, null);
						 return;
					}
					
					//correct pass
					done(null, user);  
				}); 
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


