(function( $ ){
	$.dragAnimatable = {};

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
			
			methods.preload();
		},
		
		preload: function(){
			var i,
				images = [],
				pattern = new RegExp(/\${\d+}/);			
			
			for (i = settings.start; i <= settings.end; i++) {
				images[i] = settings.pattern.replace(pattern, i);
				//console.log(images[i]);
			}
		},
		
		start: function( event, ui ) {
			$.dragAnimatable._startX = event.clientX - $(event.target).offset().left;
		},
		
		drag: function( event, ui ) {
			var _x = event.clientX - $(event.target).offset().left,
				_startX = $.dragAnimatable._startX,
				_step = $.dragAnimatable._step,
				_move = parseInt((_x - _startX) / _step, 10);
				console.info('Move', _move, 'steps from here');
			// for each step, change picture
		},
		
		stop: function( event, ui ) {
			console.log(arguments);
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