(function(){
    function NumberUtils() {}

	NumberUtils.getInst = function()
	{
		if(NumberUtils._inst === undefined)
		{
			NumberUtils._inst = new NumberUtils();
		}
		return NumberUtils._inst;
	};

	var p = NumberUtils.prototype;

	p.isNumeric = function ( n )
	{
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	var namespace = new Namespace ( 'org.incrediberry.utils' );

	namespace.NumberUtils = NumberUtils.getInst();

})();

