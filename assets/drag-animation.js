(function( $ ){
	$.dragAnimatable = {
		pattern: new RegExp(/\${\d+}/)
	};
	var _o = $.dragAnimatable;

  $.fn.dragAnimatable = function( method ){
	var settings = {
		start: 0,
		end: 93,
		initial: 93,
		pattern: 'assets/smartcover${0}.jpg'
	};

	var methods = {
		init: function( options ){
			var _steps;
			_o.$this = this;
			_o.thisLeftOffset = _o.$this.offset().left
			
			
			if ( options ) $.extend( settings, options );
			
			// Make it draggable
			this.draggable({
				axis: 'x',
				containment: this,
				start: methods.start,
				drag: methods.drag,
				stop: methods.stop
			});
			
			_steps = settings.end - settings.start + 1;
			$.dragAnimatable._step = parseInt(this.width() / _steps, 10);
			$.dragAnimatable._current = settings.initial;
			
			methods.preload();
		},
		
		preload: function(){
			var i,
				images = [];			
			
			for (i = settings.start; i <= settings.end; i++) {
				images[i] = settings.pattern.replace(_o.pattern, i);
				new Image().src = images[i];
			}
		},
		
		start: function( event, ui ) {
			$.dragAnimatable._startX = event.clientX - _o.thisLeftOffset;
		},
		
		drag: function( event, ui ) {
			var _x = event.clientX - _o.thisLeftOffset,
				move = parseInt((_x - _o._startX) / _o._step, 10),
				// constrain movement
				target = _o._current + move;

				move = (target > settings.end || target < settings.start) ? 0 : move;
				target = _o._current + move;
				
			// for each step, change picture
			if (_o._current !== target)	methods.keyFrame(target);
		},
		
		keyFrame: function(frame) {
			var	src = settings.pattern.replace(_o.pattern, frame);
			_o.$this.attr('src', src);
			_o._current = frame;
		},
		
		stop: function( event, ui ) {
			// calculate closest snap
			// snap to it
		}
	};
	
	// Method calling logic
	if ( methods[method] ) {
		return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	} else if ( typeof method === 'object' || ! method ) {
		return methods.init.apply( this, arguments );
	} else {
		$.error( 'Method ' +  method + ' does not exist on jQuery.dragAnimatable' );
	}
  };
})( jQuery );