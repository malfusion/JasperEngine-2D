Jasper.SwingInterpolator = function(){
	
};

Jasper.SwingInterpolator.prototype = new Jasper.Interpolator();


Object.extend(Jasper.SwingInterpolator.prototype, {

	getValue: function(start, end, elapsed , dur){
		return start + (end-start) * ((- Math.cos(elapsed/dur * Math.PI) / 2) + 0.5);
	}
		
});
