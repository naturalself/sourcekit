$(document).ready(function() {
	EventBroker.subscribe("ready.editor", function() {
		$('body').layout({ 
			applyDefaultStyles: true,
			center__applyDefaultStyles: false,
			onresize: function() { EventBroker.publish("redraw.editor"); }
		});
		
		EventBroker.publish("redraw.editor");

		$('#tabs').tabs({
			select: function(event, ui) {
				EventBroker.publish("select_tab.editor", [ui.index]);
				$(ui.panel).append($("#editor"));
			}
		});
		
		$("#tabs span.ui-icon-close").live("click", function() {
			var index = $("li", $("#tabs")).index($(this).parent());
			$("#tabs").tabs("remove", index);
		});
		
		$('#tabs').tabs("add", "#tabs-2", "hello");
		$('#tabs').tabs("select", "#tabs-2");
	
	});
	

});
