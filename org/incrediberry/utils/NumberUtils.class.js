(function(){
	"use strict";

	var NumberUtils = my.Class({

		STATIC: {
			isNumeric: function ( n ) {
				return !isNaN(parseFloat(n)) && isFinite(n);
			}
		},

		constructor: function() {},
	});

	var namespace = new Namespace ( 'org.incrediberry.utils' );
	namespace.NumberUtils = NumberUtils;

})();


