Jasper.MoveAnimation = function(){
	this._name = "move";
	this.fromX = null;
	this.fromY = null;
	this.toX = null;
	this.toY = null;
};



Jasper.MoveAnimation.prototype = new Jasper.Animation();


Object.extend(Jasper.MoveAnimation.prototype, {


	_update: function(dt){
		if(this._started && !this._paused){
			this._elapsedTime+=dt;
			if(this._elapsedTime >=this.duration){
				this.getParentObject().setPos(this.toX, this.toY);
				this._onFrame(dt);
				this._onEnd(dt);
			}
			else{
			this.getParentObject().setPos(
				this._interpolator.getValue(this.fromX, this.toX, this._elapsedTime, this.duration),
				this._interpolator.getValue(this.fromY, this.toY, this._elapsedTime, this.duration));
			this._onFrame(dt);
			}
		}
	},






});