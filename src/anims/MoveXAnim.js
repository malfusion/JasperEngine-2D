Jasper.MoveXAnimation = function(){
	this._name = "movex";
	this.fromX = null;
	this.toX = null;
};



Jasper.MoveXAnimation.prototype = new Jasper.Animation();


Object.extend(Jasper.MoveXAnimation.prototype, {


	_update: function(dt){
		if(this._started && !this._paused){
			this._elapsedTime+=dt;
			if(this._elapsedTime >=this.duration){
				this.getParentObject().setPosX(this.toX);
				this._onFrame(dt);
				this._onEnd(dt);
			}
			else{
			this.getParentObject().setPosX(
				this._interpolator.getValue(this.fromX, this.toX, this._elapsedTime, this.duration)
				);
			this._onFrame(dt);
			}
		}
	},






});