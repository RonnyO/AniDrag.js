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
		snapTo: {
			0: [0, 17],
			25: [18, 30],
			41: [31, 46],
			93: [47, 93]
		},
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
			var snapTo = 0;
			// calculate closest snap
			function snap(n, ranges) {
				var ret = 0;
				$.each(ranges, function(i, range){
					if ( n >= range[0] && n <= range[1] ) ret = i;
				});
				return ret;
			}			
			snapTo = snap(_o._current, settings.snapTo);

			// snap to it
			
		}
	};
	
	methods.init.apply(this, arguments);
  };
	
})( jQuery );