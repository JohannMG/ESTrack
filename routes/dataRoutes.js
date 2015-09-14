/*
	for all /data routing and methods
*/

var express = require('express');
var router = express.Router(); 
var passport = require('passport');

var dataService = require('../services/data-services'); 



//  server.com/data/
router.get('/', function(req, res, next){
	res.type('html');
	res.send('<h4>Documendation coming </h4><br><p><a href="http://www.twitter.com/johann_mg">bug Johann to make them</a><p>');  
}); 

/** 
	locations = [{
		name: "location Name";
		roomCount:
		userRecords: 
		lastUser:
		visitsToday: 
		visitsYesterday: 
		visits7Days:  
	},{}]
*/


router.get('/locationStats', function(req, res, next){
	
	
});

/*{
		totalUsers: number,
		users7Days: number, 
		usersToday: number    };
*/
router.get('/highlights', function(req, res, next){
	dataService.highlights(function(err, result){
		if (err){
			console.log('ERROR with data service: ');
			console.log(err);
			res.send({error: err});
		}
		else{
			res.send(result);
		}
		
	});
	
}); 



module.exports = router;