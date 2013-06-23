Jasper.Animation = function(){

	this._name = "";
	this._started = false;
	this._paused = true;
	this._elapsedTime = 0 ;
	this._object = null;

	//the public variable is the name
	
	this.interpolator = "linear";
	this._interpolator = null;
	this.duration = Jasper.Constants.ANIM_SHORT_DURATION;

	this.onStart = function(){};
	this.onFrame = function(dt){};
	this.onPause = function(){};
	this.onResume = function(){};
	this.onEnd = function(){};

};


Jasper.Animation.prototype = {
	_setParentObject: function(obj){
		this._object = obj;
	},
	getParentObject: function(){
		return this._object;
	},
	getAnimName: function(){
		return this._name;
	},
	_setInterpolator: function(interpolator){
		if(interpolator instanceof Jasper.Interpolator){
			this._interpolator = interpolator;
		}
		else{
			throw Error("Not a valid interpolator");
		}
	},
	setOnStart: function(func){
		this.onStart = func;
	},
	setOnFrame: function(func){
		this.onFrame = func;
	},
	setOnPause: function(func){
		this.onPause = func;
	},
	setOnResume: function(func){
		this.onResume = func;
	},
	setOnEnd: function(func){
		this.onEnd = func;
	},
	_onStart: function(){
		this._started = true;
		this._paused = false;
		this.onStart();
	},
	_onPause: function(){
		this._paused = true;
		this.onPause();
	},
	_onResume: function(){
		this._paused = false;
		this.onResume();
	},
	_onEnd: function(){
		this.started = false;
		this.getParentObject().removeAnimation(this.getAnimName());
		this.onEnd();
	},
	_onFrame: function(dt){
		this.onFrame(dt);
	},
	_update: function(dt){
		this._onFrame(dt);
	},
	start: function(){
		this._started = true;
		this._paused = false;
		this._onStart();
	},
	reset: function(){
		this._started = false;
		this._paused = true;
		this._elapsedTime = 0;
	}
	

};