chrome.browserAction.onClicked.addListener(function(activeTab){
  var newURL = "/resources/application.html";
  chrome.tabs.create({ url: newURL });
});