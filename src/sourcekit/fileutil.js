define("sourcekit/fileutil", function() {

var FileUtil = {
    basename: function(path) {
        return path.replace(/\\/g,'/').replace( /.*\//, '' );
    }
    
}

return FileUtil;

});