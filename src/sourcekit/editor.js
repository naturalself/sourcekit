define('sourcekit/editor', 
        ['sourcekit/fileutil', 
        'ace/editor',
        'ace/edit_session', 
        "ace/virtual_renderer", 
        "ace/theme/twilight"], 
        function(FileUtil) {

dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.TabContainer");

var AceEditor = require("ace/editor").Editor;
var AceEditSession = require("ace/edit_session").EditSession;
var Renderer = require("ace/virtual_renderer").VirtualRenderer;
var theme = require("ace/theme/twilight");

var Editor = function(dropbox, editorEnv) {
    this.dropbox = dropbox;
    this.sessions = {};
    dojo.addOnLoad(this.setupInterface.bind(this));
};

Editor.prototype.setupInterface = function() {
    this.tabContainer = dijit.byId("editorTabContainer");

    var theme = require("ace/theme/twilight");
    this.editorContainer = dojo.byId("editorContainer");
    this.editor = new AceEditor(new Renderer(this.editorContainer, theme));

    dojo.connect(this.tabContainer, "selectChild", this.onSelectTab.bind(this));
    dojo.connect(window, "onresize", this.onResize.bind(this));
}

Editor.prototype.openFile = function(item) {
    var id = FileUtil.uniqueIdByPath(item.path);
    
    if (!this.sessions[id]) {
        // Load the content
        this.dropbox.getFileContents(item.path, (function(data) {
            this.sessions[id] = new AceEditSession(data);
            this.editor.setSession(this.sessions[id]);
        }).bind(this));

        // Deal with the UI
        var editorContentPane = new dijit.layout.ContentPane({
            title: FileUtil.basename(item.path),
            content: "",
            closable: true,
            id: id
        });

        this.tabContainer.addChild(editorContentPane);
        this.tabContainer.selectChild(editorContentPane, true);
    } else {
        this.tabContainer.selectChild(id, true);
    }
}

Editor.prototype.onResize = function(event) {
    contentBox = dojo.contentBox(this.editorContainer.parentNode);
    dojo.contentBox(this.editorContainer, contentBox);
    this.editor.resize();
}

Editor.prototype.onSelectTab = function(tab) {
    this.editorContainer.style.display = "block";
    this.editorContainer.focus();    
    
    if (typeof tab == 'string') {
        tab = dijit.byId(tab);
    }
    
    if (this.sessions[tab.id]) {
        this.editor.setSession(this.sessions[tab.id]);
    }
    
    dojo.connect(tab, "resize", this.onResize.bind(this));
    tab.domNode.appendChild(this.editorContainer);
    this.onResize();
}

return Editor;

});