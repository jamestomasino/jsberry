(function(){
    function ArrayUtils() {}

	ArrayUtils.getInst = function()
	{
		if(ArrayUtils._inst === undefined)
		{
			ArrayUtils._inst = new ArrayUtils();
		}
		return ArrayUtils._inst;
	};

	var p = ArrayUtils.prototype;

	p.isArray = function ( a )
	{
		return ( Object.prototype.toString.call( a ) === '[object Array]' )
	}

	var namespace = new Namespace ( 'org.incrediberry.utils' );

	namespace.ArrayUtils = ArrayUtils.getInst();

})();


