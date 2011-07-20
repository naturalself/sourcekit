define('sourcekit/workspace', [
    'dropbox/dropbox',
    'sourcekit/data/dropbox_store',
    'sourcekit/data/localStorage_store',
    'sourcekit/editor',
    'sourcekit/filelist'], function (Dropbox, DropboxStore, LocalStorageStore, Editor, FileList) {

var Workspace = function() {
    this.stores = { };
    this.fileLists = { };
    this.editor = new Editor();
};

Workspace.prototype.registerStore = function(store) {
    var storeName = store.getName();
    if (!(storeName in this.stores)) {
        this.stores[storeName] = store;
        this.fileLists[storeName] = new FileList(store, this.editor);
    }
};

Workspace.prototype.setupEditor = function() {
    this.editor.setupStores(this.stores);
};

Workspace.prototype.destroy = function() {
    // TODO
};

Workspace.getDropboxWorkspace = function(ws, callback) {
    var consumerKey = "06rngr4earvyn5p";
    var consumerSecret = "w6mhnhbqg9qvkw0";
    var dropbox = new Dropbox(consumerKey, consumerSecret);

    dropbox.authorize((function() {
        var store = new DropboxStore(dropbox);
        ws.registerStore(store);

        if (callback) {
            callback.call(this, workspace);
        }
    }).bind(this));

    return true;
};

Workspace.getLocalStorageWorkspace_A = function(ws, callback) {
    var store = new LocalStorageStore('A');
    ws.registerStore(store);
    if (callback) {
        callback.call(this, workspace);
    }
};

Workspace.getLocalStorageWorkspace_B = function(ws, callback) {
    var store = new LocalStorageStore('B');
    ws.registerStore(store);
    if (callback) {
        callback.call(this, workspace);
    }
};

Workspace.getAllWorkspace = function(callback) {
  var methods = [
    Workspace.getLocalStorageWorkspace_A
  ];
  var retval = true;
  var ws = new Workspace();
  for (var i = 0; i < methods.length; ++i) {
    if (!methods[i](ws, callback)) {
        retval = false;
    }
  }
  ws.setupEditor();
  return retval;
};

return Workspace;

});

