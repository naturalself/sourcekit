define('sourcekit/application', function () {
    dojo.require("dijit.layout.ContentPane");
    dojo.require("dijit.layout.BorderContainer");
    dojo.require("dijit.layout.TabContainer");

    return {
        start: function() {
            var borderContainer = new dijit.layout.BorderContainer();
            var tabContainer = new dijit.layout.TabContainer();
            var contentContainer = new dijit.layout.ContentPane();
            contentContainer.content = "HOHOHO";
            
            var editor = new CodeMirror(dojo.query("#editor"));
            console.log(editor);
            
        }
    }
});

