/**
 * Inject app script onto WhatsApp page
 */

function inject(script) {
  var s = document.createElement('script');
  // TODO: add "script.js" to web_accessible_resources in manifest.json
  s.src = chrome.extension.getURL(script);
  s.onload = function() {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(s);
}

window.onload = function() {
  const icons = {
    search: chrome.extension.getURL('/assets/icons/search.svg'),
    loading: chrome.extension.getURL('/assets/icons/loading.svg'),
    send: chrome.extension.getURL('/assets/icons/send.svg'),
    back: chrome.extension.getURL('/assets/icons/back.svg'),
    cerberus: chrome.extension.getURL('/assets/icons/cerberus.svg')
  };

  window.sessionStorage.setItem('cerberus-icons', JSON.stringify(icons))

  inject('build/zapzap-app.js');
};
