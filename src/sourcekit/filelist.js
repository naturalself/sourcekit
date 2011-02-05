define("sourcekit/filelist", ["dropbox/dropbox", "sourcekit/filelist/store"], function(Dropbox, FileListStore) {

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.Tree");
dojo.require("dijit.form.Button");
dojo.require("dijit.Toolbar");
dojo.require("dijit.MenuBar");

var FileList = function(dropbox) {
    this.dropbox = dropbox;
    
    dojo.addOnLoad(this.setupInterface.bind(this));
};

FileList.prototype.setupInterface = function() {
    
    var store = new FileListStore(this.dropbox);
        
    var treeModel = new dijit.tree.ForestStoreModel({
        store: store,
        query: { "path": "/" },
        rootId: "root",
        rootLabel: "Dropbox",
        childrenAttrs: ["children"]
    });

    new dijit.Tree({ model: treeModel, showRoot: false }, "fileListTree");
    var toolbar = new dijit.Toolbar({}, "fileListToolbar");
    cutButton = new dijit.form.Button({}, "cutButton");
}


return FileList;

});