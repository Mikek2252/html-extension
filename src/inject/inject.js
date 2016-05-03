chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------
		$.get(chrome.extension.getURL('/src/inject/inject.html'), function(data) {
			$(data).appendTo('body');
			console.log($('#keyline').children());
			var container = createListItem($('#keyline').children());
			var content = document.getElementById("ui-content");
			content.appendChild(container);
		});



		function createListItem(el){
			var container = document.createElement('div');
			$(container).addClass('item');
			if(el.length > 0) {
				var list = document.createElement("ul");
				for(var i=0; i < el.length; i++) {
					var item = document.createElement("li");
					$(item).text(el[i].nodeName+" id: "+el[i].id);
					$(list).append(item);
					if($(el[i]).children().length > 0) {
						console.log("runs?");
						$(item).append(createListItem($(el[i]).children()));
					}
				}
				$(container).append($(list));
			}
			return container;
		}

	}
	}, 10);
});
