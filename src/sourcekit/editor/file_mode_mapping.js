define('sourcekit/editor/file_mode_mapping', function() {

/*
            var extension = FileUtil.fileExtension(item.path);
            if (extension != null && FileModeMapping[extension] != null) {
                var Mode = require('ace/mode/' + FileModeMapping[extension]).Mode;
                this.sessions[id] = new AceEditSession(data, new Mode());
            }
*/

return {
    modes: {
        'c_cpp': { extensions: ['c', 'cpp', 'c++', 'm', 'h'], label: 'C / C++' },
        'csharp': { extensions: ['cs'], label: 'C#' },
        'coffee': { extensions: ['coffee'], label: 'CoffeeScript' },
        'css': { extensions: ['css'], label: 'CSS' },
        'html': { extensions: ['htm','html'], label: 'HTML' },
        'java': { extensions: ['java'], label: 'Java' },
        'javascript': { extensions: ['js'], label: 'Javascript' },
        'perl': { extensions: ['perl', 'pl'], label: 'Perl' },
        'php': { extensions: ['php', 'phtml', 'php3', 'php4'], label: 'PHP' },
        'python': { extensions: ['python', 'py'], label: 'Python' },
        'ruby': { extensions: ['rb', 'rhtml', 'erb'], label: 'Ruby' },
        'text': { extensions: ['*'], label: 'Plain Text' },
        'xml': { extensions: ['xml'], label: 'XML' }
    },
    
    findMode: function(extension) {
        for (var key in this.modes) {
            var scanExtensions = this.modes[key].extensions;
            for (var i in scanExtensions) {
                var scanExtension = scanExtensions[i];
                if (extension == scanExtension) {
                    return key;
                }
            }
        }
        
        return 'text';
    },
    
    findAllLabels: function(selectedMode) {
        var labelsOptions = [];
        for (var key in this.modes) {
            if (selectedMode == key) {
                labelsOptions.push({ label: this.modes[key].label, value: key, selected: true }); 
            } else {
                labelsOptions.push({ label: this.modes[key].label, value: key }); 
            }
        }
        return labelsOptions;
    }
}

});
