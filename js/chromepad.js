window.onBespinLoad = function() {
    var edit = document.getElementById("textarea");
    // Get the environment variable.
    var env = edit.bespin;
    // Get the editor.
    var editor = env.editor;
    // Change the value and move to the secound line.
    editor.value = "Initial Content\nWith 2 lines";
    editor.setLineNumber(2);
};

$(document).ready(function() {
	dropbox.setup();
	
	$('#save').click(function() {
		var edit = document.getElementById("textarea");
	    // Get the environment variable.
	    var env = edit.bespin;
	    // Get the editor.
	    var editor = env.editor;
		
		dropbox.uploadFile('', 'save-file', editor.value);
	});
});
