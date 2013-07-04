Jasper.RotateAnimation = function(){
	this._name = "rotate";
	this.fromRadian = null;
	this.fromAngle = null;
	this.toRadian = null;
	this.toAngle = null;
};



Jasper.RotateAnimation.prototype = new Jasper.Animation();


Object.extend(Jasper.RotateAnimation.prototype, {

	_update: function(dt){
		if(this._started && !this._paused){
			this._elapsedTime+=dt;
			if(this._elapsedTime >=this.duration){
				if(this.loop === true){
					this._elapsedTime%=this.duration;
					this._setRotation();
					this._onFrame(dt);	
					return;	
				}
				this._setRotation(true);
				this._onFrame(dt);
				this._onEnd(dt);
			}
			else{
			this._setRotation();
			this._onFrame(dt);
			}
		}
	},

	_setRotation: function(final){
		if(this.fromRadian === null && this.toRadian === null){
			if(final)
				this.getParentObject().setRotationAngle(this.toAngle);
			else
				this.getParentObject().setRotationAngle(
					this._interpolator.getValue(
						this.fromAngle, this.toAngle, this._elapsedTime, this.duration
						)
					);
		}
		else{
			if(final)
				this.getParentObject().setRotationRadian(this.toRadian);
			else
				this.getParentObject().setRotationRadian(
					this._interpolator.getValue(
						this.fromRadian, this.toRadian, this._elapsedTime, this.duration
						)
					);
		}
	}






});