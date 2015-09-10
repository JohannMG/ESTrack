/*
	run the SPA for /app configuration and reports generated 
*/ 

var express = require('express');
var router = express.Router(); 
var passport = require('passport'); 
var restrict = require('../auth/restrict.js'); 
var userService = require('../services/users-service'); 


//MAIN APP PAGE. LOAD NG
router.get('/', restrict, function (req, res, next){
	var vm = {};
	res.render('app/panel', vm);
}); 

//login
router.get('/login',function (req, res, next){
	var vm = {
		title: 'Login'
	}; 
	res.render('app/login', vm);
}); 

//login request
router.post('/login', 
	passport.authenticate('local', {failureRedirect: '/app/login', successRedirect: '/app'}), 
	function(req, res, next){
		next(); 
	}
); 

router.get('/logout',  function(req, res, next){
	req.logout(); 
	req.session.destroy();
	res.redirect('/app/login'); 
}); 


router.get('/create', restrict, function(req, res, next){
	var vm = {
		title: 'Create New User'
	};
	res.render('app/createUser', vm);
	
}); 

router.post('/create', restrict, function(req, res, next){

	userService.addUser(req.body, function(err, user){
		var vm = {}; 
		if (err){
			vm.title = 'Create New User';
			vm.userNote = 'Create User Failed: ' + err;   
			return res.render('app/createUser', vm);
		}
		
		else{
			
			vm.title = 'New User Created!';
			vm.userNote = 'New user: ' + req.body.username + 'created!';
			return res.render('app/createUser', vm); 
		}
		
	}); 
	
});


module.exports = router;