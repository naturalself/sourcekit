define('sourcekit/application', [
    'dropbox/dropbox', 
    'sourcekit/data/dropbox_store', 
    'sourcekit/editor', 
    'sourcekit/filelist'], function (Dropbox, DropboxStore, Editor, FileList) {

dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.BorderContainer");

var consumerKey = "0660jgq6erg4h63";
var consumerSecret = "0iyu9q1lnb56jyg";
var dropbox = new Dropbox(consumerKey, consumerSecret);
var Application = {};

Application.start = function(editorEnv) {
    this.editorEnv = editorEnv;
    
    dropbox.authorize((function() {
        dojo.addOnLoad((function() {
            store = new DropboxStore(dropbox);
            editor = new Editor(store, this.editorEnv);
            fileList = new FileList(store, editor);
        }).bind(this));
    }).bind(this));
};

return Application;

});

