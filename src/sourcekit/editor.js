define('sourcekit/editor', 
        ['sourcekit/fileutil', 
        'ace/editor', 
        "ace/virtual_renderer", 
        "ace/theme/textmate"], 
        function(FileUtil) {

dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.TabContainer");

var AceEditor = require("ace/editor").Editor;
var Renderer = require("ace/virtual_renderer").VirtualRenderer;
var theme = require("ace/theme/textmate");

var Editor = function(dropbox, editorEnv) {
    this.dropbox = dropbox;
    dojo.addOnLoad(this.setupInterface.bind(this));
};

Editor.prototype.setupInterface = function() {
    this.tabContainer = dijit.byId("editorTabContainer");
}

Editor.prototype.openFile = function(item) {
    console.log("GOT IT!", item.path);
    
    var editorContentPane = new dijit.layout.ContentPane({
        title: FileUtil.basename(item.path),
        content: dojo.create("div", {id: 'editor', style: 'width: 100%; height: 100%'}),
        closable: true
    });

    this.tabContainer.addChild(editorContentPane);
    var theme = require("ace/theme/textmate");
    var container = document.getElementById("editor");
    var editor = new AceEditor(new Renderer(container, theme));

    dojo.connect(window, "onResize", editor.resize.bind(editor));
    editor.resize();
}

return Editor;

});