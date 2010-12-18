var Sidebar = function(dropbox) {
	var _dropbox = dropbox;
	
	return {
		initialize: function() {
			
		},
		
		getContents: function(path) {
			_dropbox.getDirectoryContents(path, function(data) {
        		$.each(data.contents, function(index, file) {
		            if (!file.is_dir) {
		                $("<li><a href='javascript:chrome.tabs.create({\"url\": \"chromepad.html?path=" + file.path + "\"});'>" + file.path +"</a></li>").appendTo('#content');
		            }
		        });
		    });
		}
	}
}

$(document).ready(function() {
	var bgPage = chrome.extension.getBackgroundPage();
	var dropbox = bgPage.dropbox;
	var sidebar = new Sidebar(dropbox);
	sidebar.getContents();
});