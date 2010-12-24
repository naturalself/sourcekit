var ModernDropbox = function(consumerKey, consumerSecret) {
	// Constructor / Private
	var _consumerKey = consumerKey;
	var _consumerSecret = consumerSecret;
	
	var _tokens = {};
	var _storagePrefix = "moderndropbox_";
	var _isSandbox = false;
	var _cache = true;
	var _authCallback = "";
	var _fileListLimit = 10000;
	var _cookieTimeOut = 3650;
	var _dropboxApiVersion = 0;
	var _xhr = new XMLHttpRequest();
	
	var _ajaxSendFileContents = function(options) {
		var message = options.message;
		var filename = options.filename;
		var content = options.content;
		var success = options.success;
		var error = options.error;
		
		_xhr.open("POST", message.action, true);
		
		var boundary = '---------------------------';
		boundary += Math.floor(Math.random() * 32768);
		boundary += Math.floor(Math.random() * 32768);
		boundary += Math.floor(Math.random() * 32768);
		_xhr.setRequestHeader("Content-Type", 'multipart/form-data; boundary=' + boundary);
	
		var body = '';

		for (i in message.parameters) {
			body += '--' + boundary + '\r\n' + 'Content-Disposition: form-data; name="';
			body += message.parameters[i][0];
			body += '"\r\n\r\n';
			body += message.parameters[i][1];
			body += '\r\n';
		}

		body += '--' + boundary + "\r\n";
		body += "Content-Disposition: form-data; name=file; filename=" + filename + "\r\n";
		body += "Content-type: application/octet-stream\r\n\r\n";
		body += content;
		body += "\r\n";
		body += '--' + boundary + '--';
		
		_xhr.onreadystatechange = (function() {
			if (this.readyState == 4 && this.status == 200) {				
				success();
    		} else if (this.readState == 4) {
				error();
			}
		}).bind(_xhr);
		
		_xhr.onerror = error;
		
		_xhr.send(body);
	};
	
	var _setAuthCallback = function(callback) {
		_authCallback = callback;
	};
	
	var _setupAuthStorage = function() {
		keys = ["requestToken", "requestTokenSecret", "accessToken", "accessTokenSecret"];
		
		for (i in keys) {
			var key = keys[i];
			value = localStorage.getItem(_storagePrefix + key);
			if (value) {
				_tokens[key] = value;
			}
		}
	};
	
	var _clearAuthStorage = function() {
		keys = ["requestToken", "requestTokenSecret", "accessToken", "accessTokenSecret"];
		
		for (i in keys) {
			var key = keys[i];
			localStorage.removeItem(_storagePrefix + key);
		}
	};
	
	var _storeAuth = function(valueMap) {
		keys = ["requestToken", "requestTokenSecret", "accessToken", "accessTokenSecret"];
		
		for (i in keys) {
			var key = keys[i];
			
			if (valueMap[key]) {
				localStorage.setItem(_storagePrefix + key, valueMap[key]);
				_tokens[key] = valueMap[key];
			}
		}	
	};
		
	var _createOauthRequest = function(url, options) {
		if (!options) {
			options = [];
		}
		
		// Outline the message
		var message = {
			action: url,
			method: "GET",
		    parameters: [
		      	["oauth_consumer_key", _consumerKey],
		      	["oauth_signature_method", "HMAC-SHA1"]
		  	]
		};
		
		// Define the accessor
		var accessor = {
			consumerSecret: _consumerSecret,
		};
		
		if (!options.token) {
			message.parameters.push(["oauth_token", _tokens["accessToken"]]);
		} else {
			message.parameters.push(["oauth_token", options.token]);
			delete options.token;
		}
		
		if (!options.tokenSecret) {
			accessor.tokenSecret = _tokens["accessTokenSecret"];
		} else {
			accessor.tokenSecret = options.tokenSecret;
			delete options.tokenSecret;
		}
		
		if (options.method) {
			message.method = options.method;
			delete options.method;
		}
	
		for (key in options) {
			message.parameters.push([key, options[key]]);
		}
		
		OAuth.setTimestampAndNonce(message);
		OAuth.SignatureMethod.sign(message, accessor);

		return message;
	};
	
	var _sendOauthRequest = function(message, options) {
		if (!options) {
			options = [];
		}
		
		if (!options.success) {
			options.success = function() {};
		}

		if (!options.error) {
			options.error = function() {};
		}
		
		if (!options.type) {
			options.type = "json";
		}
		
		if (options.multipart) {
			_ajaxSendFileContents({
				message: message,
				filename: options.filename,
				content: options.content,
				success: options.success,
				error: options.error
			});
		} else {
			$.ajax({
				url: message.action,
				type: message.method,
				data: OAuth.getParameterMap(message.parameters),
				dataType: options.type,
				success: options.success,
				error: options.error
			});
		}
	};
	
	// Public
	return ({
		isAccessGranted: function() {
			return (_tokens["accessToken"] != null) && (_tokens["accessTokenSecret"] != null);
		},
	
		isAuthorized: function() {
			return (_tokens["requestToken"] != null) && (_tokens["requestTokenSecret"] != null);
		},
		
		initialize: function() {
			_setupAuthStorage();

			return this;
		},

		authorize: function(options) {
			$.ajax({
				type: 'GET',
				url: "https://api.dropbox.com/" + _dropboxApiVersion + "/token",
				data: {
					email: options.email,
					password: options.password,
					oauth_consumer_key: _consumerKey
				},
				dataType: 'json',
				success: (function(data) {
					if (!data) {
						data = "";
					}
				
					var authTokens = {};
					authTokens["accessToken"] = data["token"];
					authTokens["accessTokenSecret"] = data["secret"];
					
					_storeAuth(authTokens);
					
					options.success(data);
				}).bind(this),
				error: options.error
			});
		},
		
		deauthorize: function() {
			_clearAuthStorage();
		},
		
		getAccountInfo: function(callback) {
			var url = "https://api.dropbox.com/" + _dropboxApiVersion + "/account/info";
			var message = _createOauthRequest(url);
			_sendOauthRequest(message, {
				type: "json",
				success: (function(data) { callback(data); }).bind(this)
			});
		},
		
		getDirectoryContents: function(path, callback) {
		  var filename = path.replace(/^\//, '');
			var url = "https://api.dropbox.com/" + _dropboxApiVersion + "/metadata/dropbox/" + filename;
			var message = _createOauthRequest(url, {
				file_limit: _fileListLimit,
				list: "true"
			});

			_sendOauthRequest(message, {
				type: "json",
				success: (function(data) { callback(data); }).bind(this)
			});
		},
		
		getMetadata: function(path, callback) {
		  var filename = path.replace(/^\//, '');
			var url = "https://api.dropbox.com/" + _dropboxApiVersion + "/metadata/dropbox/" + filename;
			var message = _createOauthRequest(url, {
				list: "false"
			});
			
			_sendOauthRequest(message, {
				type: "json",
				success: (function(data) { callback(data); }).bind(this)
			});
		},
		
		getFileContents: function(path, callback) {
		  var filename = path.replace(/^\//, '');
			var url = "https://api-content.dropbox.com/" + _dropboxApiVersion + "/files/dropbox/" + filename;
			var message = _createOauthRequest(url);

			_sendOauthRequest(message, {
				type: "text",
				success: (function(data) { callback(data); }).bind(this)
			});
		},
		
		putFileContents: function(path, content, callback) {
			var filename = path.match(/([^\\\/]+)$/)[1];
			var file_path = path.match(/^(.*?)[^\\\/]+$/)[1];
			file_path = file_path.replace(/^\//, '')
			var url = "https://api-content.dropbox.com/" + _dropboxApiVersion + "/files/dropbox/" + file_path + "?file=" + filename;
			var message = _createOauthRequest(url, { method: "POST" });
			
			_sendOauthRequest(message, {
				multipart: true,
				content: content,
				filename: filename,
				success: (function(data) { callback(data); }).bind(this)
			});
		},
		
		logOutDropbox: function() {
			_clearAuthStorage();
		}
	}).initialize();
};