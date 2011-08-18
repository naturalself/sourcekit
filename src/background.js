// Javascript code to handle options for SourceKit

var _registeredStorageExtensions = {};

// The message handler to accept the registrations.
function acceptExtensions(request, sender, sendResponse) {
  console.log(sender);
  console.log(request);
  if (request.SourceKitRegistration) {
    if (!(sender.id in _registeredStorageExtensions)) {
      _registeredStorageExtensions[sender.id] = request.name;
    }
    sendResponse(true);
  }
}
function init() {
  chrome.extension.onRequestExternal.addListener(acceptExtensions);
}
window.addEventListener('load',init);
