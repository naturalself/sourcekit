var Chromepad = function(editorElement) {	
	var _dropbox = new ModernDropbox("0660jgq6erg4h63", "0iyu9q1lnb56jyg");
	var _editorElement = editorElement;
	var _editor;
	
	return {
		path: "",
		
		initialize: function() {
			_editor = _editorElement.bespin.editor;
			
			var objURL = new Object();

		    window.location.search.replace(
			    new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
			        function( $0, $1, $2, $3 ) {
			            objURL[ $1 ] = $3;
			        }
		    );
		
			if (objURL['path']) {
				this.path = objURL['path'].replace(/^\//, '');
				this.onLoad();
			}
			
			this.onSave = (function() {
				if (this.path == "" || !this.path) {
					$('#choose_file_name').dialog('open');
				} else {
					_dropbox.putFileContents(this.path, _editor.value, function() {
						alert('saved!');
					});
				}
			}).bind(this);
			
			this.onLoad = (function() {
				_dropbox.getFileContents(this.path, function(data) {
					_editor.value = data;
				});
			}).bind(this);
		
			this.onCreate = (function() {
			
			}).bind(this);
		
			this.onLogoffDropbox = (function() {
				_dropbox.logOutDropbox();
				location.reload();
			}).bind(this);
		
			this.onDrawerToggle = (function() {
			
			}).bind(this);
		
			this.onDimensionsChanged = (function() {
				$("#editor").height($(window).height() - 32);
				$("#editor").width($(window).width());
				_editorElement.bespin.dimensionsChanged();
			}).bind(this);
			
			this.onDimensionsChanged();
		},
				
	
	};
}

$(document).ready(function() {
	var chromepad = new Chromepad(document.getElementById("editor"));
	
	window.onBespinLoad = function() {
		chromepad.initialize();
		
		// Set up save dialog
		$('#choose_file_name').dialog({
			autoOpen: false,
			resizable: false,
			draggable: false,
			modal: true,
			buttons: {
				Cancel: function() {
					$(this).dialog("close");
				},
				OK: function() {
					$(this).dialog("close");
					chromepad.path = $('#path').val();
					chromepad.onSave();
				}
			}
		});
		
		// Handle Save Event
		$('#save').click(chromepad.onSave);

	    $("#logoff").click(function() {
	        chromepad.onLogoffDropbox();
	    });

		$(window).resize(chromepad.onDimensionsChanged);
	}
});
