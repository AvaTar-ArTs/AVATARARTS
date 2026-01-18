var iPhoneType = "auto"; // "auto" (normal use), "iPh4", iPh5", "iPh6","iPh6Plus" , "iPhX" or "editMode" (bigger preview). autosising for iPhX @NewD
	// SPECIAL CSS POSITIONING FOR iPAD & iPHONE X
	
// GET THE CURRENT WIDTH & HEIGHT
if (iPhoneType == "auto") {
	if (screen.height == 480) { iPhoneType = "iPh4"; }
	else if (screen.height == 568) { iPhoneType = "iPh5"; }
	else if (screen.height == 667) { iPhoneType = "iPh6"; }
	else if (screen.height == 736) { iPhoneType = "iPh6Plus"; }
	else if (screen.height == 1024) { iPhoneType = "iPadMini"; }
	else { iPhoneType = "iPhX"; }
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
		case "iPhX":
			document.body.style.width='375px';
			document.body.style.height='667px'; // Keep at 667px (not 812px). Just add a 375x812 overlay called 'homeX.png' in Images/Classic for iPhone X screens.
//			document.getElementById("background").style.height = "812px"; // to make full height walls fill height on X. Comment out (//) for 1/3rd size walls
		break;
		case "iPad":
			document.body.style.width='768px'; 
			document.body.style.height='1364px'; // Keep at 1364px (not 1024px) for 16:9 ratio.
		break;
		case "editMode":
			document.body.style.width='563px';
    		document.body.style.height='1000px';
		break;
	}
}, false);
