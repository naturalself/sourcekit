define("sourcekit/application", [
	"sourcekit/workspace",
	"dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dijit/layout/TabContainer",
    "dijit/Dialog",
    "dijit/form/Select"], function (Workspace) {

/*dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.BorderContainer");*/

var Application = {};

Application.start = function() {
    var workspace = Workspace.getAllWorkspace();
};

return Application;

});

