define("sourcekit/filelist", 
        ["dropbox/dropbox", "sourcekit/filelist/store"], 
        function(Dropbox, FileListStore) {

dojo.require("dijit.Tree");
dojo.require("dijit.form.Button");
dojo.require("dijit.Toolbar");
dojo.require("dijit.MenuBar");

var FileList = function(editor, dropbox) {
    this.dropbox = dropbox;
    this.editor = editor;
    dojo.addOnLoad(this.setupInterface.bind(this));
};

FileList.prototype.setupInterface = function() {
    var store = new FileListStore(this.dropbox);
    
    var treeModel = new dijit.tree.ForestStoreModel({
        store: store,
        query: { "path": "/" },
        rootId: "root",
        rootLabel: "Dropbox",
        childrenAttrs: ["children"],
        deferItemLoadingUntilExpand: true
    });

    // Set up the Tree view and hook up events
    var fileListTree = new dijit.Tree({ 
        model: treeModel, 
        showRoot: false,
        openOnClick: true
    }, "fileListTree");
    
    dojo.connect(fileListTree, "onClick", this, function(item, node, event) {
        this.editor.openFile(item);
    });
    
    var toolbar = new dijit.Toolbar({}, "fileListToolbar");
    newFileButton = new dijit.form.Button({
        label: "New File",
        showLabel: false,
        iconClass: "dijitIconFile"
    });
    
    newFolderButton = new dijit.form.Button({
        label: "New Folder",
        showLabel: false,
        iconClass: "dijitIconFolderClosed"
    });
    
    newDeleteButton = new dijit.form.Button({
        label: "Delete",
        showLabel: false,
        iconClass: "dijitIconDelete"
    });
    
    toolbar.addChild(newFileButton);
    toolbar.addChild(newFolderButton);
    toolbar.addChild(newDeleteButton);
}

return FileList;

});