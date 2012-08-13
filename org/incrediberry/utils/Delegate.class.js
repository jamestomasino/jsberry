(function(){
	"use strict";

	var Delegate = my.Class({

		STATIC: {
			createDelegate: function (object, method) {
				var shim = function() {
					return method.apply(object, arguments);
				}
				return shim;
			}
		},

		constructor: function() {},
	});

	var namespace = new Namespace ( 'org.incrediberry.utils' );
	namespace.Delegate = Delegate;

})();
