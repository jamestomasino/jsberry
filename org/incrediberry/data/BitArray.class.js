(function(){
	"use strict";
	var BitArray = my.Class({

		STATIC: {},

		constructor: function(values) {
		  if (values && values.toString() === values) {
			this.values = [];
			var hex = values.slice(/^0x/.exec(values) ? 2 : 0);
			while (hex.length % 8 !== 0) {
			  hex = '0' + hex;
			}
			for (var i = 0; i < (hex.length / 8); i++) {
			  var slice = hex.slice(i * 8, i * 8 + 8);
			  this.values.push(parseInt(slice, 16));
			}
		  } else {
			  this.values = values || [];
		  }
		},

		size: function () {
			return this.values.length * 32;
		},

		set: function (index, value) {
			var i = Math.floor(index / 32);
			// Since "undefined | 1 << index" is equivalent to "0 | 1 << index" we do not need to initialise the array explicitly here.
			if (value) {
				this.values[i] |= 1 << index - i * 32;
			} else {
				this.values[i] &= ~(1 << index - i * 32);
			}
			return this;
		},

		toggle: function (index) {
			var i = Math.floor(index / 32);
			this.values[i] ^= 1 << index - i * 32;
			return this;
		},

		get: function (index) {
			var i = Math.floor(index / 32);
			return !!(this.values[i] & (1 << index - i * 32));
		},

		reset: function () {
			this.values = [];
			return this;
		},

		copy: function () {
			var cp = new BitArray();
			clength = this.length;
			cvalues = [].concat(this.values);
			return cp;
		},

		equals: function (x) {
			return this.values.length === x.values.length &&
				this.values.every(function (value, index) {
				return value === x.values[index];
			});
		},

		toJSON: function () {
			return JSON.stringify(this.values);
		},

		toString: function () {
			return this.toArray().map(function (value) {
				return value ? '1' : '0';
			}).join('');
		},

		toBinaryString: function () {
			return this.toArray().map(function (value) {
				return value ? '1' : '0';
			}).reverse().join('');
		},

		toHexString: function () {
		  return this.values.map(function (value) {
			// Prepend with zeroes: 0000aaaa 0000bbbb is different than aaaabbbb
			// Do a bit shift no-op to force this value to be treated as unsigned.
			return ('00000000' + (value >>> 0).toString(16)).slice(-8);
		  }).join('');
		},

		valueOf: function () {
			return this.values;
		},

		toArray: function () {
			var result = [];
			this.forEach(function (value, index) {
				result.push(value);
			});
			return result;
		},

		toIntArray: function () {
			var result = [];
			this.forEach(function (value, index) {
				if (value) {
					result.push(index);
				}
			});
			return result;
		},

		count: function () {
			var total = 0;

			this.values.forEach(function (x) {
				x  = x - ((x >> 1) & 0x55555555);
				x  = (x & 0x33333333) + ((x >> 2) & 0x33333333);
				x  = x + (x >> 4);
				x &= 0xF0F0F0F;

				total += (x * 0x01010101) >> 24;
			});
			return total;
		},

		forEach: function (fn, scope) {
			var i = 0, b = 0, index = 0,
				len = this.values.length,
				value, word;

			for (; i < len; i += 1) {
				word = this.values[i];
				for (b = 0; b < 32; b += 1) {
					value = (word & 1) !== 0;
					fn.call(scope, value, index, this);
					word = word >> 1;
					index += 1;
				}
			}
			return this;
		},

		not: function () {
			this.values = this.values.map(function (v) {
				return ~v;
			});
			return this;
		},

		or: function (x) {
			if (this.values.length !== x.values.length) {
				throw 'Arguments must be of the same length.';
			}
			this.values = this.values.map(function (v, i) {
				return v | x.values[i];
			});
			return this;
		},

		and: function (x) {
			if (this.values.length !== x.values.length) {
				throw 'Arguments must be of the same length.';
			}
			this.values = this.values.map(function (v, i) {
				return v & x.values[i];
			});
			return this;
		},

		xor: function (x) {
			if (this.values.length !== x.values.length) {
				throw 'Arguments must be of the same length.';
			}
			this.values = this.values.map(function (v, i) {
				return v ^ x.values[i];
			});
			return this;
		}

	});


	var namespace = new Namespace ( 'org.incrediberry.data' );
	namespace.BitArray = BitArray;

})();
