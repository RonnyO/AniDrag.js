(function( $ ){
	$.dragAnimatable = {};
	var _o = $.dragAnimatable;

  $.fn.dragAnimatable = function( options ){

	var settings = {
		start: 0,
		end: 93,
		initial: 93,
		tickDuration: 11,
		snapTo: {
			0: [0, 17],
			25: [18, 30],
			41: [31, 46],
			93: [47, 93]
		},
		pattern: 'assets/smartcover0.jpg',
		calculateStep: null
	};

	var methods = {
		init: function( options ){
			if ( options ) $.extend( settings, options );
			methods.calculateStep = settings.calculateStep || methods.calculateStep;
			
			// cache
			_o.$this = this;
			_o.thisLeftOffset = _o.$this.offset().left;
			_o.thisTopOffset = _o.$this.offset().top;
			_o._current = settings.initial;
			
			// calculate pixels per step
			_o._steps = settings.end - settings.start + 1;
			_o._step = parseInt(this.width() / _o._steps, 10);
			
			// Make this draggable
			this.draggable({
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
				frames[i] = settings.pattern.replace('0', i);
				new Image().src = frames[i];
			}
		},
		
		start: function( event, ui ) {
			_o._start = {
				x: event.clientX - _o.thisLeftOffset,
				y: event.clientY - _o.thisTopOffset
			};
			
			// iPad specific - Starting from the first frame should flip directions
			_o._flip = _o._current == 0;
		},
		
		modifier: function(){
			var ret = _o.pixels;
			
			console.log(_o.pixels, _o.beforePixels);
			
			// flip direction
			if (_o._flip) ret *= -1;
			return ret;
		},
		
		drag: function( event, ui ) {
			var move, target;
			// calculate steps to take
			_o.beforePixels = _o.pixels;
			_o.pixels = (event.clientY - _o._start.y + event.clientX - _o._start.x);
			_o.pixels = methods.modifier();
			
			move = parseInt( _o.pixels / _o._step, 10);
			// constrain movement
			target = _o._current + move;
			if (target > settings.end || target < settings.start) move = 0;
			
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
		
		animate: function( steps, target ){
			var tickDuration = settings.tickDuration,
				direction = _o._current > target ? -1 : 1,
				animation = function(){
					if ( steps ) {
						methods.update( _o._current + direction );
						steps--;
						setTimeout( animation, tickDuration );
					}
				};
			setTimeout( animation, tickDuration );
		},
		
		stop: function( event, ui ) {			
			var snapTo = 0,
				steps;
				
			// helper method: returns snapTo number based on which range surrounds n
			function snap(n, ranges) {
				var ret = 0;
				$.each(ranges, function(i, range){
					if ( n >= range[0] && n <= range[1] ) ret = i;
				});
				
				return ret;
			}
			
			// calculate closest snap and count steps
			snapTo = +snap(_o._current, settings.snapTo);
			steps = Math.abs(snapTo - _o._current);
			
			// go!
			methods.animate(steps, snapTo, settings.snapDuration);
		}
	};
	
	methods.init.apply(this, arguments);
  };
	
})( jQuery );