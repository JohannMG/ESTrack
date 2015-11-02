var pg = require('pg');
var dbURL = process.env.DATABASE_URL || "postgres://localhost:5432/test_development";
var usertable = process.env.USERS_TABLE || "test_users";

function locationStats() {




}


/*		
	_callback (err, results) 
		-> if any errors, err will return in callback
		-> if OK err=null and results with JSON formatted
		{	totalUsers: number,
			users7Days: number, 
			usersToday: number    };
	
*/
function highlights(_callback) {

	var rowCountQuery = 'SELECT COUNT(*) FROM ' + usertable;
	var sevenDaysQuery = "SELECT COUNT(*) FROM " + usertable + " WHERE firstping > now() - interval '7 days'";
	var todayCountQuery = 'SELECT COUNT(*) FROM location_users WHERE firstping > current_date';

	var totalUsersResponse, sevenDaysResponse, todayCountResponse;

	var client = new pg.Client(dbURL);
	client.connect(function (err) {
		if (err) {
			console.log('Error with dashboard highlights connection');
			client.end();
			return _callback(err, null);
		}
	});//END client.connect
	
	client.query(rowCountQuery, [], function (err, result) {
		if (err) {
			console.log('Error with rowCountQuery');
			client.end();
			return _callback(err, null);
		}
		totalUsersResponse = result;
	
		client.query(sevenDaysQuery, [], function (err, result) {
			if (err) {
				console.log('Error with  7 Day Query');
				client.end();
				return _callback(err, null);
			}
	
			sevenDaysResponse = result;
	
			client.query(todayCountQuery, [], function (err, result) {
				if (err) {
					console.log('Error with  Today Count Query');
					client.end();
					return _callback(err, null);
				}
	
				todayCountResponse = result;

				var dataResponse = {
					totalUsers: totalUsersResponse.rows[0].count,
					users7Days: sevenDaysResponse.rows[0].count,
					usersToday: todayCountResponse.rows[0].count,
				} ;
				
				_callback(null, dataResponse);
				client.end();
			});  //END: client.query(todayCountQuery
		}); //END: client.query(sevenDaysQuery
	}); // END: client.query(rowCountQuery
	
}//highlights()


exports.locationStats = locationStats;
exports.highlights = highlights; 