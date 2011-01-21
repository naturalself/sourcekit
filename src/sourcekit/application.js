goog.provide("sourcekit.Application");

goog.require("goog.dom");
goog.require("goog.ui.SplitPane");
goog.require("goog.ui.tree.TreeControl");
goog.require("goog.ui.TabBar");
goog.require("goog.ui.Tab");

sourcekit.Application = function() {
    
}

sourcekit.Application.run = function() {
    var tabBar = new goog.ui.TabBar();
    tabBar.decorate(goog.dom.getElement("top"));

   /* var treeConfig = goog.ui.tree.TreeControl.defaultConfig;
    tree = new goog.ui.tree.TreeControl('root', treeConfig);
    
    tree.render(goog.dom.getElement('treeContainer'));*/
//    var sp = new goog.ui.SplitPane(tree, tabBar);
 
}