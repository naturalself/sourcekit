var chromepad = {};

var dropbox = new ModernDropbox("0660jgq6erg4h63", "0iyu9q1lnb56jyg");

window.onBespinLoad = function() {
    // Build an empty URL structure in which we will store
    // the individual query values by key.
    var objURL = new Object();


    // Use the String::replace method to iterate over each
    // name-value pair in the query string. Location.search
    // gives us the query string (if it exists).
    window.location.search.replace(
    new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
        function( $0, $1, $2, $3 ) {
            objURL[ $1 ] = $3;
        }
    );

	chromepad.path = objURL['path'].replace(/^\//, '');
	
    var edit = document.getElementById("textarea");
    // Get the environment variable.
    var env = edit.bespin;
    // Get the editor.
    var editor = env.editor;

	dropbox.getFileContents(chromepad.path, function(data) {
		// Change the value and move to the secound line.
		editor.value = data;
	});
};

$(document).ready(function() {
	$('#save').click(function() {
		var edit = document.getElementById("textarea");
	    // Get the environment variable.
	    var env = edit.bespin;
	    // Get the editor.
	    var editor = env.editor;
		
		dropbox.putFileContents(chromepad.path, editor.value);
	});

    $("#logoff").click(function() {
        console.log("clearing");
        dropbox.logOutDropbox();
    });
});
