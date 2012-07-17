(function() {
	"use strict";

	var VideoWrapper = my.Class( Namespace.import ( null, 'org.incrediberry.events.EventDispatcher' ), {

		STATIC: {
			instances: [],
			getActiveWrapper: function () {
				for ( var i = 0; i < VideoWrapper.instances.length; ++i) {
					var inst = VideoWrapper.instances[i];
					if (inst.getVideo() != null) return inst;
				}
				return null;
			}
		},

		constructor: function (id, video, image, objectsToBind) {
			Namespace.import ( this, 'org.incrediberry.events.Evt' );
			Namespace.import ( this, 'org.incrediberry.utils.Delegate' );
			Namespace.import ( this, 'org.incrediberry.utils.ArrayUtils' );
			Namespace.import ( this, 'org.incrediberry.video.VideoCuePoints' );
			Namespace.import ( this, 'jQuery' );

			VideoWrapper.Super.call(this);

			// Store references for removeEventListeners later
			this._videoPlayDelegate = this.Delegate.createDelegate ( this, this._videoPlay);
			this._onPlayDelegate    = this.Delegate.createDelegate ( this, this._onPlay );
			this._onPauseDelegate   = this.Delegate.createDelegate ( this, this._onPause );
			this._onEndedDelegate   = this.Delegate.createDelegate ( this, this._onComplete );

			this._video                 = null;
			this._image                 = null;
			this._objectsToBind         = [];
			this._cuePoints             = null;
			this._userCuePoints         = new this.VideoCuePoints();
			this._userPlayCallbacks     = [];
			this._userPauseCallbacks    = [];
			this._userCompleteCallbacks = [];
			this._boundEvents           = [];
			this._keepEvents            = false;
			this._canReplay             = false;
			this._idStr                 = id;
			this._videoStr              = video;
			this._imageStr              = image;
			this._isEnded               = false;
			this._wrapper               = this.jQuery('#' + this._idStr);
			this._objectsToBind         = [];
			this.name                   = 'VideoWrapper[' + this._idStr + ']';

			VideoWrapper.instances.push ( this );

			this._userCuePoints.addEventListener ( this.VideoCuePoints.CUE_POINT_EVENT, this.Delegate.createDelegate ( this, this._onCuePoint ) );

			if (objectsToBind != null) {
				if ( this.ArrayUtils.isArray (objectsToBind ) ) {
					for ( var i = 0; i < objectsToBind.length; ++i ) {
						var obj = objectsToBind[i];
						if ( typeof(obj) == 'string' ) {
							var jqObj = this.jQuery(obj);
							if (jqObj != null) {
								this._objectsToBind.push ( jqObj );
							}

						} else {
							if (obj instanceof jQuery) {
								this._objectsToBind.push ( obj );
							}
						}
					}
				} else if ( typeof(objectsToBind) == 'string' ) {
					var jqObj = this.jQuery(objectsToBind);
					if (jqObj != null) {
						this._objectsToBind.push ( jqObj );
					}
				}
			}

			this._constructHTML(false);
			this._setBindings();
		},

		isActive: function () {
			return (this._video != null) ? true : false;
		},

		getVideo: function () {
			return this._video;
		},

		getWrapper: function() {
			return this._wrapper;
		},

		getImage: function () {
			return this._image;
		},

		keepEvents: function (val) {
			this._keepEvents = val;
		},

		canReplay: function (val) {
			this._canReplay = val
		},

		closeVideo: function () {
			if ( this._video != null ) {
				this.Evt.removeEvent ( this._video, 'play', this._onPlayDelegate );
				this.Evt.removeEvent ( this._video, 'pause', this._onPauseDelegate );
				this.Evt.removeEvent ( this._video, 'ended', this._onEndedDelegate );
				this._video.pause();
				this._video.src = '';
				this._video.load();
				this._video = null;
				if (this._cuePoints) this._cuePoints.destroy();
				this._cuePoints = null;
				this._userCuePoints.clearVideo();
			}

			this._constructHTML(false);
		},

		// CuePoint wrapper methods
		addCuePoint: function ( time, label ) {
			this._userCuePoints.addCuePoint ( time, label );
		},

		removeCuePoint: function ( timeNameOrCuePoint ) {
			this._userCuePoints.removeCuePoint ( timeNameOrCuePoint );
		},

		//onCuePoint: function ( callback ) {
		//	this._userCuePoints.onCuePoint(callback)
		//},

		onPlay: function ( callback ) {
			this._userPlayCallbacks.push ( callback );
		},

		onPause: function ( callback ) {
			this._userPauseCallbacks.push ( callback );
		},

		onComplete: function ( callback ) {
			this._userCompleteCallbacks.push ( callback );
		},

		bind: function ( type, callback ) {
			if ( type != null && callback != null ) {
				var foundDuplicate = false;
				for (var i = 0; i < this._boundEvents.length; ++i ) {
					var bindObj = this._boundEvents[i];
					if (bindObj && bindObj.type == type && bindObj.callback == callback) {
						foundDuplicate = true;
					}
				}
				if (!foundDuplicate) {
					var bindObj = {};
					bindObj.type = type;
					bindObj.callback = callback;
					this._boundEvents.push ( bindObj );
					this._updateBinds ();
				}
			}
		},

		unbind: function ( type, callback ) {
			if ( callback != null ) {
				// remove specific callback from array
				for ( var i = this._boundEvents.length - 1; i >= 0; i-- ) {
					var bindObj = this._boundEvents[i];
					if ( bindObj.type == type && bindObj.callback == callback ) {
						this._boundEvents.splice ( i, 1 );
					}
				}
			} else {
				if ( type != null ) {
					// remove all callbacks of type
					for ( var i = this._boundEvents.length - 1; i >= 0; i-- ) {
						var bindObj = this._boundEvents[i];
						if ( bindObj.type == type ) {
							this._boundEvents.splice ( i, 1 );
						}
					}
				} else {
					// remove all callbacks
					this._boundEvents = [];
				}
			}
		},

		// Playback Control wrapper methods
		play: function () {
			if (this._video != null) {
				if (this._isEnded != true || this._canReplay == true ) {
					this._isEnded = false;
					if ( this._image.is(":visible") ) {
						this._videoClick();
					} else {
						this._video.play();
					}
				}
			} else {
				this._videoClick();
			}
		},

		pause: function () {
			if (this._video != null) {
				this._video.pause();
			} else {
			}
		},

		seek: function (val) {
			if (this._video != null) {
				this._isEnded = false;
				this._video.currentTime = (val == 0) ? 0.1 : val.toFixed(1);
			}
		},

		reset: function () {
			if (this._video != null) {
				this._isEnded = false;
				this._video.pause();
				this._video.currentTime = 0.1;
			}
		},

		activate: function () {
			for ( var i = 0; i < VideoWrapper.instances.length; ++i) {
				var inst = VideoWrapper.instances[i];
				if ( inst.isActive() ) inst.closeVideo();
			}

			this._constructHTML(true);
			this._userCuePoints.setVideo ( this._video );

			this._video.load();
		},

		_removeBindings: function () {
			this._wrapper.unbind ()
			for (var i = 0; i < this._objectsToBind.length; ++i) {
				this._objectsToBind[i].unbind();
			}
		},

		_updateBinds: function () {
			if (this._video) {
				this._removeBindings ();

				for (var i = 0; i < this._boundEvents.length; ++i ) {
					var bindObj = this._boundEvents[i];
					if (bindObj) {
						var type = bindObj.type;
						var callback = bindObj.callback;
						this._wrapper.bind ( type, { target:this}, this.jQuery.proxy(callback, this));
						for (var i = 0; i < this._objectsToBind.length; ++i) {
							this._objectsToBind[i].bind ( type, { target:this}, this.jQuery.proxy(callback, this) );
						}
					}
				}
			}
		},

		_videoClick: function (e) {

			if (this._isEnded != true || this._canReplay == true) {
				this._isEnded = false;

				if ( this._video != null ) {
					this._videoPlay();
				} else {
					if (!this.isActive()) {
						this.activate();
					}

					for ( var i = 0; i < VideoWrapper.instances.length; ++i) {
						var inst = VideoWrapper.instances[i];
						if ( inst.isActive() ) inst.closeVideo();
					}

					this._constructHTML(true);
					this._userCuePoints.setVideo ( _video );

					this.Evt.addEvent ( this._video, 'canplay', this._videoPlayDelegate );
					this._video.load(); // Unnecessary step in chrome. Should help on iPad

					if ( !this._keepEvents ) {
						this._removeBindings();
					}
				}
			}
		},

		_videoPlay: function (e) {
			this.Evt.removeEvent ( this._video, 'canplay', this._videoPlayDelegate);
			if (!this._cuePoints) {
				this._cuePoints = new this.VideoCuePoints ( this._video );
				this._cuePoints.addCuePoint ( 0.2, 'start');
				this._cuePoints.addEventListener ( this.VideoCuePoints.CUE_POINT_EVENT, this.Delegate.createDelegate ( this, this._onStartCuePoint ) );
			}

			// Add Event Listeners!
			this.Evt.addEvent ( this._video, "play", this._onPlayDelegate );
			this.Evt.addEvent ( this._video, "pause", this._onPauseDelegate );
			this.Evt.addEvent ( this._video, "ended", this._onEndedDelegate );

			this._video.play();
		},

		_onPlay: function ( e ) {
			for (var i = 0; i < this._userPlayCallbacks.length; ++i ) {
				var callback = this._userPlayCallbacks[i];
				this.jQuery.proxy(callback, this);
				var proxyCallback = this.jQuery.proxy(callback, this);
				proxyCallback();
			}
		},

		_onPause: function ( e ) {
			for (var i = 0; i < this._userPauseCallbacks.length; ++i ) {
				var callback = this._userPauseCallbacks[i];
				this.jQuery.proxy(callback, this);
				var proxyCallback = this.jQuery.proxy(callback, this);
				proxyCallback();
			}
		},

		_onComplete: function ( e ) {
			_isEnded = true;

			for (var i = 0; i < this._userCompleteCallbacks.length; ++i ) {
				var callback = this._userCompleteCallbacks[i];
				var proxyCallback = this.jQuery.proxy(callback, this);
				proxyCallback();
			}
		},

		_onStartCuePoint: function ( obj ) {
			if (obj.name == 'start') {
				this._image.hide();
			}
		},

		_onCuePoint: function ( o ) {
			this.dispatchEvent ( this.VideoCuePoints.CUE_POINT_EVENT, o );
			//name: cuePoint.name, time: cuePoint.time, type: cuePoint.type
		},

		_constructHTML: function (isVideoActive) {
			var videoHTMLContent = (isVideoActive) ? '<video src="' + this._videoStr + '" id="' + this._idStr + '_vid"></video>' : '';
			var wrapperHTMLContent = '<img src="' + this._imageStr + '" height="768" width="1024" id="' + this._idStr + '_img">\n';
			wrapperHTMLContent += '<div class="video">' + videoHTMLContent + '</div>\n';
			this._wrapper.html ( wrapperHTMLContent );

			this._image = $( '#' + this._idStr + '_img')
			if ( isVideoActive ) this._video = document.getElementById( this._idStr + '_vid' );
		},

		_setBindings: function () {
			this._wrapper.bind("touchend click", this.Delegate.createDelegate ( this, this._videoClick ) );

			for ( var i = 0; i < this._objectsToBind.length; ++i ) {
				this._objectsToBind[i].bind("touchend click", this.Delegate.createDelegate ( this, this._videoClick) );
			}
		},

			});

	var namespace = new Namespace ( 'org.incrediberry.video' );
	namespace.VideoWrapper = VideoWrapper;

})();
