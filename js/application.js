/**
 * Application Object
 * Holds the buffers array and also the UI components (in a hash)
 */
var Application = {
	
	components: {},
	
	storage: null,
	
	bindComponents: (function(components) {
		this.components = components;
	}).bind(this),
	
	initialize: (function() {
		EventBroker.subscribe("ready.editor", function() {
			$('body').layout({ 
				applyDefaultStyles: true,
				center__applyDefaultStyles: false,
				onresize: function() { EventBroker.publish('redraw.editor'); }
			});

			EventBroker.publish('redraw.editor');
		});
		
		// Initialize the canvas based editor
		var editor = new Editor(
			$(this.components.editorPanel),
			$(this.components.editor), 
			$(this.components.tabs), 
			$(this.components.statusBar));
			
		window.onBespinLoad = function() {
			editor.initialize();
			
			$("#save").click(function() {
				EventBroker.publish("save.editor");
			});	
		}
		
		// Initialize the file list sidebar
		var fileList = new FileList($(this.components.fileList));
		fileList.initialize();
		
	}).bind(this),
	
	lock: (function() {
		
	}),
	
	unlock: (function() {
		
	})
}

$(document).ready(function() {
	var bgPage = chrome.extension.getBackgroundPage();
	var storage = bgPage.dropbox;
	
	if (!storage.isAccessGranted()) {
		chrome.tabs.getCurrent(function(tab) {
	        chrome.tabs.create({ url: "options.html", selected: true });
	        chrome.tabs.remove(tab.id);
	    });
	} else {
		Application.storage = storage;
	
		Application.bindComponents({
			editorPanel: $("#main"),
			editor: $("#editor"),
			tabs: $("#tabs"),
			fileList: $("#fileList"),
			sideBar: $("#sideBar"),
			statusBar: $("#main footer")
		});
	
		Application.initialize();
	}
});
