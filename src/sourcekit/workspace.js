define('sourcekit/workspace', [
    'dropbox/dropbox',
    'sourcekit/data/dropbox_store',
    'sourcekit/data/localStorage_store',
    'sourcekit/data/extension_store',
    'sourcekit/editor',
    'sourcekit/filelist'], function (Dropbox, DropboxStore, LocalStorageStore, ExtensionStore, Editor, FileList) {

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
            callback.call(this, ws);
        }
    }).bind(this));

    return true;
};

Workspace.getLocalStorageWorkspace = function(ws, callback) {
    var store = new LocalStorageStore();
    ws.registerStore(store);
    if (callback) {
        callback.call(this, ws);
    }
  return true;
};

Workspace.getExtensionWorkspaces = function(ws, callback) {
  var bgPage = chrome.extension.getBackgroundPage();
  for (var id in bgPage._registeredStorageExtensions) {
    var store = new ExtensionStore(
      id, bgPage._registeredStorageExtensions[id]);
    ws.registerStore(store);
    if (callback) {
      callback.call(this, ws);
    }
  }
  return true;
};

Workspace.getAllWorkspace = function(callback) {
  var methods = [
    Workspace.getLocalStorageWorkspace,
    Workspace.getExtensionWorkspaces
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

