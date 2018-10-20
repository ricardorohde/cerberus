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
    inject('jquery.js');
    inject('mustache.js');
    inject('wapi.js');
    inject('defense.js');
    inject('foward.js');
    inject('ui.js');
    inject('run.js');
}
