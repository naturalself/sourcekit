define('sourcekit/editor', function() {

dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.TabContainer");

var Editor = function(dropbox) {
    this.dropbox = dropbox;
    dojo.addOnLoad(this.setupInterface.bind(this));
};

Editor.prototype.setupInterface = function() {
    
}

Editor.prototype.openFile = function(item) {
    console.log("GOT IT!", item.path);
}

return Editor;

});