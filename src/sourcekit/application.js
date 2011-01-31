define('sourcekit/application', ['dropbox/dropbox'], function (Dropbox) {
    consumerKey = "0660jgq6erg4h63";
    consumerSecret = "0iyu9q1lnb56jyg";
    dropbox = new Dropbox(consumerKey, consumerSecret);
    
    if (!dropbox.isAccessGranted()) {
        chrome.tabs.getCurrent(function(tab) {
            chrome.tabs.create({ url: "options.html", selected: true });
            chrome.tabs.remove(tab.id);
        });
    }
    
    dojo.require("dijit.layout.ContentPane");
    dojo.require("dijit.layout.BorderContainer");
    dojo.require("dijit.layout.TabContainer");
    dojo.require("dojo.data.ItemFileReadStore");
    dojo.require("dijit.Tree");
    dojo.require("dijit.form.Button");
    dojo.require("dijit.Toolbar");
    dojo.require("dijit.MenuBar");

    return {
        start: function() {
            var borderContainer = new dijit.layout.BorderContainer();
            var tabContainer = new dijit.layout.TabContainer();
            var contentContainer = new dijit.layout.ContentPane();
            contentContainer.content = "HOHOHO";
            var editor = new CodeMirror(dojo.query("#editorPane")[0], {
                parserfile: ["parsedummy.js"],
                path: "../src/codemirror/",
                stylesheet: ["css/codemirror/xmlcolors.css", "css/codemirror/jscolors.css", "css/codemirror/csscolors.css"],
                autoMatchParens : true,
                height : '100%',
                content: 'test',
                textWrapping: false,
                lineNumbers: true,
                breakPoints: false,
            });
            
            var store = dojo.data.ItemFileReadStore({ url: "/src/sourcekit/countries.js" });
            
            var treeModel = new dijit.tree.ForestStoreModel({
                store: store,
                query: {
                   "type": "continent"
                },
                rootId: "root",
                rootLabel: "Continents",
                childrenAttrs: ["children"]
            });
            
            new dijit.Tree({ model: treeModel, showRoot: false }, "treeOne");
            var toolbar = new dijit.Toolbar({}, "treeToolbar");
            cutButton = new dijit.form.Button({}, "cutButton");
        }
    }
});

