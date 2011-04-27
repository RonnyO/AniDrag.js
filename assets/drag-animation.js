(function( $ ){
	$.dragAnimatable = {
		pattern: new RegExp(/\${\d+}/)
	};
	var _o = $.dragAnimatable;

  $.fn.dragAnimatable = function( options ){

	var settings = {
		start: 0,
		end: 93,
		initial: 93,
		snapTo: [41],
		pattern: 'assets/smartcover${0}.jpg'
	};

	var methods = {
		init: function( options ){
			if ( options ) $.extend( settings, options );
			
			// cache
			_o.$this = this;
			_o.thisLeftOffset = _o.$this.offset().left;
			_o._current = settings.initial;
			
			// calculate pixels per step
			_o._steps = settings.end - settings.start + 1;
			_o._step = parseInt(this.width() / _o._steps, 10);
			
			// add edges to snapTo points
			settings.snapTo.unshift(settings.start);
			settings.snapTo.push(settings.end);
			
			// Make this draggable
			this.draggable({
				axis: 'x',
				containment: this,
				start: methods.start,
				drag: methods.drag,
				stop: methods.stop
			});
			
			$(window).load(methods.preload);
		},
		
		preload: function(){
			var i,
				frames = [];			
			
			for (i = settings.start; i <= settings.end; i++) {
				frames[i] = settings.pattern.replace(_o.pattern, i);
				new Image().src = frames[i];
			}
			
			// adding a callout when preloader is done could be a nice touch
		},
		
		start: function( event, ui ) {
			$.dragAnimatable._startX = event.clientX - _o.thisLeftOffset;
		},
		
		drag: function( event, ui ) {
			// calculate steps to take
			var _x = event.clientX - _o.thisLeftOffset,
				move = parseInt((_x - _o._startX) / _o._step, 10),
				// constrain movement
				target = _o._current + move;

				move = (target > settings.end || target < settings.start) ? 0 : move;
				// target frame after movement
				target = _o._current + move;
				
			// for each actual step, update frame
			if (_o._current !== target)	methods.update(target);
		},
		
		update: function(frame) {
			var	src = settings.pattern.replace(_o.pattern, frame);
			_o.$this.attr('src', src);
			_o._current = frame;
		},
		
		stop: function( event, ui ) {			
			// calculate closest snap
			var snapTo = settings.snapTo.closest(_o._current),
				steps = Math.abs(_o._current - snapTo);

			// snap to it
		}
	};
	
	methods.init.apply(this, arguments);
  };
  
	// Helper method - Find the closest number in an array
	// Thanks, http://stackoverflow.com/questions/4811536/find-the-number-in-an-array-that-is-closest-to-a-given-number/4811666#4811666
	Array.prototype.closest = function( n ){
		var i = 0, _a = [];
		for ( i; i < this.length; i++ ) {
			_a[i] = Math.abs( n - this[i] );
		}
		min = Math.min.apply( this, _a );
		f = _a.indexOf( min );
		return this[f];
	};
})( jQuery );