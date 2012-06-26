(function(){

	var ArrayUtils = my.Class({

		STATIC: {

			isArray: function ( a ) {
				return ( Object.prototype.toString.call( a ) === '[object Array]' )
			}
		},

		constructor: function() {},
	});

	var namespace = new Namespace ( 'org.incrediberry.utils' );
	namespace.ArrayUtils = ArrayUtils;

})();

