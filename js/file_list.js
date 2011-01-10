jQuery.fn.sort = function() {
   return this.pushStack( [].sort.apply( this, arguments ), []);
};

function sortFiles(a,b){
    return a.path > b.path ? 1 : -1;
};

var FileList = function(fileList) {
	var _storage = Application.storage;
	var _fileList = fileList;
	var _application = null;
	var _state = "ready";
	
	return {
		initialize: function() {
			EventBroker.subscribe("load.fileList", (function(event, data) {
				var parentNode = data.parentNode;
				var path = data.path;
				
				_storage.getDirectoryContents(path, function(data) {
					$("#" + $(parentNode).attr('id') + " ul").empty();
					
					var contents = data.contents.sort(function(a, b) {
						var aTmp = ((a.is_dir) ? "0" : "1") + a.path.toLowerCase();
						var bTmp = ((b.is_dir) ? "0" : "1") + b.path.toLowerCase();
						return (aTmp > bTmp) ? 1 : -1;
					});

					$.each(contents, function(index, file) {
						if (file.is_dir) {
							_fileList.jstree("create_node", parentNode, "last", {
								data: file.path.match(/([^\\\/]+)$/)[1],
								state: "closed",
								attr: {
									id: file.path.replace(/\//g, '_')
								}
							});

							_fileList.jstree("open_node", parentNode);
						} else {
							_fileList.jstree("create_node", parentNode, "last", {
								data: file.path.match(/([^\\\/]+)$/)[1],
								state: null,
								children: null,
								attr: {
									id: "node" + file.path.replace(/\//g, '_')
								}
							});							
						}
					});
				});
			}).bind(this));
			
			EventBroker.subscribe("loaded.editor", (function(event, data) {
				_state = "ready";
			}).bind(this));
			
			// set up jstree
			_fileList.jstree({
				core: { animation: 0 },
				plugins : [ "themes", "json_data", "ui", "crrm", "unique", "sort" ],
				ui : {
					"select_limit": 1,
					"selected_parent_close": "deselect"
				},
				themes : {
					"theme" : "apple",
					"dots" : false,
					"icons" : false
				},
				json_data: {
					correct_state: false,
					data: [{
						data : "/",
						attr : { id : "fileList_root" }, 
						state : "closed"
					}]
				},
			});
			
			_fileList.bind("before.jstree", (function(event, data) {
				if (data.func == "select_node") {					
					if (_state != "ready") {
						return false;
					}
				}
			}).bind(this));
			
			_fileList.bind("select_node.jstree", (function(event, data) {
				var path = data.inst.get_path(data.rslt.obj).join('/').replace(/^\/\//, '/');
				var isFile = data.inst.is_leaf(data.rslt.obj);
				var parentNode = data.rslt.obj;

				if (isFile) {
					_state = "busy";
					EventBroker.publish('load.editor', {path: path});
				} else {
					if (!data.inst.is_open()) {
						_fileList.jstree("open_node", parentNode);
					} else {
						_fileList.jstree("close_node", parentNode);
					}
				}
			}).bind(this));
			
			_fileList.bind("open_node.jstree", function(event, data) {
				var path = data.inst.get_path(data.rslt.obj).join('/').replace(/^\/\//, '/');
				var parentNode = data.rslt.obj;
				EventBroker.publish('load.fileList', {parentNode: parentNode, path: path});
			});
			
			_fileList.bind("rename_node.jstree", function(event, data) {
				var path = data.inst.get_path(data.rslt.obj).join('/').replace(/^\/\//, '/');
				var node = data.rslt.obj;
				
				if (_fileList.jstree("is_leaf", node)) {
					EventBroker.publish('new.editor', {path: path});
				} else {
					_storage.createDirectory(path);
				}
			});

			/**
			 * call jstree to create a node (leaf = true) against either
			 *  1. selected node if it's a folder
			 *  2. or in the parentnode of the selected node if it's a leaf
			 *  on callback:
			 *  1. create new file
			 *  2. select node & open file
			 */
			$("#new-file").click((function() {

				var selectedNode;
				var nodes = _fileList.jstree("get_selected");
				if (nodes != null && nodes[0] != null) {
					selectedNode = nodes[0];
				}
				if (_fileList.jstree("is_leaf", selectedNode)) {
					_fileList.jstree("create", $(selectedNode).parent());
				} else {
					_fileList.jstree("create");
				}
			}).bind(this));
			
			$("#new-folder").click((function() {
				var selectedNode;
				var nodes = _fileList.jstree("get_selected");
				if (nodes != null && nodes[0] != null) {
					selectedNode = nodes[0];
				}
				if (_fileList.jstree("is_leaf", selectedNode)) {
					var newNode = _fileList.jstree("create_node", $(selectedNode).parent(), "last", { state: "closed" });
					_fileList.jstree("open_node", $(selectedNode).parent());
					_fileList.jstree("rename", newNode);
				} else {
					var newNode = _fileList.jstree("create_node", $(selectedNode), "last", { state: "closed" });
					_fileList.jstree("open_node", $(selectedNode));
					_fileList.jstree("rename", newNode);
				}
			}).bind(this));
			
			EventBroker.publish("load.fileList", { parentNode: "#fileList_root", path: "/" });
		}
	}
}
