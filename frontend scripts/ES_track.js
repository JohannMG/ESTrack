//GETS data from page, send imgage request to EStrack
//put in external ref: EST_{location}_{activation}  without the curly braces e.g., EST_orlando_landing

function addESTrack() {
	var URLBASE = "//www.trackingSERVERgoesHERE.com/"; //no ? in base 
	
	var trk_attribute = document.body.getAttribute('data-ngx-tracking');
	if (trk_attribute.substring(0,3) !== "EST") { return; }
	
	var trackVars = trk_attribute.split("_");	
	if (trackVars.length < 3){ return;  }
	
	var location = trackVars[1];
	var room = trackVars[2]; 
	var esid = getCookie('ngx'); 
	if (esid === "") { return;  }
	
	var trackImage = new Image(); 
	
	trackImage.src = URLBASE + "?"
		+ "esid=" + esid
		+ "&" + "location=" + location 
		+ "&" + "room=" + room; 
	trackImage.setAttribute('style', 'display:none;'); 
	
	document.body.appendChild(trackImage);
	
}

function getCookie(cname) { //borrow from W3 
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {c = c.substring(1);}
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

document.addEventListener("DOMContentLoaded", addESTrack); 