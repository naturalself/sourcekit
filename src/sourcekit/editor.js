define('sourcekit/editor', 
        ['sourcekit/fileutil', 
        'ace/editor',
        'ace/edit_session',
        'ace/undomanager',
        "ace/virtual_renderer", 
        "ace/theme/twilight"], 
        function(FileUtil) {

dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.Toolbar");

var AceEditor = require("ace/editor").Editor;
var AceEditSession = require("ace/edit_session").EditSession;
var AceUndoManager = require("ace/undomanager").UndoManager;

var Renderer = require("ace/virtual_renderer").VirtualRenderer;
var theme = require("ace/theme/twilight");
var blankSession = new AceEditSession("");

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
    dojo.connect(this.tabContainer, "removeChild", this.onCloseTab.bind(this));
    dojo.connect(window, "onresize", this.onResize.bind(this));
}

Editor.prototype.openFile = function(item) {
    var id = FileUtil.uniqueIdByPath(item.path);
    
    if (!this.sessions[id]) {
        this.editor.setSession(blankSession);
        
        // Load the content
        this.dropbox.getFileContents(item.path, (function(data) {
            this.sessions[id] = new AceEditSession(data);
            this.sessions[id].setUndoManager(new AceUndoManager());
            this.editor.setSession(this.sessions[id]);
        }).bind(this));

        // Deal with the UI
        var editorContentPane = new dijit.layout.ContentPane({
            title: FileUtil.basename(item.path),
            content: "",
            closable: true,
            id: id
        });
        
        var editorToolbar = new dijit.Toolbar({
            id: id + "_toolbar"
        });
        
        saveButton = new dijit.form.Button({
            label: "Save",
            showLabel: true,
            iconClass: "dijitIconFile"
        });
        editorToolbar.addChild(saveButton);
        editorContentPane.domNode.appendChild(editorToolbar.domNode);

        this.tabContainer.addChild(editorContentPane);
        this.tabContainer.selectChild(editorContentPane, true);
    } else {
        this.tabContainer.selectChild(id, true);
    }
}

Editor.prototype.onResize = function(event) {
    contentBox = dojo.contentBox(this.editorContainer.parentNode);
    
    if (dojo.byId(this.editorContainer.parentNode.id + "_toolbar")) {
        toolbarMarginBox = dojo.marginBox(dojo.byId(this.editorContainer.parentNode.id + "_toolbar"));
        contentBox.h = contentBox.h - toolbarMarginBox.h;
        dojo.contentBox(this.editorContainer, contentBox);
        this.editor.resize();
    }
}

Editor.prototype.onSelectTab = function(tab) {
    this.editorContainer.style.display = "block";
    
    if (typeof tab == 'string') {
        tab = dijit.byId(tab);
    }
    
    if (this.sessions[tab.id]) {
        this.editor.setSession(this.sessions[tab.id]);
    }
    
    dojo.connect(tab, "resize", this.onResize.bind(this));
    tab.domNode.appendChild(this.editorContainer);
    this.tabContainer.resize();
    this.editor.focus();
}

Editor.prototype.onCloseTab = function(tab) {
    
    
    if (typeof tab == 'string') {
        tab = dijit.byId(tab);
    }
    
    if (this.sessions[tab.id]) {
        delete this.sessions[tab.id];
    }
    
    if (this.tabContainer.getChildren().length > 0) {
        var index = this.tabContainer.forward();
    } else {
        dojo.body().appendChild(this.editorContainer);
        this.editorContainer.style.display = "none";
    }
}

return Editor;

});