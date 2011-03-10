define('sourcekit/editor', 
        ['sourcekit/fileutil',
        'sourcekit/notification',
        'sourcekit/editor/file_mode_options',
		'sourcekit/editor/options',
        'sourcekit/data/dropbox_store',        
        'ace/editor',
        'ace/edit_session',
        'ace/undomanager',
        'ace/virtual_renderer',
        ], 
        function(FileUtil, Notification, FileModeOptions, Options, DropboxStore) {

dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.Select");
dojo.require("dijit.Toolbar");

var AceEditor = require("ace/editor").Editor;
var AceEditSession = require("ace/edit_session").EditSession;
var AceUndoManager = require("ace/undomanager").UndoManager;

var Renderer = require("ace/virtual_renderer").VirtualRenderer;
var blankSession = new AceEditSession("");

var Editor = function(store) {
    this.store = store;
    this.sessions = {};
    dojo.addOnLoad(this.setupInterface.bind(this));
};

Editor.prototype.setupInterface = function() {
    dojo.connect(this.store, "onSet", this, function(item, attribute, oldValue, newValue) {
        if (attribute == "content") {
            Notification.notify('/resources/images/check.png', 'SourceKit Notification', 'File Saved!');
        }
    });
    
    this.introContainer = dojo.byId("introContainer");
    
    if (localStorage.getItem(Options.theme.key) == null) {
        localStorage.setItem(Options.theme.key, Options.theme.default);
    }
    
    this.editorContainer = dojo.byId("editorContainer");
    this.editor = new AceEditor(new Renderer(this.editorContainer, 
		Options.theme.getByName(localStorage.getItem(Options.theme.key)))
    );

    dojo.connect(window, "onresize", this.resize.bind(this));
    
    dojo.connect(window, "onkeydown", (function(keyEvent) {
        if (keyEvent.keyCode == 83 && (keyEvent.metaKey || keyEvent.ctrlKey)) {
            this.saveCurrentFile();
            dojo.stopEvent(keyEvent);
        }
    }).bind(this));
}

// Commands (called by application code)
Editor.prototype.openFile = function(item) {
    this.introContainer.style.display = "none";
    
    if (this.tabContainer == null) {
        this.tabContainer = new dijit.layout.TabContainer({
           id: "editorTabContainer",
           style: "height: 100%; width: 100%; padding: 0; border: none;"
        });
        
        dojo.connect(this.tabContainer, "selectChild", this.selectTab.bind(this));
        dojo.connect(this.tabContainer, "removeChild", this.closeTab.bind(this));
        
        dojo.body().appendChild(dojo.byId("introContainer"));
        dijit.byId("borderCenter").setContent(this.tabContainer);
    }
    
    this.tabContainer.domNode.style.display = "block";
    
    var id = FileUtil.uniqueIdByPath(item.path);
    
    if (!this.sessions[id]) {
        this.editor.setSession(blankSession);
        
        // Load the content
        var data = this.store.getValue(item, "content");
        var extension = FileUtil.fileExtension(item.path);
        var Mode = null;
        if (extension != null) {
            Mode = FileModeOptions.getModeByName(FileModeOptions.findModeName(extension));
        }
        
        if (Mode != null) {
            this.sessions[id] = new AceEditSession(data, new Mode());
        } else {
            this.sessions[id] = new AceEditSession(data);
        }
        this.sessions[id].setUndoManager(new AceUndoManager());
        this.sessions[id].path = item.path;
        this.sessions[id].item = item;
        this.editor.setSession(this.sessions[id]);

        // Deal with the UI
        var editorContentPane = new dijit.layout.ContentPane({
            title: FileUtil.basename(item.path),
            content: "",
            closable: true,
            id: id
        });
        
        // Create Toolbar
        var editorToolbar = new dijit.Toolbar({
            id: id + "_toolbar"
        });
        
        // Save Button
        saveButton = new dijit.form.Button({
            label: "Save",
            showLabel: true,
            iconClass: "dijitIconSave",
            onClick: this.saveCurrentFile.bind(this)
        });
        
        editorToolbar.addChild(saveButton);
        
        // Handle file type autodetection
        var extension = FileUtil.fileExtension(item.path);
        var defaultMode = FileModeOptions.findModeName(extension);
        
        //TODO FIX!
        // Add Syntax Highlighting Dropdown Menu
        var modeSelect = new dijit.form.Select({
            options: FileModeOptions.findOptions(defaultMode),
            onChange: (function(newValue) {
                var Mode = FileModeOptions.getModeByName(newValue);
                this.editor.getSession().setMode(new Mode());
            }).bind(this)
        });
        
        editorToolbar.addChild(modeSelect);
        
        var wordWrapSelect = new dijit.form.Select({
            options: Options.findOptions(Options.wordwrap.key, Options.wordwrap.options),
            onChange: (function(newValue) {
                localStorage.setItem(Options.wordwrap.key, newValue);
                if (newValue == ' ') {
					this.editor.getSession().setUseWrapMode(false);
					this.editor.getSession().setWrapLimitRange(0, 0);                    
                } else {
					this.editor.getSession().setUseWrapMode(true);
					this.editor.getSession().setWrapLimitRange(newValue, newValue);
                }
                
            }).bind(this)
        });
        
        editorToolbar.addChild(wordWrapSelect);
                
		// Add Theme Menu
        var themeSelect = new dijit.form.Select({
            options: Options.findOptions(localStorage.getItem(Options.theme.key), Options.theme.options),
            onChange: (function(newValue) {
                localStorage.setItem(Options.theme.key, newValue);
                this.editor.setTheme(Options.theme.getByName(newValue));
            }).bind(this)
        });
        
        editorToolbar.addChild(themeSelect);        
        editorContentPane.domNode.appendChild(editorToolbar.domNode);

        this.tabContainer.addChild(editorContentPane);
        this.tabContainer.selectChild(editorContentPane, true);
    } else {
        this.tabContainer.selectChild(id, true);
    }
}

Editor.prototype.saveCurrentFile = function() {
    var currentSession = this.sessions[this.tabContainer.selectedChildWidget.id];
    if (currentSession) {
        var path = currentSession.path;
        var content = currentSession.toString();
    
        this.store.setValue(currentSession.item, "content", content);
    }
}

Editor.prototype.resize = function(event) {
    contentBox = dojo.contentBox(this.editorContainer.parentNode);
    
    if (dojo.byId(this.editorContainer.parentNode.id + "_toolbar")) {
        toolbarMarginBox = dojo.marginBox(dojo.byId(this.editorContainer.parentNode.id + "_toolbar"));
        contentBox.h = contentBox.h - toolbarMarginBox.h;
        dojo.contentBox(this.editorContainer, contentBox);
        this.editor.resize();
    }
}

Editor.prototype.selectTab = function(tab) {
    this.editorContainer.style.display = "block";
    
    if (typeof tab == 'string') {
        tab = dijit.byId(tab);
    }
    
    if (this.sessions[tab.id]) {
        this.editor.setSession(this.sessions[tab.id]);
    }
    
    dojo.connect(tab, "resize", this.resize.bind(this));
    tab.domNode.appendChild(this.editorContainer);
    this.tabContainer.resize();
    this.editor.focus();
}

Editor.prototype.closeTab = function(tab) {
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
        this.tabContainer.destroy(false);
        this.tabContainer = null;
        this.introContainer.style.display = "block";
        dijit.byId("borderCenter").set('content', this.introContainer);
        this.editorContainer.style.display = "none";
    }
}

return Editor;

});