Jasper.AnimationManager = function(){
	
	this._objectsToAnimate = [];
	this._animLookup = {
		"move": Jasper.MoveAnimation,
		"movex": Jasper.MoveXAnimation,
		"movey": Jasper.MoveYAnimation,
		"alpha": Jasper.AlphaAnimation,
		"rotate": Jasper.RotateAnimation,
		"size": Jasper.SizeAnimation
	};

	this._interpolatorLookup = {
		"linear": Jasper.LinearInterpolator,
		"swing": Jasper.SwingInterpolator
	};



};

Jasper.AnimationManager.prototype = {
	
	_runAnimations: function(dt){
		var len = this._objectsToAnimate.length;
		for (var i=0; i<len; i++){
			this._objectsToAnimate[i]._runAnimations(dt);
		}
	},

	_registerObject: function(obj){
		var indx = this._objectsToAnimate.indexOf(obj);
		if(indx === -1){
			this._objectsToAnimate.push(obj);
		}
	},

	_unregisterObject: function(obj){
		var indx = this._objectsToAnimate.indexOf(obj);
		if(indx !== -1){
			this._objectsToAnimate.splice(indx,1);
		}
	},

	_createAnimation: function(animName, attrs){
		var anim = new this._animLookup[animName]();
		if(anim === undefined){
			return null;
		}
		Object.extend(anim, attrs);
		anim._setInterpolator(new this._interpolatorLookup[anim.interpolator]());
		return anim;
	}


	
};	