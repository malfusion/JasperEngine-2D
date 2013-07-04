Jasper.SizeAnimation = function(){
	this._name = "size";
	this.fromWidth = null;
	this.toWidth = null;
	this.fromHeight = null;
	this.toHeight = null;
};



Jasper.SizeAnimation.prototype = new Jasper.Animation();


Object.extend(Jasper.SizeAnimation.prototype, {

	_update: function(dt){
		if(this._started && !this._paused){
			this._elapsedTime+=dt;
			if(this._elapsedTime >=this.duration){
				if(this.loop === true){
					this._elapsedTime%=this.duration;
					this._setSize();
					this._onFrame(dt);	
					return;	
				}
				this._setSize(true);
				this._onFrame(dt);
				this._onEnd(dt);
			}
			else{
				this._setSize();
				this._onFrame(dt);
			}
		}
	},

	_setSize: function(final){
		if(final){
			this.getParentObject().setWidth(this.toWidth);
			this.getParentObject().setHeight(this.toHeight);	
		}
		else{
			this.getParentObject().setWidth(
				this._interpolator.getValue(
					this.fromWidth, this.toWidth, this._elapsedTime, this.duration
					)
				);
			this.getParentObject().setHeight(
				this._interpolator.getValue(
					this.fromHeight, this.toHeight, this._elapsedTime, this.duration
					)
				);
		}
	}






});