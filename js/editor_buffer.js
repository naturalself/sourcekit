var EditorBuffer = function(path, bespinBuffer, mimeType) {	
	var _path = path;
	var _bespinBuffer = bespinBuffer;
	var _basename = path;
	var _mimeType = "text/plain";
	var _id = _path.replace(/[\/ \.]/g, '_');
	
	if ((matches = _path.match(/^(\/*([^\/]+))*$/)) != null) {
		_basename = matches[2];
	}
	
	return {
		isNew: function() { return this.path == null },
		bespinBuffer: _bespinBuffer,
		path: _path,
		basename: _basename,
		mimeType: _mimeType,
		id: _id,
	}
}