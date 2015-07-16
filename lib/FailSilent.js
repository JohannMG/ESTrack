
//logFail will later send an email via mandrill when someting fails AND prints to console. 

// var err -- the passed error object from the CATCH
//var location --string to specific ID to recognize try/catch failture point. 

function logFail(_err, location) {
	
	console.log("----------Error Caught--------");
	console.log(_err); 
	console.log( "email notification" + (sendToMandrill(_err) ) ? "SUCCESS" : " FAIL" ) ; 
	console.log("-----------End Error---------");
	
	
	
}

function sendToMandrill(){
	
	//TODO send to mail (return true is succeesfully sent)
	return false; 	
}

exports.logFail = logFail; 