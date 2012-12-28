dojo.require('dijit.layout.BorderContainer');
dojo.require('dijit.layout.ContentPane');
dojo.require('dijit.layout.TabContainer');
dojo.require('dijit.Dialog');
dojo.require('dijit.form.Select');

var config = {
    baseUrl: "/src",
}

var deps = [
    "sourcekit/application",
];

require(config, deps, function(Application) {
    Application.start();
});