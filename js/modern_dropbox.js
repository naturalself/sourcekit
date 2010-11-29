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
	
	// Public
	return ({
		setAuthCallback: function(callback) {
			_authCallback = callback;
		},
		
		setupAuthStorage: function() {
			keys = ["requestToken", "requestTokenSecret", "accessToken", "accessTokenSecret"];
			
			for (i in keys) {
				var key = keys[i];
				value = localStorage.getItem(_storagePrefix + key);
				if (value) {
					_tokens[key] = value;
				}
			}
		},
		
		clearAuthStorage: function() {
			keys = ["requestToken", "requestTokenSecret", "accessToken", "accessTokenSecret"];
			
			for (i in keys) {
				var key = keys[i];
				localStorage.removeItem(_storagePrefix + key);
			}
		},
		
		storeAuth: function(valueMap) {
			keys = ["requestToken", "requestTokenSecret", "accessToken", "accessTokenSecret"];
			
			for (i in keys) {
				var key = keys[i];
				
				if (valueMap[key]) {
					localStorage.setItem(_storagePrefix + key, valueMap[key]);
				}
			}	
		},
		
		isAccessGranted: function() {
			return _tokens["accessToken"] && _tokens["accessTokenSecret"];
		},
		
		isAuthorized: function() {
			return _tokens["requestToken"] && _tokens["requestTokenSecret"];
		},
		
		createOauthRequest: function(url, options) {
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
			
			if (!options.accessToken) {
				message.parameters.push(["oauth_token", _tokens["accessToken"]]);
			} else {
				message.parameters.push(["oauth_token", options.token]);
				delete options.token;
			}
			
			if (options.tokenSecret) {
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
		},
		
		sendOauthRequest: function(message, options) {
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
				options.type = "JSON";
			}
			
			if (options.multipart) {
				
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
		},
		
		initialize: function() {
			this.setupAuthStorage();
			
			if (!this.isAccessGranted()) {
				if (!this.isAuthorized()) {
					var message = this.createOauthRequest("http://api.getdropbox.com/0/oauth/request_token");
					
					this.sendOauthRequest(message, {
						type: "text",
						success: (function(data) {
							if (!data) {
								data = "";
							}
						
							var tokenPairStrings = data.split("&");
							var parsedTokenPairs = [];
					
							for (i in tokenPairStrings) {
								var tokenPairs = tokenPairStrings[i].split("=");
								parsedTokenPairs[tokenPairs[0]] = tokenPairs[1];
							}
					
							var authTokens = {};
							authTokens["requestToken"] = parsedTokenPairs["oauth_token"];
							authTokens["requestTokenSecret"] = parsedTokenPairs["oauth_token_secret"];
					
							this.storeAuth(authTokens);
		
							//Redirect to autorisation page
							/*document.location = "http://api.getdropbox.com/0/oauth/authorize?oauth_token=" 
								+ authTokens["requestToken"] 
								+ "&oauth_callback=" 
								+ _authCallback; */
						}).bind(this)
					});
				} else {
					var message = this.createOauthRequest("http://api.getdropbox.com/0/oauth/access_token", {
						token: _tokens["requestToken"],
						tokenSecret: _tokens["requestTokenSecret"]
					});
					
					this.sendOauthRequest(message, {
						type: "text",
						success: (function(data) {
							if (!data) {
								data = "";
							}
						
							var tokenPairStrings = data.split("&");
							var parsedTokenPairs = [];
					
							for (i in tokenPairStrings) {
								var tokenPairs = tokenPairStrings[i].split("=");
								parsedTokenPairs[tokenPairs[0]] = tokenPairs[1];
							}
					
							var authTokens = {};
							authTokens["accessToken"] = parsedTokenPairs["oauth_token"];
							authTokens["accessTokenSecret"] = parsedTokenPairs["oauth_token_secret"];
					
							this.storeAuth(authTokens);
						}).bind(this)
					});
				}
			}
		}
	}).initialize();
};