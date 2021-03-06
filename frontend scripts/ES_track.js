//GETS data from page, send imgage request to EStrack
//put in external ref: EST_{location}_{activation}  without the curly braces e.g., EST_orlando_landing

//https://boiling-caverns-3581.herokuapp.com/tk.gif

function addESTrack() {
	var URLBASE = '//boiling-caverns-3581.herokuapp.com/tk.gif'; //no ? in base 
	
	var trk_attribute = document.body.getAttribute('data-ngx-tracking');
	if (trk_attribute.toLowerCase().substring(0,3) !== "est") { return; }
	if (location.href.toLowerCase().indexOf('confirmation') === -1) { return; }
	
	var trackVars = trk_attribute.split("_");	
	if (trackVars.length < 3){ return;  }
	
	var geoLocation = trackVars[1];
	var room = trackVars[2]; 
	var esid = getCookie('ngx'); 
	if (esid === "") { return;  }
	
	var trackImage = new Image(); 
	
	trackImage.src = URLBASE + "?"
		+ "esid=" + esid
		+ "&" + "location=" + geoLocation 
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


/*minified Jun-10 copy

function addESTrack(){var t="https://boiling-caverns-3581.herokuapp.com/tk.gif/",e=document.body.getAttribute("data-ngx-tracking");if("EST"===e.substring(0,3)){var n=e.split("_");if(!(n.length<3)){var o=n[1],r=n[2],i=getCookie("ngx");if(""!==i){var a=new Image;a.src=t+"?esid="+i+"&location="+o+"&room="+r,a.setAttribute("style","display:none;"),document.body.appendChild(a)}}}}function getCookie(t){for(var e=t+"=",n=document.cookie.split(";"),o=0;o<n.length;o++){for(var r=n[o];" "==r.charAt(0);)r=r.substring(1);if(0==r.indexOf(e))return r.substring(e.length,r.length)}return"";}document.addEventListener("DOMContentLoaded",addESTrack);

*/

/*minified Jun-30 copy
function addESTrack(){var t="//boiling-caverns-3581.herokuapp.com/tk.gif",e=document.body.getAttribute("data-ngx-tracking");if("est"===e.toLowerCase().substring(0,3)&&-1!==location.href.toLowerCase().indexOf("confirmation")){var n=e.split("_");if(!(n.length<3)){var o=n[1],i=n[2],r=getCookie("ngx");if(""!==r){var a=new Image;a.src=t+"?esid="+r+"&location="+o+"&room="+i,a.setAttribute("style","display:none;"),document.body.appendChild(a)}}}}function getCookie(t){for(var e=t+"=",n=document.cookie.split(";"),o=0;o<n.length;o++){for(var i=n[o];" "==i.charAt(0);)i=i.substring(1);if(0==i.indexOf(e))return i.substring(e.length,i.length)}return""}document.addEventListener("DOMContentLoaded",addESTrack);

*/
