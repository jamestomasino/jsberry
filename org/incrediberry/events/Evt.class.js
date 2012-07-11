(function() {

	var Evt = my.Class({

		STATIC: {
			_listEvents: [],

			_add: function(node, sEventName, fHandler) {
				Evt._listEvents.push(arguments);
			},

			_remove: function(node, sEventName, fHandler) {
				if ( arguments.length == 3 ) {
					var i = Evt._listEvents.length; while (i--) {
						if ( Evt._listEvents[i][0] == arguments[0] && Evt._listEvents[i][1] == arguments[1] && Evt._listEvents[i][2] == arguments[2]  )
						Evt._listEvents.splice(i, 1);
						break;
					}
				}
			},

			_flush: function(){
				var i, item;
				for(i = Evt._listEvents.length - 1; i >= 0; i = i - 1) {
					item = Evt._listEvents[i];
					if(item[0].removeEventListener) {
						item[0].removeEventListener(item[1], item[2], item[3]);
					}
					if(item[1].substring(0, 2) != "on") {
						item[1] = "on" + item[1];
					}
					if(item[0].detachEvent) {
						item[0].detachEvent(item[1], item[2]);
					}
					item[0][item[1]] = null;
				}
			},

			addEvent: function ( obj, type, fn ) {
				if (obj.addEventListener) {
					obj.addEventListener( type, fn, false );
					Evt._add(obj, type, fn);
				}
				else if (obj.attachEvent) {
					obj["e"+type+fn] = fn;
					obj[type+fn] = function() { obj["e"+type+fn]( window.event ); }
					obj.attachEvent( "on"+type, obj[type+fn] );
					Evt._add(obj, type, fn);
				}
				else {
					obj["on"+type] = obj["e"+type+fn];
				}
			},

			removeEvent: function ( obj, type, fn ) {
				if (obj.removeEventListener) {
					obj.removeEventListener( type, fn, false );
					Evt._remove(obj, type, fn);
				}
				else if (obj.detachEvent) {
					obj["e"+type+fn] = null;
					obj[type+fn] = null;
					obj.detachEvent( "on"+type, obj[type+fn] );
					Evt._remove(obj, type, fn);
				}
				else {
					obj["on"+type] = null;
				}
			}

		},

		constructor: function( ) {}

	});

	var namespace = new Namespace ( 'org.incrediberry.events' );
	namespace.Evt = Evt;

})();
