Jasper.AlphaAnimation = function(){
	this._name = "alpha";
	this.fromAlpha = null;
	this.toAlpha = null;
};



Jasper.AlphaAnimation.prototype = new Jasper.Animation();


Object.extend(Jasper.AlphaAnimation.prototype, {

	_update: function(dt){
		if(this._started && !this._paused){
			this._elapsedTime+=dt;
			if(this._elapsedTime >=this.duration){
				this.getParentObject().setAlpha(this.toAlpha);
				this._onFrame(dt);
				this._onEnd(dt);
			}
			else{
			this.getParentObject().setAlpha(
				this._interpolator.getValue(this.fromAlpha, this.toAlpha, this._elapsedTime, this.duration));
			this._onFrame(dt);
			}
		}
	},






});