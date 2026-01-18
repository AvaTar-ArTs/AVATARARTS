
var iPhoneType="auto";
if (iPhoneType == "auto") {
	if (screen.height == 480) { iPhoneType = "iPh4"; }
	else if (screen.height == 568) { iPhoneType = "iPh5"; }
	else if (screen.height == 667) { iPhoneType = "iPh6"; }
	else { iPhoneType = "iPh6Plus"; }
}

// RESIZE THE BODY
window.addEventListener("load", function() { 
	switch(iPhoneType) {
		case "iPh4":
			document.body.style.width='320px';
    		document.body.style.height='568px'; // Keep at 568px (not 480px).
		break;
		case "iPh5":
			document.body.style.width='320px';
    		document.body.style.height='568px';
		break;
		case "iPh6":
			document.body.style.width='375px';
    		document.body.style.height='667px';
		break;
		case "iPh6Plus":
			document.body.style.width='414px';
    		document.body.style.height='736px';
		break;
		case "editMode":
			document.body.style.width='563px';
    		document.body.style.height='1000px';
		break;
	}
}, false);