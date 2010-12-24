var Sidebar = function(dropbox) {
	var _dropbox = dropbox;
	
	return {
		initialize: function() {
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
	}
}

$(document).ready(function() {
	var bgPage = chrome.extension.getBackgroundPage();
	var dropbox = bgPage.dropbox;
	var sidebar = new Sidebar(dropbox);
	sidebar.initialize();

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
				state : "opened"
			}]
		},
	}).bind("select_node.jstree", function(event, data) {
		var path = data.inst.get_path(data.rslt.obj).join('/').replace(/^\/\//, '/');

		if (data.inst.is_leaf(data.rslt.obj)) {
			// IS FILE
			EventBroker.publish('load.editor', [path]);
		} else {
			// IS DIR
			var parent_node = data.rslt.obj;
			$("#" + $(parent_node).attr('id') + " ul").empty();

			dropbox.getDirectoryContents(path,

			function(data) {
				$.each(data.contents,
				function(index, file) {
					if (file.is_dir) {
						$('#filelist').jstree("create_node", parent_node, "inside", {
							data: file.path.match(/([^\\\/]+)$/)[1],
							state: "closed",
							attr: {
								id: file.path.replace(/\//g, '_'),
								"data-path": file
							}
						});
						
						$('#filelist').jstree("open_node", parent_node);
					} else {
						$('#filelist').jstree("create_node", parent_node, "inside", {
							data: file.path.match(/([^\\\/]+)$/)[1],
							state: null,
							children: null,
							attr: {
								id: file.path.replace(/\//g, '_'),
								"data-path": file
							}
						});
						

					}
				});

				$('#filelist').jstree("open_node", parent_node);
			});
		}
	});
});