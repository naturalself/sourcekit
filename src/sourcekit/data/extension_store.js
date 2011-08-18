define("sourcekit/data/extension_store", ['sourcekit/fileutil'], function(FileUtil) {

function ExtensionStore(id, name) {
    function _callExtension(method, request, callback) {
      var real_request = {};
      for (var k in request) {
        real_request[k] = request[k];
      }
      real_request['method'] = method;
      chrome.extension.sendRequest(id, real_request, callback);
    }
    return {
        getName: function() { return name; },
        getValue: function(item, attribute, defaultValue) {
          if (item[attribute]) {
            // 'content' is already in 'item' field, so we don't
            // need to treat it here especially.
            return item[attribute];
          }
          return defaultValue;
        },
        getValues: function(item, attribute) {
            return (item[attribute] || []).slice(0);
        },
        getContent: function(item, callback) {
          console.log(item);
          _callExtension('getContent', item,
                         function (result) { callback(result.content); });
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
            }

            return result;
        },
        loadItem: function(keywordArgs) {
            var scope = keywordArgs.scope || dojo.global;

            if (keywordArgs.item) {
                var item = keywordArgs.item;

                if ((item.is_dir || item.root != null)) {
                  _callExtension('getDirectoryContent', item,
                                 function(result) {
                                   if (!item.children) {
                                     item.children = [];
                                   }
                                   item.children = item.children.concat(
                                     result.children);
                                   item.loaded = true;
                                   keywordArgs['onItem'].call(scope, item);
                                 });
                } else {
                  item.loaded = true;
                  keywordArgs['onItem'].call(scope, item);
                }
            }

            return true;
        },

        // Initial Fetch
        fetch: function(keywordArgs) {
            var path = keywordArgs.query.path;
            var scope = keywordArgs.scope || dojo.global;

          _callExtension(
            'getDirectoryContent', {path: path},
            function(result) {
              if (keywordArgs.onBegin) {
                  keywordArgs['onBegin'].call(
                      scope, result.children.length, keywordArgs);
              }
              if (keywordArgs.onItem){
                for (var i = 0; i < data.chlidren.length; ++i){
                  keywordArgs["onItem"].call(
                    scope, result.children[i], keywordArgs);
                }
                if (keywordArgs.onComplete) {
                  keywordArgs["onComplete"].call(scope, keywordArgs);
                }
              } else if (keywordArgs.onComplete){
                keywordArgs["onComplete"].call(
                  scope, result.children, keywordArgs);
              }
            });
        },
        getFeatures: function() {
            return {
                'dojo.data.api.Read':true,
                'dojo.data.api.Identity':true,
                'dojo.data.api.Write':true,
                'dojo.data.api.Notification':true
            };
        },
        close: function(request) { console.log('Not Implemented Yet'); },
        getLabel: function(item) {
            if (item.label) {
                return item.label;
            }

            return FileUtil.basename(item.path);
        },
        getLabelAttributes: function(item) { console.log('Not Implemented Yet'); },

        /* Identity API */
        getIdentity: function(item) {
            return item.path;
        },
        getIdentityAttributes: function(/* item */ item) { console.log('Not Implemented Yet'); },
        fetchItemByIdentity: function(keywordArgs) { console.log('Not Implemented Yet'); },

        /* Write API */
        newItem: function(keywordArgs, parentInfo) {
            var item = keywordArgs;

            // Checking for dups
            var children = parentInfo.parent[parentInfo.attribute];
            for (key in children) {
                if (children[key].path == item.path) {
                    console.log('filename duplication');
                    return false;
                }
            }

            var onSuccess = (function() {
              var onNewParentInfo = {
                item: parentInfo.parent,
                attribute: parentInfo.attribute,
                oldValue: null,
                newValue: item
              };
              this.onNew(item, onNewParentInfo);
            }).bind(this);

          _callExtension('newItem', item, onSuccess);
          item.loaded = true;
          children.push(item);
          children.sort(function(a, b) { return a.path.toLowerCase() > b.path.toLowerCase() ? 1 : -1 });

          return item;
        },

        deleteItem: function(item) {
          _callExtension('deleteItem', item, (function(response) {
            if (response.result) {
              this.onDelete(item);
            } else {
              console.log('fail');
            }
          }).bind(this));
          return item;
        },

        setValue: function(item, attribute, value) {
          var oldValue = null;
          if (item[attribute]) {
            oldValue = item[attribute];
          }

          item[attribute] = value;

          if (attribute == "content") {
            _callExtension('setContent', item, (function(response) {
              if (response.result) {
                this.onSet(item, attribute, oldValue, value);
              } else {
                console.log('fail');
              }
            }).bind(this));
          }
        },

        setValues: function(item, attribute, values) {
            item[attribute] = values;
        },

        unsetAttribute: function(/* item */ item, /* string */ attribute) {
            console.log('Not implemented yet');
        },

        save: function(keywordArgs) {
            console.log('Not implemented yet');
        },

        revert: function() {
            console.log('Not implemented yet');
        },

        isDirty: function(/* item? */ item) {
            console.log('Not implemented yet');
        },

        /* Notification API */
        onSet: function(item, attribute, oldValue, newValue) { },

        onNew: function(newItem, parentInfo) { },

        onDelete: function(deletedItem) { }
    };
};

return ExtensionStore;

});
