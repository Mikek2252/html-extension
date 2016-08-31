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

/* CHOOSE BETWEEN JQUERY OR PURE JS, THIS IS TURNING INTO A MESS */

chrome.runtime.onMessage.addListener(function(request, sender, callback) {

	if (request.action == "Start") {
		if($('.ui').length < 1) {
			$.get(chrome.extension.getURL('/src/inject/inject.html'), function(data) {
				var banner = $('body').children();
				$('body').empty();
				$('body').append(data);
				$('#position').append(banner)
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
			$('#element-content').empty();
			var container = createListItem($('#position').children());
			var content = document.getElementById("element-content"); //ui-content
			content.appendChild(container);
		}

		function createListItem(el){
			var container = document.createElement('div');
			$(container).addClass('item');
			if(el.length > 0) {
				var list = document.createElement("ul");
				for(var i=0; i < el.length; i++) {

					//Ignore line breaks
					if (el[i].nodeName == "BR") {
						continue;
					}
					//Create new elements
					var itemContainer = document.createElement("li");
					var item = document.createElement("a");
					//Get attributes, only id currently
					/* ADD SRC FOR IMG */
					var attributes = document.createElement("span");
					attributes.appendChild(document.createTextNode(" id: "+el[i].id+" "));
					var text = document.createTextNode("<"+el[i].localName+" ");
					item.appendChild(text);
					item.appendChild(attributes);
					item.appendChild(document.createTextNode(">"));
					$(item).attr('data-value',el[i].id);

					//Add class with item type
					$(itemContainer).addClass(el[i].localName+"type");
					$(itemContainer).append(item)
					$(list).append(itemContainer);
					//Recursive call to get all the list children
					if($(el[i]).children().length > 0) {
						$(itemContainer).append(createListItem($(el[i]).children()));
					}
					//Add closing tag for visibility
					$(itemContainer).append(document.createTextNode(" </"+el[i].localName+">"));
				}
				$(container).append($(list));
			}
			return container;
		}
	}
});
