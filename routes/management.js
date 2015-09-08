/*
	run the SPA for /app configuration and reports generated 
*/ 

var express = require('express');
var router = express.Router(); 
var passport = require('passport'); 
var restrict = require('../auth/restrict.js'); 


//MAIN APP PAGE. LOAD NG
router.get('/', restrict, function (req, res, next){
	var vm = {};
	res.render('app/panel', vm);
}); 

//login
router.get('/login',function (req, res, next){
	var vm = {
		title: "Login"
	}; 
	res.render('app/login', vm);
});  

//login request
router.post('/login', function(req, res, next){  next(); }, 
	passport.authenticate('local', {failureRedirect: '/app/login/', successRedirect: '/app'}) 
); 

router.get('/logout', function(req, res, next){
	req.logout(); 
	req.session.destroy();
	res.redirect('/app/login'); 
}); 



module.exports = router;