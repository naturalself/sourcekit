define('sourcekit/editor/theme_options', [
        'ace/theme/clouds',
        'ace/theme/clouds_midnight',
        'ace/theme/cobalt',
        'ace/theme/dawn',
        'ace/theme/eclipse',
        'ace/theme/idle_fingers',
        'ace/theme/kr_theme',
		'ace/theme/merbivore',
		'ace/theme/merbivore_soft',
        'ace/theme/mono_industrial',
        'ace/theme/monokai',
        'ace/theme/pastel_on_dark',
        'ace/theme/textmate',
        'ace/theme/twilight',
        'ace/theme/vibrant_ink',
    ], function() {

return {
    
    options: [
        { label: 'Clouds', value: 'clouds' },
        { label: 'Clouds Midnight', value: 'clouds_midnight' },
        { label: 'Cobalt', value: 'cobalt' },
        { label: 'Dawn', value: 'dawn' },
        { label: 'Eclipse', value: 'eclipse' },
        { label: 'Idle Fingers', value: 'idle_fingers' },
        { label: 'KR Theme', value: 'kr_theme' },
		{ label: 'Merbivore', value: 'merbivore' },
		{ label: 'Merbivore Soft', value: 'merbivore_soft' },
        { label: 'Mono Industrial', value: 'mono_industrial' },
        { label: 'Monokai', value: 'monokai' },
        { label: 'Pastel on Dark', value: 'pastel_on_dark' },
        { label: 'Textmate', value: 'textmate' },
        { label: 'Twilight', value: 'twilight'},
        { label: 'Vibrant Ink', value: 'vibrant_ink'}
    ],
    
    findOptions: function(selectedTheme) {
        for (var key in this.options) {
            if (selectedTheme == this.options[key].value) {
                this.options[key].selected = true;
            } else {
                this.options[key].selected = false;
            }
        }
        return this.options;
    },
    
    getThemeByName: function(themeName) {
        return require("ace/theme/" + themeName);
    }
    
}});
