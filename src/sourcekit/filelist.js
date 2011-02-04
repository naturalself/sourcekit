define("sourcekit/filelist", ["dropbox/dropbox", "sourcekit/filelist/store"], function(Dropbox, FileListStore) {

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.Tree");
dojo.require("dijit.form.Button");
dojo.require("dijit.Toolbar");
dojo.require("dijit.MenuBar");

var FileList = function(dropbox) {
    this.dropbox = dropbox;
    
    this.dropbox.getDirectoryContents("", function(data) {
        data.contents
    });
    
    dojo.addOnLoad(this.setupInterface);
};

FileList.prototype.setupInterface = function() {
    var store = new FileListStore(this.dropbox);
        
    var treeModel = new dijit.tree.ForestStoreModel({
        store: store,
        query: {
           "type": "continent"
        },
        rootId: "root",
        rootLabel: "Continents",
        childrenAttrs: ["children"]
    });

    new dijit.Tree({ model: treeModel, showRoot: false }, "fileListTree");
    var toolbar = new dijit.Toolbar({}, "fileListToolbar");
    cutButton = new dijit.form.Button({}, "cutButton");
}


return FileList;

});