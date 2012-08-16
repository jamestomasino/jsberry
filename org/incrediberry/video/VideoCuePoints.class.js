(function() {
	"use strict";

	var VideoCuePoints = my.Class( Namespace.import ( null, 'org.incrediberry.events.EventDispatcher' ), {

		STATIC: {
			CUE_POINT_EVENT: 'VideoCuePoints_CUE_POINT_EVENT',
			CUE_POINT_TYPE: 'javascript'
		},

		constructor: function( video ) {

			Namespace.import ( this, 'org.incrediberry.utils.Delegate' );
			Namespace.import ( this, 'org.incrediberry.video.CuePoint' );

			VideoCuePoints.Super.call(this);

			// Store references for removeEventListeners later
			this._onTimeUpdateDelegate = this.Delegate.createDelegate ( this, this._onTimeUpdate );
			this._onSeekingDelegate    = this.Delegate.createDelegate ( this, this._onSeeking );
			this._onSeekedDelegate     = this.Delegate.createDelegate ( this, this._onSeeked );

			this.video         = null;  // Video Object
			this.time          = -1;    // Number
			this.firstCuePoint = null;  // CuePoint
			this.isSeeking     = false; // boolean

			if ( video ) this.setVideo ( video );
		},

		clearVideo: function () {
			if (this.video) {
				this.video.removeEventListener ( "timeupdate", this._onTimeUpdateDelegate  );
				this.video.removeEventListener ( "seeking", this._onSeekingDelegate );
				this.video.removeEventListener ( "seeked", this._onSeekedDelegate );
				this.video = null;
				this.time = -1;
			}
		},

		getVideo: function () { return this.video; },
		setVideo: function ( val ) {
			this.clearVideo();
			this.video = val;
			this.video.addEventListener ( "timeupdate", this._onTimeUpdateDelegate );
			this.video.addEventListener ( "seeking", this._onSeekingDelegate );
			this.video.addEventListener ( "seeked", this._onSeekedDelegate );
		},

		getNextCuePoint: function ( ) {

			// If no video loaded or not started, return null
			if ( this.time == -1 || this.video === null ) return null;

			var cuePoint = this.firstCuePoint;

			while (cuePoint) {
				if (this.time >= cuePoint.time) {
					// Time is ahead of cuepoint. Skip it
				} else {
					// Cuepoint is ahead of time. That's it.
					var o = { name: cuePoint.name, time: cuePoint.time, type: cuePoint.type };
					return o;
				}
				cuePoint = cuePoint.next;
			}

			// if nothing found, return null
			return null;

		},

		getPrevCuePoint: function ( buffer ) {
			// This function needs a buffer after a cuepoint where it can jump back earlier even if it is after
			var bufferPrevTime = ( typeof (buffer) != 'undefined' ) ? buffer : 1;

			// If no video loaded or not started, return null
			if ( this.time == -1 || this.video === null ) return null;

			var cuePoint = this.firstCuePoint;
			var lastCuePoint = null;

			while (cuePoint) {
				if (this.time - bufferPrevTime >= cuePoint.time) {
					// Time is ahead of cuepoint. Skip it
				} else {
					// Cuepoint is ahead of time. previous cuepoint is one back (will this work?)
					if (lastCuePoint) {
						return { name: lastCuePoint.name, time: lastCuePoint.time, type: lastCuePoint.type };
					} else {
						return null;
					}
				}

				lastCuePoint = cuePoint;
				cuePoint = cuePoint.next;
			}

			// if nothing found, return null
			return lastCuePoint;

		},

		addCuePoint: function ( time, label ) {
			var prevCuePoint = this.firstCuePoint;

			if ( prevCuePoint !== null && prevCuePoint.time > time ) {
				prevCuePoint = null;
			} else {
				while (prevCuePoint !== null && prevCuePoint.time <= time && prevCuePoint.next !== null && prevCuePoint.next.time <= time) {
					prevCuePoint = prevCuePoint.next;
				}
			}

			var cuePoint = new this.CuePoint ( time, label, VideoCuePoints.CUE_POINT_TYPE, prevCuePoint );

			if ( prevCuePoint === null )
			{
				if ( this.firstCuePoint !== null )
				{
					this.firstCuePoint.prev = cuePoint;
					cuePoint.next = this.firstCuePoint;
				}

				this.firstCuePoint = cuePoint;
			}
		},

		removeCuePoint: function ( timeNameOrCuePoint ) {
			var cuePoint = this.firstCuePoint;

			while (cuePoint !== null) {
				if (cuePoint === timeNameOrCuePoint || cuePoint.time == timeNameOrCuePoint || cuePoint.name == timeNameOrCuePoint) {
					if (cuePoint.next !== null) {
						cuePoint.next.prev = cuePoint.prev;
					}

					if (cuePoint.prev !== null) {
						cuePoint.prev.next = cuePoint.next;
					} else if (cuePoint == this.firstCuePoint) {
						this.firstCuePoint = cuePoint.next;
					}

					cuePoint.next = cuePoint.prev = null;

					return;
				}

				cuePoint = cuePoint.next;
			}

			return;
		},

		_onTimeUpdate: function ( e ) {
			if ( this.firstCuePoint !== null ) {
				if ( this.time != this.video.currentTime ) {
					if (!this.isSeeking) {
						var nextCuePoint = null;
						var cuePoint = this.firstCuePoint;

						while (cuePoint) {
							nextCuePoint = cuePoint.next;

							if ( this.time < cuePoint.time && cuePoint.time <= this.video.currentTime ) {
								var o = { name: cuePoint.name, time: cuePoint.time, type: cuePoint.type };
								this.dispatchEvent ( VideoCuePoints.CUE_POINT_EVENT, o );
							}

							cuePoint = nextCuePoint;
						}
					}

					this.time = this.video.currentTime;
				}
			}
		},

		_onSeeking: function ( e )
		{
			this.isSeeking = true;
		},

		_onSeeked: function ( e )
		{
			this.time = this.video.currentTime;
			this.isSeeking = false;
		},

		// Cleanup and Debug
		destroy: function () {
			this.clearVideo();

			// remove cuepoints
			var cuepoint = this.firstCuePoint;
			while (cuepoint) {
				var nextCuePoint = cuepoint.next;
				cuepoint.destroy();
				cuepoint = nextCuePoint;
			}
		},

		toString: function () {
			var returnstr = '';
			return returnstr;
		}

	});

	var namespace = new Namespace ( 'org.incrediberry.video' );
	namespace.VideoCuePoints = VideoCuePoints;

})();

