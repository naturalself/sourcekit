var Editor = function(layout, editor, statusBar, dropbox) {
	var _dropbox = dropbox;
	
	var _layout = layout;
	var _editor = editor;
	var _statusBar = statusBar;
	
	var _acceptedMimeTypes = {"text/plain": "", "text/html": "html", "application/octet-stream": "", "application/javascript": "js", "text/x-python": "py", "text/x-ruby": "rb"};
	var _fileExtensions = {"md": "markdown", "json": "js", "rb": "rb", "c": "c_cpp", "cpp": "c_cpp", "py": "py", "php": "php", "phtml": "php"};
	var _editorLibrary;
	
	return {
		path: "",
		initialize: function() {
			_editorLibrary = _editor.get(0).bespin;

			// Hooking up global events
			EventBroker.subscribe('new.editor', (function(event, defaultPath) {
				if (defaultPath == null) {
					defaultPath = "/";
				}
				
				this.path = prompt("Choose a file name to save", defaultPath);
				
				_editorLibrary.editor.value = "";
				_editorLibrary.editor.syntax = "";
			}).bind(this));
			
			EventBroker.subscribe('save.editor', (function(event) {
				if (this.path == "" || !this.path) {
					this.path = prompt("Choose a file name to save");
				}
				
				_dropbox.putFileContents(this.path, _editorLibrary.editor.value, (function(data) {
					Notification.notify("images/check.png", "Save File Notification", "File Saved As " + this.path + "!");
				}).bind(this));
			}).bind(this));
			
			EventBroker.subscribe('load.editor', (function(event, path) {
				this.path = path;

				_dropbox.getMetadata(this.path, (function(data) {
					console.log(data.mime_type);
					if (_acceptedMimeTypes[data.mime_type] != null) {
						var syntax = _acceptedMimeTypes[data.mime_type];
					
						if (data.mime_type == "application/octet-stream") {
							for (extension in _fileExtensions) {
								if (this.path.match('\.' + extension + '$')) {
									syntax = _fileExtensions[extension];
								}
							}
						}
						
						_dropbox.getFileContents(this.path, (function(data) {
							if (data) {
								document.title = this.path;
								_editorLibrary.editor.value = data;
								console.log(syntax);
								_editorLibrary.editor.syntax = syntax;
							} else {
								_editorLibrary.editor.value = "";
							}
						}).bind(this));
					} else {
						Notification.notify("images/close.png", "Error loading file", "Not a supported file format!");
					}
				}).bind(this));
			}).bind(this));
			
			EventBroker.subscribe('redraw.editor', (function(event) {
				_layout.height($(window).height());

				_editor.width(_layout.width());
				_editor.height(_layout.height() - _statusBar.height());
	
				_editorLibrary.dimensionsChanged();
			}).bind(this));
			
			EventBroker.subscribe('change-theme.editor', (function(themeName) {
				_editorElement.bespin.settings.set("theme", themeName);
			}).bind(this));
		
			// Set up a keydown event catcher for the editor (e.g. saving)
			_editor.keydown(function(event) {
				if (event.metaKey && event.keyCode == 83) { // Ctrl or Meta-S
					EventBroker.publish("save.editor");
					event.preventDefault();
				}
			});
			
			EventBroker.publish("ready.editor");
		}
	};
}

// Set up the editor
$(document).ready(function() {
	var bgPage = chrome.extension.getBackgroundPage();
	var dropbox = bgPage.dropbox;
	var editor = new Editor($("#main"), $("#editor"), $("#main footer"), dropbox);
	window.onBespinLoad = function() {
		editor.initialize();
	
		$("#save").click(function() {
			EventBroker.publish("save.editor");
		});
	}
});