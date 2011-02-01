define('sourcekit/application', ['dropbox/dropbox', 'sourcekit/editor', 'sourcekit/filelist'], function (Dropbox, Editor, FileList) {

dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.BorderContainer");

var consumerKey = "0660jgq6erg4h63";
var consumerSecret = "0iyu9q1lnb56jyg";
var dropbox = new Dropbox(consumerKey, consumerSecret);
var Application = {};

Application.start = function() {
    if (!dropbox.isAccessGranted()) {
        chrome.tabs.getCurrent(function(tab) {
            chrome.tabs.create({ url: "options.html", selected: true });
            chrome.tabs.remove(tab.id);
        });
    }
    
    dojo.addOnLoad((function() {
        editor = new Editor();
        fileList = new FileList();
    }).bind(this));
};

return Application;

});

