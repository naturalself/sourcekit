define('sourcekit/editor', function() {

dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.TabContainer");

var Editor = function() {
    dojo.addOnLoad(this.setupInterface.bind(this));
};

Editor.prototype.setupInterface = function() {
}

return Editor;

});