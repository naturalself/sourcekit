$(document).ready(function() {
	EventBroker.subscribe("ready.editor", function() {
		$('body').layout({ 
			applyDefaultStyles: true,
			center__applyDefaultStyles: false,
			onresize: function() { EventBroker.publish("redraw.editor"); }
		});
		
		EventBroker.publish("redraw.editor");

		$('#tabs').tabs({
			add: function( event, ui ) {
				$( ui.panel ).append( "<div class=\"bespin\" id=\"editor\" data-bespinoptions='{ \"settings\": { \"tabstop\": 4 }, \"stealFocus\": true }'></div>" );
			}
		});
		
		$("#tabs span.ui-icon-close").live( "click", function() {
			var index = $( "li", $("#tabs") ).index( $(this).parent() );
			$("#tabs").tabs( "remove", index );
		});
		
		$('#tabs').tabs("add", "#tabs-2", "hello");
	});
	

});
