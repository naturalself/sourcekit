define('sourcekit/editor/wordwrap_options', function() {

return {
    options: [
        { label: 'No Wrapping', value: ' ' },
        { label: '80 Chars', value: '80' },
        { label: '120 Chars', value: '120' }
    ],
    
    findOptions: function(selected) {
        for (var key in this.options) {
            if (selected == this.options[key].value) {
                this.options[key].selected = true;
            } else {
                this.options[key].selected = false;
            }
        }
        return this.options;
    }
    
}});
