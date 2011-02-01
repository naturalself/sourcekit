define('sourcekit/editor', function() {

dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.TabContainer");

var Editor = function() {
    this.setupInterface();
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
    
    this.tabContainer = new dijit.layout.TabContainer({style: "height: 100%; width: 100%;"}, "editorTabContainer");
    var pane = new dijit.layout.ContentPane({ title:"Remote Content", content:"YO" });
    this.tabContainer.addChild(pane);
    this.tabContainer.selectChild(pane);
    
    var pane2 = new dijit.layout.ContentPane({ title:"Remote Content", content:"YO" });
    this.tabContainer.addChild(pane2);
    this.tabContainer.selectChild(pane2);

}

return Editor;

});