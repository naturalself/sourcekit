var Editor = function(layout, editor, statusBar, tabs, dropbox) {
	var _dropbox = dropbox;
	
	var _layout = layout;
	
	var _editor = editor;
	
	var _statusBar = statusBar;
	
	var _tabs = tabs;
	
	var _buffers = [];
	
	var _bufferPaths = [];
	
	var _bufferMimeTypes = [];
	
	var _currentBufferIndex = 0;
	
	var _acceptedMimeTypes = {
			"text/plain": "", 
			"text/html": "html", 
			"application/octet-stream": "", 
			"application/javascript": "js", 
			"text/x-python": "py", 
			"text/x-ruby": "rb",
			"text/php": "php",
			"text/x-csrc": "c_cpp",
			"text/x-c++src": "c_cpp",
			"text/x-java": "java"};
			
	var _fileExtensions = {
			"md": "markdown", 
			"json": "js", 
			"rb": "rb", 
			"c": "c_cpp", 
			"cpp": "c_cpp", 
			"py": "py", 
			"php": "php", 
			"phtml": "php"};
			
	var _editorLibrary;
	
	return {
		debug: function() {
			console.log(_buffers);
			console.log(_currentBufferIndex);
			console.log(_bufferPaths);
			console.log(_bufferMimeTypes);
		},
		path: "",
		initialize: function() {
			_buffers[0] = "";
			
			$(_tabs).tabs({
				show: (function(event, ui) {
					if (ui.index > 0) {
						$(_editor).css("display", "block");
						$(ui.panel).append($(_editor));
						EventBroker.publish("show_buffer.editor", [ui.index]);
					}
				}).bind(this),
				tabTemplate: '<li><a href="#{href}">#{label}</a> <span class="ui-icon ui-icon-close">Remove Tab</span></li>'
			});
		
			$(_tabs).children("span.ui-icon-close").live("click", function() {
				var index = $("li", $("#tabs")).index($(this).parent());
				$(_tabs).tabs("remove", index);
			});
			
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
				bufferIndex = _currentBufferIndex + 1;
				$(_tabs).tabs("add", "#tabs-" + bufferIndex, this.path.match(/[^\/]*$/)[0]);
				console.log(_buffers);
				// select new one
				_dropbox.getMetadata(this.path, (function(data) {
					_bufferPaths[bufferIndex] = path;
					console.log(_buffers);
					_bufferMimeTypes[bufferIndex] = data.mime_type;
					console.log(_buffers);
					if (_acceptedMimeTypes[data.mime_type] != null) {
						_dropbox.getFileContents(this.path, (function(data) {
							if (data) {
								document.title = this.path;
								console.log(_buffers);
								_buffers[bufferIndex] = data;
								console.log(_buffers);
							} else {
								_buffers[bufferIndex] = "";
							}
							EventBroker.publish("show_buffer.editor", bufferIndex);
						}).bind(this));
					} else {
						Notification.notify("images/close.png", "Error loading file", "Not a supported file format!");
					}
				}).bind(this));
			}).bind(this));
			
			EventBroker.subscribe('show_buffer.editor', (function(event, index) {
				var syntax = _acceptedMimeTypes[_bufferMimeTypes[index]];
				
				if (_bufferMimeTypes[index] == "application/octet-stream") {
					for (extension in _fileExtensions) {
						if (_bufferPaths[index].match('\.' + extension + '$')) {
							syntax = _fileExtensions[extension];
						}
					}
				}
				
				if (_editorLibrary.editor.value != null) {
					_buffers[_currentBufferIndex] = _editorLibrary.editor.value;
				} else {
					_buffers[_currentBufferIndex] = "";
				}
				
				if (_buffers[index] != null) {
					_editorLibrary.editor.value = _buffers[index];
				} else {
					_editorLibrary.editor.value = "";
				}
				
				$(_tabs).tabs("select", index);
			
				_editorLibrary.editor.syntax = syntax;
				
				_currentBufferIndex = index;
			}).bind(this));
			
			EventBroker.subscribe('redraw.editor', (function(event) {
				_layout.height($(window).height());

				_editor.width(_layout.width());
				_editor.height(_layout.height() - _statusBar.height() - _tabs.children("ul").height());

				_tabs.height(_layout.height() - _statusBar.height());

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
	var editor = new Editor($("#main"), $("#editor"), $("#main footer"), $("#tabs"), dropbox);
	window.onBespinLoad = function() {
		editor.initialize();
	
		$("#save").click(function() {
//			EventBroker.publish("save.editor");
			editor.debug();
		});
	}
});