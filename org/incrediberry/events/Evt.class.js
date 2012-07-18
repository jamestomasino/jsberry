(function() {
	"use strict";

	var Evt = my.Class({

		STATIC: {
			// Keep reference to every event for easier cleanup
			_listEvents: [],

			// Add internal reference to event
			_add: function(node, sEventName, fHandler, guid) {
				Evt._listEvents.push(arguments);
			},

			// remove internal reference to event
			_remove: function(node, sEventName, fHandler, guid) {
				if ( arguments.length == 3 ) {
					var i = Evt._listEvents.length; while (i--) {
						if ( Evt._listEvents[i][0] == arguments[0] && Evt._listEvents[i][1] == arguments[1] && Evt._listEvents[i][2] == arguments[2]  )
						Evt._listEvents.splice(i, 1);
						break;
					}
				}
				else
				{
					var i = Evt._listEvents.length; while (i--) {
						if ( Evt._listEvents[i][0] == arguments[0] && Evt._listEvents[i][1] == arguments[1] && Evt._listEvents[i][2] == arguments[2] && Evt._listEvents[i][3] == arguments[3] )
						Evt._listEvents.splice(i, 1);
						break;
					}
				}
			},

			// Based on other 3 properties, retrieve the 4th (unique event guid)
			_getGUID: function (node, sEventName, fHandler ) {
				var i = Evt._listEvents.length; while (i--) {
					if ( Evt._listEvents[i][0] == arguments[0] && Evt._listEvents[i][1] == arguments[1] && Evt._listEvents[i][2] == arguments[2]  )
						if (Evt._listEvents[i].length > 3)
							return Evt._listEvents[i][3];
				}
				return;
			},

			// Using stored eventst list, clean up everything
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
				}
			},

			addEvent: function ( obj, type, fn ) {
				if (obj.addEventListener) {
					obj.addEventListener( type, fn, false );
					Evt._add(obj, type, fn);
				} else if (obj.attachEvent) {
					obj["eventGUID"] = obj["eventGUID"] || 1;
					obj["eventGUID"]++;
					var guid = obj["eventGUID"];
					var def = "e_" + type + "_def_" + guid;
					var fncall =  "e_" + type + "_fn_"  + guid;
					obj[ def ] = fn;
					obj[ fncall ] = function() { obj[def]( window.event ); }
					obj.attachEvent( "on" + type, obj[fncall] );
					Evt._add(obj, type, fn, guid);
				}
			},

			removeEvent: function ( obj, type, fn ) {
				if (obj.removeEventListener) {
					obj.removeEventListener( type, fn, false );
					Evt._remove(obj, type, fn);
				} else if (obj.detachEvent) {
					var guid = Evt._getGUID ( obj, type, fn );
					var def = "e_" + type + "_def_" + guid;
					var fncall =  "e_" + type + "_fn_"  + guid;
					obj[def] = null;
					obj[fncall] = null;
					obj.detachEvent( "on"+type, obj[fncall] );
					Evt._remove(obj, type, fn, guid);
				}
			}

		},

		constructor: function( ) {}

	});

	var namespace = new Namespace ( 'org.incrediberry.events' );
	namespace.Evt = Evt;

})();
