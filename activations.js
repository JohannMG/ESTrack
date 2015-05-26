/*
	Get the Activation column Name for the SQL input from the native name in tracking code
	
	this manages the locations to each rooms to be looked up. 
*/

var locationRooms = {
	
	"orlando": {
		"landing_page" : "room1", 
		"history_room" : "room2", 
		"interactive"  : "room3"
	},
	
	"baltimore": {
		"landing_page" : "room1"
	} 
};

function getActivation(sent_location, sent_room){ 
	
	return locationRooms[sent_location][sent_room] || null ; 
	
}








exports.getActivationColumnFromName = getActivation; 

