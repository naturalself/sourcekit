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
        console.log(item);
        this.editor.openFile(item);
    });
    
    var toolbar = new dijit.Toolbar({}, "fileListToolbar");
    cutButton = new dijit.form.Button({}, "cutButton");
}

return FileList;

});