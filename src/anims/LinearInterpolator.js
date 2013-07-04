Jasper.LinearInterpolator = function(){
	
};

Jasper.LinearInterpolator.prototype = new Jasper.Interpolator();


Object.extend(Jasper.LinearInterpolator.prototype, {

	getValue: function(start, end, elapsed , dur){
		return start+((end-start) * elapsed/dur * 1.0);
	}
		
});
