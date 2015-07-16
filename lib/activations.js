/*
	Get the Activation column Name for the SQL input from the native name in tracking code
	this manages the locations to each rooms to be looked up. 
*/
var locationRooms = {

	"orlando": {
		"landing": "room1",
		"history": "room2",
		"interactive": "room3"
	},

	"baltimore": {
		"landing_page": "room1"
	}
};

var fs = require('./FailSilent'); 

/*---------------------------------------------------------------------------------------
	Send the parameters from the URL and a callback funtion 
	that uses the proper "location" and table column for the room
	serves the function of filtering/sanitizing input
	
	found is a boolean and will return TRUE if all good
	found will be FALSE if room not found
	
	ex. 
	getActivation("Orlando", "landing_page", funtion(found, location, table_column){
			
	}); 
	
	callback notes
		found: boolean
		location: string
		table_columns: string

---------------------------------------------------------------------------------------*/
function getColumn(sent_location, sent_room, _callback) {

	var found = false;
	var location, table_column;
	var loc;
	var room;
	
	try {
		loc = sent_location.toLowerCase();
		room = sent_room.toLowerCase();
	} catch (error) {
		
		fs.logFail(error, "columnNotFound"); 
	}

	if (typeof locationRooms[loc] === 'undefined') {
		location = null;
	
	}else{
		location = loc; 
		if (typeof locationRooms[loc][room] !== 'undefined') {
			table_column = locationRooms[loc][room];
			found = true;
		} else {
			table_column = null;
		}
	}


	_callback(found, location, table_column);

}


exports.getColumn = getColumn; 


