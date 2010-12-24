$(document).ready(function() {
	EventBroker.subscribe("ready.editor", function() {
		$('body').layout({ 
			applyDefaultStyles: true,
			center__applyDefaultStyles: false,
			onresize: function() { EventBroker.publish("redraw.editor"); }
		});
		
		EventBroker.publish("redraw.editor");
	});
});
