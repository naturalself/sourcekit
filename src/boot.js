var deps = [
    "pilot/plugin_manager",
    "pilot/settings",
    "pilot/environment",
    "sourcekit/application"
];

var plugins = [
    "pilot/index",
    "cockpit/index",
    "ace/defaults"
];

require(deps, function(Application) {
    var catalog = require("pilot/plugin_manager").catalog;

    catalog.registerPlugins(plugins).then(function() {
        var env = require("pilot/environment").create();
        catalog.startupPlugins({ env: env }).then(function() {
            require("sourcekit/application").start();
        });
    });
});