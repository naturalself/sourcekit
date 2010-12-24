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
			  console.log("saving " + this.path);
			  
				if (this.path == "" || !this.path) {
					this.path = prompt("Choose a file name to save");
				}
				
				_dropbox.putFileContents(this.path, _editor.value, (function() {
					this.notification = webkitNotifications.createNotification("images/check.png", "Save File Notification", "File Saved As " + this.path + "!");
					this.notification.show();
					
					window.setTimeout((function() { this.notification.cancel() }).bind(this), 5000);
				}).bind(this));
			}).bind(this);
			
			this.onLoad = (function(path) {
				this.path = path;
				_dropbox.getFileContents(this.path, (function(data) {
					_editor.value = data;
				}).bind(this));
			}).bind(this);
		
			this.onCreate = (function() {
			
			}).bind(this);
		
			this.onLogoffDropbox = (function() {
				_dropbox.logOutDropbox();
			}).bind(this);
		
			this.onDrawerToggle = (function() {
			
			}).bind(this);
		
			this.onWindowResized = (function() {
				$("div.ui-layout-center").height($(window).height());
				$("#editor").width($("#pad").width());
				$("#editor").height($("#pad").height());
				$("#editor").offset({top:0});
				
				$("#toolbar").offset({top:$("#pad").height() - 19});
				$("#toolbar").width($("#pad").width());
				
				_editorElement.bespin.dimensionsChanged();
			}).bind(this);
		
			this.onPaneResized = (function(pane, element, state, options, name) {
				$("#editor").width($("#pad").width());				
				$("#toolbar").width($("#pad").width());				
				_editorElement.bespin.dimensionsChanged();
			}).bind(this);
			
			this.changeTheme = (function(themeName) {
				_editorElement.bespin.settings.set("theme", themeName);
			}).bind(this);
			
			this.getDirectoryContents = (function(path) {
				_dropbox.getDirectoryContents(path, function(data) {
	        		$.each(data.contents, function(index, file) {
			            if (!file.is_dir) {
			                $("<li>" + file.path +"</li>").appendTo('#fileList');
			            }
			        });
			    });
			}).bind(this);
		}
	};
}

$(document).ready(function() {
  
	var bgPage = chrome.extension.getBackgroundPage();
	var dropbox = bgPage.dropbox;
	
	var chromepad = new Chromepad(document.getElementById("editor"), dropbox);
	
	$('body').layout({ 
		applyDefaultStyles: true,
		center__applyDefaultStyles: false,
		onresize: function() { EventBroker.publish("redraw.editor"); }
	});
	
	/*window.onBespinLoad = function() {
		chromepad.initialize();
		
		chromepad.changeTheme("twilight");
		
		chromepad.getDirectoryContents("/");

		dropbox.getDirectoryContents('/', function(data) {
			$.each(data.contents, function(index, file) {
				if (file.is_dir) {
				  $('#filelist').jstree("create_node", "#filelist_root", "inside", {
					data: file.path.match(/([^\\\/]+)$/)[1],
					state: "closed"
				  });
				} else {
				  $('#filelist').jstree("create_node", "#filelist_root", "inside", {
					data: file.path.match(/([^\\\/]+)$/)[1],
					state: null,
					children: null,
				  });
				}
			});
		});
		
		$('#filelist').jstree({
			core: {
				animation: 0
				},
			plugins : [ "themes", "json_data", "ui"],
			themes : {
				"theme" : "apple",
				"dots" : false,
				"icons" : false
			},
			json_data: { 
				data: [{
					data : "/", 
					attr : { id : "filelist_root" }, 
					state : "opened"
				}]
			},
		}).bind("select_node.jstree", function(event, data) {
			var path = data.inst.get_text(data.rslt.obj);

			if (data.inst.is_leaf(data.rslt.obj)) {
				// IS FILE
				chromepad.onLoad(path);
			} else {
				// IS DIR
				var parent_node = data.rslt.obj;

				$("#" + $(parent_node).attr('id') + " ul").empty();
				
				console.log("#" + $(parent_node).attr('id') + " ul");

				dropbox.getDirectoryContents(path,

				function(data) {
					$.each(data.contents,
					function(index, file) {
						if (file.is_dir) {
							$('#filelist').jstree("create_node", parent_node, "inside", {
								data: file.path.match(/([^\\\/]+)$/)[1],
								state: "closed",
								attr: {
									id: file.path.replace(/\//, '_')
								}
							});
							
							$('#filelist').jstree("open_node", parent_node);
						} else {
							$('#filelist').jstree("create_node", parent_node, "inside", {
								data: file.path.match(/([^\\\/]+)$/)[1],
								state: null,
								children: null,
								attr: {
									id: file.path.replace(/\//, '_')
								}
							});
							

						}
					});

					$('#filelist').jstree("open_node", parent_node);
				});
			}
		});

		chromepad.onWindowResized();
	}*/
});
