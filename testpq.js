var pg = require('pg');

function getAll(url, callback) {
	
	var data; 
	
	pg.connect(url, function (err, client, done) {
		client.query('SELECT * FROM test_users', function (err, result) {
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
	
	console.log("module");
	console.log(data);
	console.log("end module");
	
	//callback(data);
}

exports.getAll = getAll;