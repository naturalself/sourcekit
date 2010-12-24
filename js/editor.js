var Editor = function(layout, editor, statusBar, dropbox) {
	var _dropbox = dropbox;
	
	var _layout = layout;
	var _editor = editor;
	var _statusBar = statusBar;
	
	var _editorLibrary;
	
	return {
		path: "",
		initialize: function() {
			_editorLibrary = _editor.get(0).bespin;

			// Hooking up global events
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
				
				_dropbox.getFileContents(this.path, (function(data) {
					if (data) {
						document.title = this.path;
						_editorLibrary.editor.value = data;
					} else {
						_editorLibrary.editor.value = "";
					}
				}).bind(this));
				
			}).bind(this));
			
			EventBroker.subscribe('redraw.editor', (function(event) {
				_layout.height($(window).height());

				_editor.width(_layout.width());
				_editor.height($(window).height() - _statusBar.height());
				_editor.offset({top:0});
				
				_statusBar.offset({top:$(window).height() - _statusBar.height()});
				_statusBar.width(_layout.width());
				
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
	var editor = new Editor($("#pad"), $("#editor"), $("#status-bar"), dropbox);
	window.onBespinLoad = function() {
		editor.initialize();
	
		$("#save").click(function() {
			EventBroker.publish("save.editor");
		});
	}
});