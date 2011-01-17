var EventBroker = {
    subscribe: function(eventType, data, fn) {
		if (!data) {
			fn = data;
			$(this).bind(eventType, fn);
		} else {
			$(this).bind(eventType, data, fn);
		}
    },

    publish: function(eventType, data) {
        $(this).trigger(eventType, [data]);
    }
};