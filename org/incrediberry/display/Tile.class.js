(function() {

	var Tile = my.Class( org.incrediberry.events.EventDispatcher, {

		STATIC: {
			ENABLED_CHANGE: 'Tile_ENABLED_CHANGE',
			DIR_UP: 0,
			DIR_RIGHT: 1,
			DIR_DOWN: 2,
			DIR_LEFT: 3
		},

		constructor: function( domObj, width, height, id ) {
			Namespace.import (this, 'org.incrediberry.utils.NumberUtils' );
			Namespace.import (this, 'org.incrediberry.data.BitArray' );
			Namespace.import (this, 'jQuery');

			Tile.Super.call(this);

			this._domObj = domObj;
			this._tileWidth = 1;
			this._tileHeight = 1;
			this._id = id;
			this._name = this._domObj.attr('id');
			this._isEnabled = true;
			this.setGridSize ( width, height );
			this._navDirections = new this.BitArray ([0,0,0,0]);
			this._isDebug = false;
		},

		setGridSize: function ( width, height ) {
			this._tileWidth = this.NumberUtils.isNumeric (width) ? parseFloat(width) : this._tileWidth;
			this._tileHeight = this.NumberUtils.isNumeric (height) ? parseFloat(height) : this._tileHeight;
			this._tileBaseCSS = {'overflow': 'hidden', 'position': 'absolute', 'display': 'block', 'margin': '0', 'padding': '0', 'width': this._tileWidth, 'height': this._tileHeight };
			this._domObj.css ( this._tileBaseCSS );
			this._domObj.addClass ( 'tile' );
			this._domObj.removeClass('swipeL swipeR swipeU swipeD');

			// Debugging
		},

		getNavigation: function ( dir ) { return this._navDirections.get ( dir ); },
		setNavigation: function ( dir, isEnabled ) {
			this._navDirections.set ( dir, isEnabled );
			switch (dir)
			{
				case Tile.DIR_UP:
					if ( isEnabled ) this._domObj.addClass ('swipeU');
					else this._domObj.removeClass ('swipeU');
					break;
				case Tile.DIR_RIGHT:
					if ( isEnabled ) this._domObj.addClass ('swipeR');
					else this._domObj.removeClass ('swipeR');
					break;
				case Tile.DIR_DOWN:
					if ( isEnabled ) this._domObj.addClass ('swipeD');
					else this._domObj.removeClass ('swipeD');
					break;
				case Tile.DIR_LEFT:
					if ( isEnabled ) this._domObj.addClass ('swipeL');
					else this._domObj.removeClass ('swipeL');
					break;
			}

			// All combos, because why not
			this._domObj.removeClass ( 'u r d l ur ud ul rd rl dl urd url udl rdl urdl' );
			var comboClass = '';
			comboClass += this._navDirections.get ( 0 ) ? 'u' : '';
			comboClass += this._navDirections.get ( 1 ) ? 'r' : '';
			comboClass += this._navDirections.get ( 2 ) ? 'd' : '';
			comboClass += this._navDirections.get ( 3 ) ? 'l' : '';
			this._domObj.addClass ( comboClass );
		},

		isEnabled: function () {
			return this._isEnabled;
		},

		enable: function () {
			this._isEnabled = true;
			dispatchEvent ( Tile.ENABLED_CHANGE );
		},

		disable: function () {
			this._isEnabled = false;
			dispatchEvent ( Tile.ENABLED_CHANGE );
		},

		isDebug: function () { return this._isDebug; },
		setDebug: function (val) {
			this._isDebug = val;
			if ( this._isDebug ) this._domObj.prepend ('<div class="tileDebugLabel" style="padding: 10px;">Tile [' + this._name + ']  Position: (' + this._id + ')</div>' );
			else this.jQuery('.tileDebugLabel').remove();
		},

		destroy: function () {
			// Remove custom classes
			this._domObj.removeClass ( 'tile swipeU swipeR swipeD swipeL' );
			this._domObj.removeClass ( 'u r d l ur ud ul rd rl dl urd url udl rdl urdl' );
		}
	});

	var namespace = new Namespace ( 'org.incrediberry.display' );
	namespace.Tile = Tile;

})();


