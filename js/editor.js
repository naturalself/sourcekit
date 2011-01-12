var Editor = function(layout, editor, tabs, statusBar) {
	var _storage = Application.storage;

	var _editor = editor;
	
	var _tabs = tabs;
	
	var _statusBar = statusBar;
	
	var _buffers = [];
	
	var _currentBufferIndex = null;

	var _layout = layout;
	
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
			"java": "java",
			"js": "js",
			"json": "js",
			"sql": "sql",
			"rb": "rb", 
			"c": "c_cpp", 
			"cpp": "c_cpp",
			"cs": "cs",
			"py": "py", 
			"php": "php", 
			"phtml": "php",
			"cs": "cs",
			"coffee": "coffee"};
			
	var _editorLibrary;
	
	return {
		// Assumed to be called inside a window.onBespinLoad function
		initialize: function() {
			var BespinBuffer = bespin.tiki.require('text_editor:models/buffer').Buffer;
			
			_editorLibrary = _editor.get(0).bespin;
			_editorLibrary.settings.set('fontsize', 12);
			
			/** 
			 * Handles "new.editor" event
			 * Chain calls the "load.editor" event
			 * 
			 * @param data json object { path: the_path_to_load }
			 */
			EventBroker.subscribe('new.editor', (function(event, data) {
				this.path = data.path;
				_storage.putFileContents(this.path, "", (function(data) {
					EventBroker.publish('load.editor', {path: this.path});
				}).bind(this));
			}).bind(this));
			
			/**
			 * Handles the "load.editor" event
			 *
			 * Will switch to the right tab if file is already loaded; otherwise:
			 * Will create a new EditorBuffer (which is composed of path, BespinBuffer and mimeType)
			 * Creates new tab and selects it (notifying tab show event)
			 * If the file cannot be loaded, send notification and then send "loaded.editor" event to clear locks on the file list
			 */
			EventBroker.subscribe('load.editor', (function(event, data) {
				for (var i in _buffers) {
					if (_buffers[i].path == data.path) {
						EventBroker.publish('show_buffer.editor', {index: parseInt(i)});
						return this;
					}
				}
								
				this.path = data.path;
				
				var index = 0;
				if (_currentBufferIndex != null) {
					index = _currentBufferIndex + 1;
				}
				
				// select new one
				_storage.getMetadata(this.path, (function(data) {
					if (_acceptedMimeTypes[data.mime_type] != null || data.mime_type.match(/^text\//)) {
						_storage.getFileContents(this.path, (function(content) {
							if (content) {
								document.title = this.path;
								_buffers[index] = new EditorBuffer(this.path, new BespinBuffer(null, content), data.mime_type);
							} else {
								_buffers[index] = new EditorBuffer(this.path, new BespinBuffer(null, ""), data.mime_type);
							}
							_tabs.tabs("add", "#tabs-" + _buffers[index].id, _buffers[index].basename);
							_tabs.tabs("select", index);
						}).bind(this));
					} else {
						Notification.notify("images/close.png", "Error loading file", "Not a supported file format!");
						EventBroker.publish("loaded.editor");
					}
				}).bind(this));
			}).bind(this));
			
			EventBroker.subscribe('show_buffer.editor', (function(event, data) {
				$("#intro").hide();
				$("#main .wrapper").show();
				$("#main footer").show();
				
				var index = data.index;
				var syntax = _acceptedMimeTypes[_buffers[index].mimeType];

				if (_buffers[index].mimeType == "application/octet-stream" ||
					_buffers[index].mimeType == "text/plain") {
					for (extension in _fileExtensions) {
						if (_buffers[index].basename.match('\.' + extension + '$')) {
							syntax = _fileExtensions[extension];
						}
					}
				}

				// Assign either a new bespinBuffer or an existing bespinBuffer
				if (_buffers[index] != null) {
					_editorLibrary.editor.buffer = _buffers[index].bespinBuffer;
				} else {
					_editorLibrary.editor.buffer = new BespinBuffer();
				}
				
				_tabs.tabs("select", index);
			
				_editorLibrary.editor.syntax = syntax;
				
				_currentBufferIndex = index;
				
				EventBroker.publish("loaded.editor");
			}).bind(this));
			
			/** 
			 * Handles "save.editor" event
			 * Will save and notify about the file being saved
			 */
			EventBroker.subscribe('save.editor', (function(event) {
				_storage.putFileContents(this.path, _editorLibrary.editor.value, (function(data) {
					Notification.notify("images/check.png", "Save File Notification", "File Saved As " + this.path + "!");
				}).bind(this));
			}).bind(this));
			
			EventBroker.subscribe('redraw.editor', (function(event) {
				_layout.height($(window).height());

				_editor.width(_layout.width());
				_editor.height(_layout.height() 
						- _statusBar.height() 
						- _tabs.children("ul").height());
				
				_tabs.height(_layout.height() 
						- _statusBar.height());

				_editorLibrary.dimensionsChanged();
			}).bind(this));
			
			EventBroker.subscribe('change_theme.editor', (function(event, data) {
				_editor.bespin.settings.set("theme", data.themeName);
			}).bind(this));
		
			// Set up a keydown event catcher for the editor (e.g. saving)
			$(window).bind('keydown', (function(event) {
				if (event.metaKey && event.keyCode == 83) { // Ctrl or Meta-S
					EventBroker.publish("save.editor");
					event.preventDefault();
				}
			}));
			
			_tabs.tabs({
				show: (function(event, ui) {
					this.path = _buffers[ui.index].path;
					
					$(ui.panel).append($(_editor));

					EventBroker.publish("show_buffer.editor", {index: ui.index});
					EventBroker.publish("redraw.editor");
				}).bind(this),

				tabTemplate: '<li><a href="#{href}">#{label}</a><span class="ui-icon ui-icon-close">Remove Tab</span></li>'
			});
		
			EventBroker.subscribe("close_tab.editor", (function(event, data) {
				var index = $("li", _tabs).index($(data.ui).parent());				

				if (_buffers.length > 1) {
					_buffers.splice(index, 1);
				
					if (_currentBufferIndex > 0) {
						_currentBufferIndex--;
					} else {
						_currentBufferIndex = 0;
					}
				} else {
					_buffers = [];
					_currentBufferIndex = null;
					$("body").append($(_editor));
					$("#intro").show();
					$("#main .wrapper").hide();
					$("#main footer").hide();
				}
				
				_tabs.tabs("remove", index);
			}).bind(this));
		
			$('#' + _tabs.attr('id') + ' span.ui-icon-close').live("click", function(event, ui) {
				EventBroker.publish("close_tab.editor", {ui: ui});
			});
			
			EventBroker.publish("ready.editor");
		}
	};
}
