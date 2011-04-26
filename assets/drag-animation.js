(function( $ ){
	$.dragAnimatable = {};

  $.fn.dragAnimatable = function( method ){
	var settings = {};

	var methods = {
		init: function( options ){
			if ( options ) $.extend( settings, options );
			
			// Make it draggable
			this.draggable({
				axis: 'x',
				containment: this,
				drag: methods.drag,
				stop: methods.stop
			});
		},
		
		drag: function( event, ui ) {
			console.log(arguments);
		},
		
		stop: function( event, ui ) {
			console.log(arguments);
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