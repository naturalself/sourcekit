var Buffer = function(path, content, mimeType) {	
	var _path = path;
	var _content = content;
	var _basename = path;
	var _mimeType = "text/plain";
	var _id = _path.replace(/[\/ \.]/g, '_');
	
	if ((matches = _path.match(/^(\/*([^\/]+))*$/)) != null) {
		_basename = matches[2];
	}
	
	return {
		isNew: function() { return this.path == null },
		path: _path,
		content: _content,
		basename: _basename,
		mimeType: _mimeType,
		id: _id
	}
}