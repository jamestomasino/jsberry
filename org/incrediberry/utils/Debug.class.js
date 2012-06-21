(function(){
    function Debug() {}

	Debug.getInst = function()
	{
		if(Debug._inst === undefined)
		{
			Debug._inst = new Debug();
		}
		return Debug._inst;
	};

	var p = Debug.prototype;

	p.chromeRegEx = /^\s*.*at\s[^\.]*.([^\ ]*)\ \(*.*[\/]([^:]*):(\d*).*$/gm;
	p.firefoxRegEx = /^.*?@.*\/(.*):(\d*).*$/gm;

	p.log = function () {
		if ( this.enabled && window.console )
		{
			var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
			var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

			var stack = new Error('').stack;
			var m, a = [];
			var output = '';

			switch (true) {
				case is_chrome:
					while (m = this.chromeRegEx.exec(stack)) {
						var o = {};
						o.call = m[1];
						o.source = m[2];
						o.line = m[3];
						a.push(o);
					}
					output += '[ ' + a[1].source + ' : ' + a[1].call + ' : ' + a[1].line + ' ] ';
					break;
				case is_firefox:
					while (m = this.firefoxRegEx.exec(stack)) {
						var o = {};
						o.source = m[1];
						o.line = m[2];
						a.push(o);
					}
					output += '[ ' + a[1].source + ' : ' + a[1].line + ' ] ';
					break;
			}

			var len = arguments.length;
			while ( len-- )
			{
				output += arguments[len] + ' ';
			}
			console.log (output);
		}
	};

	p.enabled = false;

	var namespace = new Namespace ( 'org.incrediberry.utils' );

	namespace.Debug = Debug.getInst();

})();
