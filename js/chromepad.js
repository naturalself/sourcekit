$(document).ready(function() {
	$('body').layout({ 
		applyDefaultStyles: true,
		center__applyDefaultStyles: false,
		onresize: function() { EventBroker.publish("redraw.editor"); }
	});
});
