chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------

	}
	}, 10);
});

chrome.runtime.onMessage.addListener(function(request, sender, callback) {

	if (request.action == "Start") {
		if($('.ui').length < 1) {
			$.get(chrome.extension.getURL('/src/inject/inject.html'), function(data) {
				$('body').append(data);
				$('#clicktag').remove();
				updateList();
				var script = document.createElement('script');
				script.src = chrome.extension.getURL('/src/inject/helper.js');
				script.id = "helper";
				$('body').append(script);
			});
		} else {
			updateList();
		}

		function updateList(){
			$('#ui-content').empty();
			var container = createListItem($('#keyline').children());
			var content = document.getElementById("ui-content");
			content.appendChild(container);
		}

		function createListItem(el){
			var container = document.createElement('div');
			$(container).addClass('item');
			if(el.length > 0) {
				var list = document.createElement("ul");
				for(var i=0; i < el.length; i++) {
					if (el[i].nodeName == "BR") {
						continue;
					}
					var itemContainer = document.createElement("li");
					var item = document.createElement("a");
					$(item).text("<"+el[i].localName+"> id: "+el[i].id);
					$(item).attr('data-value',el[i].id);
					$(itemContainer).append(item)
					$(list).append(itemContainer);
					if($(el[i]).children().length > 0) {
						$(itemContainer).append(createListItem($(el[i]).children()));
					}
				}
				$(container).append($(list));
			}
			return container;
		}
	}
});
