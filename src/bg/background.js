// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		chrome.pageAction.show(sender.tab.id);
		sendResponse();
		console.log("Running");
	});
chrome.browserAction.onClicked.addListener(function(tab) {
	// Send a message to the active tab
	console.log("running");
//  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//    var activeTab = tabs[0];
//    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
//  });
});
