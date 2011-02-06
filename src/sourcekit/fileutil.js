define("sourcekit/fileutil", function() {

var FileUtil = {
    basename: function(path) {
        return path.replace(/\\/g,'/').replace( /.*\//, '' );
    },
    
    uniqueIdByPath: function(path) {
        // TODO: BUG!! Use a hashing algorithm for this!
        return path.replace(/[ \/\.]/g, '_');
    }
    
}

return FileUtil;

});