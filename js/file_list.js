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
									id: file.path.replace(/\//g, '_')
								}
							});							
						}
					});

					$(_fileList).jstree("open_node", parentNode);
				});
			}).bind(this));
			
			// set up jstree
			_fileList.jstree({
				core: { animation: 0 },
				plugins : [ "themes", "json_data", "ui" ],
				themes : {
					"theme" : "apple",
					"dots" : false,
					"icons" : false
				},
				json_data: { 
					data: [{
						data : "/", 
						attr : { id : "fileList_root" }, 
						state : "closed"
					}]
				},
			});
			
			_fileList.bind("select_node.jstree", (function(event, data) {
				var path = data.inst.get_path(data.rslt.obj).join('/').replace(/^\/\//, '/');
				var isFile = data.inst.is_leaf(data.rslt.obj);
				var parentNode = data.rslt.obj;

				if (isFile) {
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
			
			$("#new-file").click((function() {
				var node;
				var nodes = _fileList.jstree("get_selected");
				
				if (nodes != null && nodes[0] != null) {
					node = nodes[0];
				}
				
				var path = _fileList.jstree("get_path", node).join('/').replace(/^\/\//, '/');
				
				if (_fileList.jstree("is_leaf", node)) {
					path = path.match(/^(.*?)[^\\\/]+$/)[1];
				}
				
				EventBroker.publish("new.editor", {path: path});
			}).bind(this));
		}
	}
}
