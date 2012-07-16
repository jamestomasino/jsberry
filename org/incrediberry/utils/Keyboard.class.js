(function() {

	var Keyboard = my.Class( Namespace.import ( null, 'org.incrediberry.events.EventDispatcher' ), {

		STATIC: {
			EVENT_KEY_UP: 'keyboard_event_key_up',
			EVENT_KEY_DOWN: 'keyboard_event_key_down',
			EVENT_SHIFT_DOWN: 'keyboard_event_shift_down',
			EVENT_SHIFT_UP: 'keyboard_event_shift_up',
			EVENT_CTRL_DOWN: 'keyboard_event_ctrl_down',
			EVENT_CTRL_UP: 'keyboard_event_ctrl_up',
			EVENT_DEL_DOWN: 'keyboard_event_del_down',
			EVENT_DEL_UP: 'keyboard_event_del_up',
			EVENT_ENTER_DOWN: 'keyboard_event_enter_down',
			EVENT_ENTER_UP: 'keyboard_event_enter_up',
			EVENT_BACKSPACE_DOWN: 'keyboard_event_backspace_down',
			EVENT_BACKSPACE_UP: 'keyboard_event_backspace_up'
		},

		constructor: function( domObj ) {
			Namespace.import ( this, 'jQuery' );
			Namespace.import ( this, 'org.incrediberry.utils.Delegate' );

			Keyboard.Super.call(this);

			this._onKeyPressDelegate = this.Delegate.createDelegate ( this, this._onKeyPress );
			this._onKeyUpDelegate    = this.Delegate.createDelegate ( this, this._onKeyUp );
			this._onKeyDownDelegate  = this.Delegate.createDelegate ( this, this._onKeyDown );

			this._shift = false;
			this._ctrl = false;
			this._backspace = false;
			this._delete = false;
			this._enter = false;

			this.jQuery(domObj).unbind( 'keyup', this._onKeyUpDelegate );
			this.jQuery(domObj).unbind( 'keydown', this._onKeyDownDelegate );
			this.jQuery(domObj).unbind( 'keypress', this._onKeyPressDelegate );

			this.jQuery(domObj).bind( 'keyup', this._onKeyUpDelegate );
			this.jQuery(domObj).bind( 'keydown', this._onKeyDownDelegate );
			this.jQuery(domObj).bind( 'keypress', this._onKeyPressDelegate );
		},

		_onKeyPress: function (e) {
			e.preventDefault(); // Keep us from accidental navigation
		},

		_onKeyUp: function (e) {
			e = e || event;
			var k = e.keyCode || e.which;

			k = this._adjustKeyCode(k);

			switch (k) {
				case 8: // backspace
					this._backspace = false;
					this.dispatchEvent ( Keyboard.EVENT_BACKSPACE_UP );
					break;
				case 17: // ctrl
					this._ctrl = false;
					this.dispatchEvent ( Keyboard.EVENT_CTRL_UP );
					break;
				case 20: // capslock
					break;
				case 13: // enter
					this._enter = false;
					this.dispatchEvent ( Keyboard.EVENT_ENTER_UP );
					break;
				case 46: // delete
					this._delete = false;
					this.dispatchEvent ( Keyboard.EVENT_DEL_UP );
					break;
				case 16: // this._shift
					this._shift = false;
					this.dispatchEvent ( Keyboard.EVENT_SHIFT_UP);
					break;
				default:
					var keyObj          = {};
						keyObj.charCode = k;
						keyObj.char     = String.fromCharCode (k);
						keyObj.shift    = this._shift;
						keyObj.ctrl     = this._ctrl;
					this.dispatchEvent ( Keyboard.EVENT_KEY_UP, keyObj );
					break;
			}
			e.preventDefault();
		},

		_onKeyDown: function (e) {
			e = e || event;
			var k = e.keyCode || e.which;
			k = this._adjustKeyCode(k);

			switch (k) {
				case 8: // backspace
					this._backspace = true;
					this.dispatchEvent ( Keyboard.EVENT_BACKSPACE_DOWN );
					break;
				case 17: // ctrl
					this._ctrl = true;
					this.dispatchEvent ( Keyboard.EVENT_CTRL_DOWN );
					break;
				case 20: // capslock
					break;
				case 13: // enter
					this._enter = true;
					this.dispatchEvent ( Keyboard.EVENT_ENTER_DOWN );
					break;
				case 46: // delete
					this._delete = true;
					this.dispatchEvent ( Keyboard.EVENT_DEL_DOWN );
					break;
				case 16: // this._shift
					this._shift = true;
					this.dispatchEvent ( Keyboard.EVENT_SHIFT_DOWN );
					break;
				default:
					var keyObj          = {};
						keyObj.charCode = k;
						keyObj.char     = String.fromCharCode (k);
						keyObj.shift    = this._shift;
						keyObj.ctrl     = this._ctrl;
					this.dispatchEvent ( Keyboard.EVENT_KEY_DOWN, keyObj );
					break;
			}

			e.preventDefault();
		},

		_adjustKeyCode: function (k) {
			switch (k) {
				case 48: // 0
					if (this._shift) k = 41;
					break;
				case 49: // 1
					if (this._shift) k = 33;
					break;
				case 50: // 2
					if (this._shift) k = 64;
					break;
				case 51: // 3
					if (this._shift) k = 35;
					break;
				case 52: // 4
					if (this._shift) k = 36;
					break;
				case 53: // 5
					if (this._shift) k = 37;
					break;
				case 54: // 6
					if (this._shift) k = 94;
					break;
				case 55: // 7
					if (this._shift) k = 38;
					break;
				case 56: // 8
					if (this._shift) k = 42;
					break;
				case 57: // 9
					if (this._shift) k = 40;
					break;
				case 44: // ,
				case 188: // should be , but is ¼
					k = (this._shift) ? 60 : 44;
					break;
				case 190: // should be . but is ¾
					k = (this._shift) ? 62 : 46;
					break;
				case 39: // '
				case 222: // should be ' but is Þ
					k = (this._shift) ? 34 : 39;
					break;
				case 59: // ;
				case 186: // º
					k = (this._shift) ? 58 : 59;
					break;
				case 91:
				case 219: // [
					k = (this._shift) ? 123 : 91;
					break;
				case 93:
				case 221: // ]
					k = (this._shift) ? 125 : 93;
					break;
				case 47:
				case 191: // /
					k = (this._shift) ? 63 : 47;
					break;
				case 61:
				case 187: // =
					k = (this._shift) ? 43 : 61;
					break;
				case 39:
				case 220: // \
					k = (this._shift) ? 124 : 39;
					break;
				case 45:
				case 189: // -
					k = (this._shift) ? 95 : 45;
					break;
				default:
					if (!this._shift && (k >= 65 && k <= 90))
					{
						k += 32;
					}
					break;
			}
			return k;
		}
	});

	var namespace = new Namespace ( 'org.incrediberry.utils' );
	namespace.Keyboard = Keyboard;

})();



