var Chromepad = function(editorElement, dropbox) {
	var _dropbox = dropbox;
	var _editorElement = editorElement;
	var _editor;
	
	return {
		path: "",
		notification: null,
		initialize: function() {
			_editor = _editorElement.bespin.editor;
			
			this.onSave = (function() {
				if (this.path == "" || !this.path) {
					$('#save_dialog').dialog('open');
				} else {
					_dropbox.putFileContents(this.path, _editor.value, function() {
						this.notification = webkitNotifications.createNotification(null, "Save File Notification", "File Saved!");
						this.notification.show();
						
						window.setTimeout((function() { this.notification.cancel() }).bind(this), 1000);
					});
				}
			}).bind(this);
			
			this.onLoad = (function() {
				_dropbox.getFileContents(this.path, function(data) {
					this.notification = webkitNotifications.createNotification(null, "Open File Notification", "File Opened!");
					this.notification.show();
					
					window.setTimeout((function() { this.notification.cancel() }).bind(this), 1000);
					
					_editor.value = data;
				});
			}).bind(this);
		
			this.onCreate = (function() {
			
			}).bind(this);
		
			this.onLogoffDropbox = (function() {
				_dropbox.logOutDropbox();
			}).bind(this);
		
			this.onDrawerToggle = (function() {
			
			}).bind(this);
		
			this.onDimensionsChanged = (function() {
				$("#editor").height($(window).height() - 19);
				$("#editor").width($(window).width());
				_editorElement.bespin.dimensionsChanged();
			}).bind(this);
			
			this.changeTheme = (function(themeName) {
				_editorElement.bespin.settings.set("theme", themeName);
			}).bind(this);
			
			this.onDimensionsChanged();
		},
				
	
	};
}

$(document).ready(function() {
	var bgPage = chrome.extension.getBackgroundPage();
	var dropbox = bgPage.dropbox;
	
	var chromepad = new Chromepad(document.getElementById("editor"), dropbox);
	
	window.onBespinLoad = function() {
		chromepad.initialize();
		
		chromepad.changeTheme("twilight");
		
		// Set up save dialog
		$('#save_dialog').dialog({
			autoOpen: false,
			resizable: false,
			draggable: false,
			modal: true,
			title: "Save File On Dropbox",
			buttons: {
				Cancel: function() {
					$(this).dialog("close");
				},
				OK: function() {
					$(this).dialog("close");
					chromepad.path = $('#save_path').val();
					chromepad.onSave();
				}
			}
		});
		
		$('#open_dialog').dialog({
			autoOpen: false,
			resizable: false,
			draggable: false,
			modal: true,
			title: "Open File From Dropbox",
			buttons: {
				Cancel: function() {
					$(this).dialog("close");
				},
				OK: function() {
					$(this).dialog("close");
					chromepad.path = $('#open_path').val();
					chromepad.onLoad();
				}
			}
		});
		
		// Handle Save Event
		$('#save').click(chromepad.onSave);
		
		// Handle Open Event
		$('#open').click(function() {
			$('#open_dialog').dialog('open');
		});

	    $("#logoff").click(function() {
	        chromepad.onLogoffDropbox();
	    });

		$(window).resize(chromepad.onDimensionsChanged);
	}
});
