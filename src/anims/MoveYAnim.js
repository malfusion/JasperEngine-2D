Jasper.MoveYAnimation = function(){
	this._name = "movey";
	this.fromY = null;
	this.toY = null;
};



Jasper.MoveYAnimation.prototype = new Jasper.Animation();


Object.extend(Jasper.MoveYAnimation.prototype, {


	_update: function(dt){
		if(this._started && !this._paused){
			this._elapsedTime+=dt;
			if(this._elapsedTime >=this.duration){
				this.getParentObject().setPosY(this.toY);
				this._onFrame(dt);
				this._onEnd(dt);
			}
			else{
			this.getParentObject().setPosY(
				this._interpolator.getValue(this.fromY, this.toY, this._elapsedTime, this.duration)
				);
			this._onFrame(dt);
			}
		}
	},






});