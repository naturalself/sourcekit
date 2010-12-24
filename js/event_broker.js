var EventBroker = {
    subscribe: function(eventType, data, fn) {
		if (!data) {
			fn = data;
			$(this).bind(eventType, fn);
		} else {
			$(this).bind(eventType, data, fn);
		}
    },

    publish: function(eventType, parameters) {
        $(this).trigger(eventType, parameters);
    }
};