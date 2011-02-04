define("sourcekit/filelist/store", function() {

var FileListStore = function(dropbox) {
    this.dropbox = dropbox;

    return {
        getValue: function(item, attribute, defaultValue) {},
        getValues: function(item, attribute) {},
        getAttributes: function(item) {},
        hasAttribute: function(item, attribute) {},
        containsValue: function(item, attribute, value) {},
        isItem: function(something) {},
        isItemLoaded: function(something) {},
        loadItem: function(keywordArgs) {},
        fetch: function(keywordArgs) {},
        getFeatures: function() {},
        close: function(request) {},
        getLabel: function(item) {},
        getLabelAttributes: function(item) {}
    }
}

return FileListStore;

});