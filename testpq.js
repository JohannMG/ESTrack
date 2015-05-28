var pg = require('pg');

function getAll(url, callback) {
	
	var data; 
	
	pg.connect(url, function (err, client, done) {
		client.query("SELECT * FROM test_users WHERE esid='1112'", function (err, result) {
			done(); 
			
			if (err){
				console.error(err);
			}
			
			else{ 
			//	data = result.rows;
			 callback(result.rows);
			}
		}); 
	});

}

exports.getAll = getAll;