define('sourcekit/editor', function() {

dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.TabContainer");

var Editor = function() {
    dojo.addOnLoad(this.setupInterface);
};

Editor.prototype.setupInterface = function() {
    /*var editor = new CodeMirror(dojo.query("#editorPane")[0], {
        parserfile: ["parsedummy.js"],
        path: "../src/codemirror/",
        stylesheet: ["css/codemirror/xmlcolors.css", "css/codemirror/jscolors.css", "css/codemirror/csscolors.css"],
        autoMatchParens : true,
        height : '100%',
        content: 'test',
        textWrapping: false,
        lineNumbers: true,
        breakPoints: false,
    });*/
    
}

return Editor;

});