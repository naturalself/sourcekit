define("sourcekit/filelist", 
        ["dropbox/dropbox", "sourcekit/filelist/store"], 
        function(Dropbox, FileListStore) {

dojo.require("dijit.Tree");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.DropDownButton");
dojo.require("dijit.Dialog");
dojo.require("dijit.TooltipDialog");
dojo.require("dijit.Toolbar");
dojo.require("dijit.MenuBar");
dojo.require("dijit.Menu");
dojo.require("dijit.MenuItem");

var FileList = function(editor, dropbox) {
    this.dropbox = dropbox;
    this.editor = editor;
    this.fileNodeInContext = null;
    
    dojo.addOnLoad(this.setupInterface.bind(this));
};

FileList.prototype.setupInterface = function() {
    this.store = new FileListStore(this.dropbox);
    
    this.treeModel = new dijit.tree.TreeStoreModel({
        store: this.store,
        root: { label: "Dropbox", path: '/', children: [] },
        childrenAttrs: ["children"],
        deferItemLoadingUntilExpand: true
    });

    // Set up Dialogs
    this.newFileName = dijit.byId("newFileName");    
    this.newFileDialog = dijit.byId("newFileDialog");
    this.newFileDialogOkButton = dijit.byId("newFileDialogOkButton");

    dojo.connect(this.newFileDialogOkButton, "onClick", (function() {
        var parentItem = null;
            
        if (this.fileNodeInContext.item.is_dir) {
            parentItem = this.fileNodeInContext.item;
        } else if (this.fileNodeInContext.getParent() != null) {
            parentItem = this.fileNodeInContext.getParent().item;
        } else {
            parentItem = this.treeModel.root;
        }
            
        var item = { path: (parentItem.path + "/" + this.newFileName.get('value')).replace(/\/+/g, '/') };
        
        this.newFile(item, parentItem);
    }).bind(this));
    
    this.newFolderName = dijit.byId("newFolderName");
    this.newFolderDialog = dijit.byId("newFolderDialog");
    this.newFolderDialogOkButton = dijit.byId("newFolderDialogOkButton");
    
    dojo.connect(this.newFolderDialogOkButton, "onClick", (function() {
        var parentItem = null;
            
        if (this.fileNodeInContext.item.is_dir) {
            parentItem = this.fileNodeInContext.item;
        } else if (this.fileNodeInContext.getParent() != null) {
            parentItem = this.fileNodeInContext.getParent().item;
        } else {
            parentItem = this.treeModel.root;
        }
            
        var item = { path: (parentItem.path + "/" + this.newFolderName.get('value')).replace(/\/+/g, '/'), is_dir: true, children: [] };
        
        this.newFolder(item, parentItem);
    }).bind(this));

    // Set up the Tree view and hook up events
    this.fileListTree = new dijit.Tree({
        model: this.treeModel, 
        //showRoot: false,
        openOnClick: true
    }, "fileListTree");
    
    dojo.connect(this.fileListTree, "onClick", this, function(item, node, event) {
        this.editor.openFile(item);
    });
    
    this.fileListContextMenu = new dijit.Menu({
       targetNodeIds: ["fileListTree"]
    });
    
    this.fileListContextMenu.addChild(new dijit.MenuItem({
        iconClass: "dijitEditorIcon dijitEditorIconNewPage",
        label: "New File...",
        onClick: (function() {
            this.newFileDialog.show();
        }).bind(this)
    }));
    
    this.fileListContextMenu.addChild(new dijit.MenuItem({
        iconClass: "dijitIconFolderClosed",
        label: "New Folder...",
        onClick: (function() {
            this.newFolderDialog.show();
        }).bind(this)
    }));
    
    this.fileListContextMenu.addChild(new dijit.MenuItem({
        iconClass: "dijitIconDelete",
        label: "Delete",
        disabled: true
    }));
    
    dojo.connect(this.fileListContextMenu, "_openMyself", this, function(e) {
        // get a hold of, and log out, the tree node that was the source of this open event
        var tn = dijit.getEnclosingWidget(e.target);
        this.fileNodeInContext = tn;
    });
}

FileList.prototype.newFile = function(item, parentItem) {
    this.treeModel.store.newItem(item, { parent: parentItem, attribute: 'children' });
}

FileList.prototype.newFolder = function(item, parentItem) {
    this.treeModel.store.newItem(item, { parent: parentItem, attribute: 'children' });
}


return FileList;

});