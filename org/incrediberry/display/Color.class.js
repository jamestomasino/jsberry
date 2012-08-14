(function() {
	"use strict";
	var Color = my.Class( {

		STATIC: { },

		constructor: function( r, g, b, h, s, v, l, y, c ) {
			this.r = r || 0;
			this.g = g || 0;
			this.b = b || 0;
			this.h = h || 0;
			this.s = s || 0;
			this.v = v || 0;
			this.l = l || 0;
			this.y = y || 0;
			this.c = c || 0;
		},

		getHex: function ( ) {
			var r = this.r.toString(16);
			var g = this.g.toString(16);
			var b = this.b.toString(16);

			if (r.length == 1) r = '0' + r;
			if (g.length == 1) g = '0' + g;
			if (b.length == 1) b = '0' + b;

			var rgbString = r + g + b;
			return rgbString;
		},

		setHex: function ( rgbHex ) {
			// strip #
			if (rgbHex.slice(0,1) == '#') rgbHex = rgbHex.slice(1);

			// Parse to 0-255 values
			this.r = parseInt( rgbHex.slice(0,2), 16 );
			this.g = parseInt( rgbHex.slice(2,4), 16 );
			this.b = parseInt( rgbHex.slice(4,6), 16 );

			this._rgb2hsvly();
			this._updateC();
		},

		getR: function ( ) {
			return this.r;
		},

		getG: function ( ) {
			return this.g;
		},

		getB: function ( ) {
			return this.b;
		},

		getH: function ( ) {
			return this.h;
		},

		getS: function ( ) {
			return this.s;
		},

		getV: function ( ) {
			return this.v;
		},

		getL: function ( ) {
			return this.l;
		},

		getY: function ( ) {
			return this.y;
		},

		setR: function ( r ) {
			this.r = r % 255;
			this._rgb2hsvly();
			this._updateC();
		},

		setG: function ( g ) {
			this.g = g % 255;
			this._rgb2hsvly();
			this._updateC();
		},

		setB: function ( b ) {
			this.b = b % 255;
			this._rgb2hsvly();
			this._updateC();
		},

		setH: function ( h ) {
			this.h = h % 1;
			this._hsv2rgb();
			this._updateL();
			this._updateY();
			this._updateV();
		},

		setS: function ( s ) {
			this.s = Math.max( 0, Math.min( 1, s));
			this._hsv2rgb();
			this._updateL();
			this._updateY();
			this._updateV();
		},

		setV: function ( v ) {
			this.v = Math.max( 0, Math.min( 1, v));
			this._hsv2rgb();
			this._updateL();
			this._updateY();
		},

		setL: function ( l ) {
			this.l = Math.max( 0, Math.min( 1, l));
			this._hsl2rgb();
			this._updateY();
			this._updateV();
		},

		setY: function ( y ) {
			this.y = Math.max( 0, Math.min( 1, y));
			this._hcy2rgb();
			this._updateL();
			this._updateV();
		},

		_updateV:  function () {
			var r = this.r / 255;
			var g = this.g / 255;
			var b = this.b / 255;
			this.v = Math.max(r, g, b);
		},

		_updateL:  function () {
			var r = this.r / 255;
			var g = this.g / 255;
			var b = this.b / 255;
			this.l = 0.5 * ( Math.max(r, g, b) +  Math.min(r, g, b) );
		},

		_updateY: function () {
			var r = this.r / 255;
			var g = this.g / 255;
			var b = this.b / 255;
			this.y = (0.30 * r) + ( 0.59 * g ) + ( 0.11 * b );
		},

		_updateC: function () {
			this.c = this.s * this.v;
		},

		_rgb2hsvly: function () {
			// Get basics for conversion
			var r = this.r / 255;
			var g = this.g / 255;
			var b = this.b / 255;

			var max = Math.max(r, g, b), min = Math.min(r, g, b);
			var h;
			var s;
			var v = max;
			var d = max - min;

			// Lightness value
			var l = 0.5 * (max + min);

			// Luma value
			var y = (0.30 * r) + ( 0.59 * g ) + ( 0.11 * b );

			s = max == 0 ? 0 : d / max;

			if (d == 0) {
				h = 0;
			} else {
				switch ( max ) {
					case r: h = ( g - b ) / d + ( g < b ? 6 : 0 ); break;
					case g: h = ( b - r ) / d + 2; break;
					case b: h = ( r - g ) / d + 4; break;
				}

				h /= 6;
			}

			this.h = h;
			this.s = s;
			this.v = v;
			this.l = l;
			this.y = y;
		},

		_hsv2rgb: function ( ) {
			var h = this.h * 360;
			var s = this.s;
			var v = this.v;
			var c = s * v;
			var h1 = h / 60;
			var x = c * ( 1 - Math.abs( h1 % 2 - 1) );
			var rgb;

			if (h1 < 1) {
				rgb = [ c, x, 0 ];
			} else if ( h1 < 2 ) {
				rgb = [ x, c, 0 ];
			} else if ( h1 < 3 ) {
				rgb = [ 0, c, x ];
			} else if ( h1 < 4 ) {
				rgb = [ 0, x, c ];
			} else if ( h1 < 5 ) {
				rgb = [ x, 0, c ];
			} else if ( h1 < 6 ) {
				rgb = [ c, 0, x ];
			}

			var m = v - c;
			rgb = [rgb[0] + m, rgb[1] + m, rgb[2] + m];

			rgb[0] = Math.round(rgb[0] * 255);
			rgb[1] = Math.round(rgb[1] * 255);
			rgb[2] = Math.round(rgb[2] * 255);

			this.r = rgb[0];
			this.g = rgb[1];
			this.b = rgb[2];
			this.c = c;
		},


		_hsl2rgb: function ( ) {
			var h = this.h * 360;
			var s = this.s;
			var l = this.l;
			var c = (1 - Math.abs( 2 * l - 1 ) ) * s;
			var h1 = h / 60;
			var x = c * ( 1 - Math.abs( h1 % 2 - 1) );
			var rgb;

			if (h1 < 1) {
				rgb = [ c, x, 0 ];
			} else if ( h1 < 2 ) {
				rgb = [ x, c, 0 ];
			} else if ( h1 < 3 ) {
				rgb = [ 0, c, x ];
			} else if ( h1 < 4 ) {
				rgb = [ 0, x, c ];
			} else if ( h1 < 5 ) {
				rgb = [ x, 0, c ];
			} else if ( h1 < 6 ) {
				rgb = [ c, 0, x ];
			}
			var m = l - (c * .5);
			rgb = [rgb[0] + m, rgb[1] + m, rgb[2] + m];

			rgb[0] = Math.round(rgb[0] * 255);
			rgb[1] = Math.round(rgb[1] * 255);
			rgb[2] = Math.round(rgb[2] * 255);


			this.r = rgb[0];
			this.g = rgb[1];
			this.b = rgb[2];
			this.c = c;
		},

		_hcy2rgb: function ( ) {
			var h = this.h * 360;
			var c = this.c;
			var y = this.y;
			var h1 = h / 60;
			var x = c * ( 1 - Math.abs( h1 % 2 - 1) );
			var rgb;

			if (h1 < 1) {
				rgb = [ c, x, 0 ];
			} else if ( h1 < 2 ) {
				rgb = [ x, c, 0 ];
			} else if ( h1 < 3 ) {
				rgb = [ 0, c, x ];
			} else if ( h1 < 4 ) {
				rgb = [ 0, x, c ];
			} else if ( h1 < 5 ) {
				rgb = [ x, 0, c ];
			} else if ( h1 < 6 ) {
				rgb = [ c, 0, x ];
			}

			var m = y - (( 0.30 * rgb[0] ) + ( 0.59 * rgb[1] ) + ( 0.11 * rgb[2] ));
			rgb = [rgb[0] + m, rgb[1] + m, rgb[2] + m];

			// Limit this or it can explode.
			rgb[0] = Math.min(Math.round(rgb[0] * 255), 255);
			rgb[1] = Math.min(Math.round(rgb[1] * 255), 255);
			rgb[2] = Math.min(Math.round(rgb[2] * 255), 255);

			this.r = rgb[0];
			this.g = rgb[1];
			this.b = rgb[2];
		},

		clone: function () {
			return new Color ( this.r, this.g, this.b, this.h, this.s, this.v, this.l, this.y, this.c );
		}

	});

	var namespace = new Namespace ( 'org.incrediberry.display' );
	namespace.Color = Color;

})();


