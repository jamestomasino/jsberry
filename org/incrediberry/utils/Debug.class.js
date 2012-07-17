(function(){
	"use strict";

	var Debug = my.Class({

		STATIC: {
			enabled: false,
			chromeRegEx: /^\s*.*at\s[^\.]*.([^\ ]*)\ \(*.*[\/]([^:]*):(\d*).*$/gm,
			firefoxRegEx: /^.*?@.*\/(.*):(\d*).*$/gm,
			log: function () {
				if ( Debug.enabled && window.console ) {
					var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
					var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

					var stack = new Error('').stack;
					var m, a = [];
					var output = '';

					switch (true) {
						case is_chrome:
							while (m = Debug.chromeRegEx.exec(stack)) {
								var o = {};
								o.call = m[1];
								o.source = m[2];
								o.line = m[3];
								a.push(o);
							}
							output += '[ ' + a[1].source + ' : ' + a[1].call + ' : ' + a[1].line + ' ] ';
							break;
						case is_firefox:
							while (m = Debug.firefoxRegEx.exec(stack)) {
								var o = {};
								o.source = m[1];
								o.line = m[2];
								a.push(o);
							}
							output += '[ ' + a[1].source + ' : ' + a[1].line + ' ] ';
							break;
					}

					var len = arguments.length;
					while ( len-- ) {
						output += arguments[len] + ' ';
					}
					console.log (output);
				}
			}
		},

		constructor: function() {},
	});

	var namespace = new Namespace ( 'org.incrediberry.utils' );
	namespace.Debug = Debug;

})();
