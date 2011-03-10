define('sourcekit/workspace', [
    'dropbox/dropbox', 
    'sourcekit/data/dropbox_store',
    'sourcekit/editor', 
    'sourcekit/filelist'], function (Dropbox, DropboxStore, Editor, FileList) {

var Workspace = function() {}

Workspace.prototype.initialize = function(store) {
    this.store = store;
    this.editor = new Editor(this.store);
    this.fileList = new FileList(this.store, this.editor);
}

Workspace.prototype.destroy = function() {
    // TODO
}


Workspace.getDropboxWorkspace = function(callback) {    
    var consumerKey = "0660jgq6erg4h63";
    var consumerSecret = "0iyu9q1lnb56jyg";
    var dropbox = new Dropbox(consumerKey, consumerSecret);
    
    dropbox.authorize((function() {
        var store = new DropboxStore(dropbox);
        var ws = new Workspace();
        ws.initialize(store);
        
        if (callback) {
            callback.call(this, workspace);
        }
    }).bind(this));
    
    return true;
}


return Workspace;

});

