$.fn.dragAnimatable = function(){
	this.draggable({
		axis: 'x',
		containment: this,
		drag: function(event, ui) {
			console.log(arguments);
		}
	});
};
