define("sourcekit/filelist", function() {

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.Tree");
dojo.require("dijit.form.Button");
dojo.require("dijit.Toolbar");
dojo.require("dijit.MenuBar");

var FileList = function() {
    dojo.addOnLoad(this.setupInterface);
};

FileList.prototype.setupInterface = function() {
    var store = new dojo.data.ItemFileReadStore({ url: "/src/sourcekit/countries.js" });
        
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