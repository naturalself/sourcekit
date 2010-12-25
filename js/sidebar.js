var Sidebar = function(filelist, dropbox) {
	var _dropbox = dropbox;
	var _filelist = filelist;
	
	return {
		initialize: function() {
			EventBroker.subscribe("load.sidebar", (function(event, parentNode, path) {
				dropbox.getDirectoryContents(path, function(data) {
					$("#" + $(parentNode).attr('id') + " ul").empty();
					$.each(data.contents, function(index, file) {
						if (file.is_dir) {
							_filelist.jstree("create_node", parentNode, "inside", {
								data: file.path.match(/([^\\\/]+)$/)[1],
								state: "closed",
								attr: {
									id: file.path.replace(/\//g, '_')
								}
							});
					
							_filelist.jstree("open_node", parentNode);
						} else {
							_filelist.jstree("create_node", parentNode, "inside", {
								data: file.path.match(/([^\\\/]+)$/)[1],
								state: null,
								children: null,
								attr: {
									id: file.path.replace(/\//g, '_')
								}
							});
						}
					});

					$('#filelist').jstree("open_node", parentNode);
				});
			}).bind(this));
			
			// set up jstree
			_filelist.jstree({
				core: { animation: 0 },
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
						state : "closed"
					}]
				},
			});
			
			_filelist.bind("select_node.jstree", (function(event, data) {
				var path = data.inst.get_path(data.rslt.obj).join('/').replace(/^\/\//, '/');
				var isFile = data.inst.is_leaf(data.rslt.obj);
				var parentNode = data.rslt.obj;

				if (isFile) {
					EventBroker.publish('load.editor', [path]);
				} else {
					if (!data.inst.is_open()) {
						_filelist.jstree("open_node", parentNode);
					} else {
						_filelist.jstree("close_node", parentNode);
					}
				}
			}).bind(this));
			
			_filelist.bind("open_node.jstree", function(event, data) {
				var path = data.inst.get_path(data.rslt.obj).join('/').replace(/^\/\//, '/');
				var parentNode = data.rslt.obj;
				EventBroker.publish('load.sidebar', [parentNode, path]);
			});
			
			$("#new-file").click((function() {
				var node;
				var nodes = _filelist.jstree("get_selected");
				
				if (nodes != null && nodes[0] != null) {
					node = nodes[0];
				}
				
				var path = _filelist.jstree("get_path", node).join('/').replace(/^\/\//, '/');
				
				if (_filelist.jstree("is_leaf", node)) {
					path = path.match(/^(.*?)[^\\\/]+$/)[1];
				}
				
				EventBroker.publish("new.editor", [path]);
			}).bind(this));
		}
	}
}

$(document).ready(function() {
	var bgPage = chrome.extension.getBackgroundPage();
	var dropbox = bgPage.dropbox;
	var sidebar = new Sidebar($("#filelist"), dropbox);
	sidebar.initialize();
	

});