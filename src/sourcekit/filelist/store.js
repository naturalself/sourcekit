define("sourcekit/filelist/store", function() {

var FileListStore = function(dropbox) {
    var _dropbox = dropbox;
    var _arrayOfAllItems = [];

    return {
        getValue: function(item, attribute, defaultValue) { console.log('Not Implemented Yet'); },
        getValues: function(item, attribute) {
            return (item[attribute] || []).slice(0); 
        },
        getAttributes: function(item) { console.log('Not Implemented Yet'); },
        hasAttribute: function(item, attribute) { 
            return item[attribute] != null;
        },
        containsValue: function(item, attribute, value) { console.log('Not Implemented Yet'); },
        isItem: function(something) { console.log('Not Implemented Yet'); },
        isItemLoaded: function(something) {            
            var result = false;
            
            if (something && something.loaded) {
                result = something.loaded;
                something.loaded = false;
            }
            
            return result;
        },
        loadItem: function(keywordArgs) { 
            var scope = keywordArgs.scope || dojo.global;
            
            if (keywordArgs.item) {
                var item = keywordArgs.item;

                if (!item.loaded) {
                    _dropbox.getDirectoryContents(item.path, function(data) {
                        for (i in data.contents) {
                            if (data.contents[i].is_dir) {
                                data.contents[i].children = [];
                                data.contents[i].loaded = false;
                            } else {
                                _arrayOfAllItems[data.contents[i].path] = true;
                                data.contents[i].loaded = true;
                            }
                    
                            item.children.push(data.contents[i]);
                        }
                    
                        item.loaded = true;
                        keywordArgs['onItem'].call(scope, item);
                    });
                }
            }
            
            return true;
        },
        fetch: function(keywordArgs) { 
            var path = keywordArgs.query.path;
            var scope = keywordArgs.scope || dojo.global;
            
            _dropbox.getDirectoryContents(path, function(data) {
                for (i in data.contents) {
                    if (data.contents[i].is_dir) {
                        data.contents[i].children = [];
                        data.contents[i].loaded = false;
                    } else {
                        _arrayOfAllItems[data.contents[i].path] = true;
                        data.contents[i].loaded = true;
                    }
                }
                
                if (keywordArgs.onBegin) { 
                    keywordArgs['onBegin'].call(scope, data.contents.length, keywordArgs) 
                }
                
                if (keywordArgs.onItem){
                    for (i in data.contents){	
                        keywordArgs["onItem"].call(scope, data.contents[i], keywordArgs);
                    }
                    if (keywordArgs.onComplete) {
                        keywordArgs["onComplete"].call(scope, keywordArgs);
                    }
                } else if (keywordArgs.onComplete){
                    keywordArgs["onComplete"].call(scope, data.contents, keywordArgs);
                }
            });
        },
        getFeatures: function() { 
            return {'dojo.data.api.Read':true, 'dojo.data.api.Identity':true};;
        },
        close: function(request) { console.log('Not Implemented Yet'); },
        getLabel: function(item) { 
            return item.path.replace(/\\/g,'/').replace( /.*\//, '' );
        },
        getLabelAttributes: function(item) { console.log('Not Implemented Yet'); },
        
        /* Identity API */
        getIdentity: function(item) { 
            return item.path;
        },
        getIdentityAttributes: function(/* item */ item) { console.log('Not Implemented Yet'); },
        fetchItemByIdentity: function(keywordArgs) { console.log('Not Implemented Yet'); }
    }
}

return FileListStore;

});