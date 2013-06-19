Jasper.SpriteManager = function(){
	
	//this.tempImage = new Image();
	//this.tempImage.src = "../assets/temp.png";

	// I'M SO PROUD OF MYSELF FOR THIS!!!

	this._loadingCache = {};
	this._spriteCache = {};
	this._waitingBehaviors = {};
	this._spriteNativeSizes = {};
	this._spriteRegionRect = {};

};


Jasper.SpriteManager.prototype = {
	setSprite: function(spriteBehavior, spritePath){
		if(this._spriteCache[spritePath] !== undefined){
			spriteBehavior._sprite = this._spriteCache[spritePath];
			spriteBehavior._nativeWidth = this._spriteCache[spritePath].width;
			spriteBehavior._nativeHeight = this._spriteCache[spritePath].height;
			spriteBehavior._adjustDimensions();
			spriteBehavior._loaded = true;
		}

		else if(this._loadingCache[spritePath] !== undefined){
			this._addToWaitingList(spriteBehavior, spritePath);
		}
		else{

			var img = new Image();
			img.spritePath = spritePath;
			this._loadingCache[spritePath] = img;
			this._addToWaitingList(spriteBehavior, spritePath);

			img.onload = function(){

				var spriteManager = Jasper._spriteManager;

				spriteManager._spriteCache[img.spritePath] = this;
				delete spriteManager._loadingCache[img.spritePath];

				spriteManager._clearWaitingBehaviors(img.spritePath);
			};
			img.src = spritePath;
		}	
		
		//spriteBehavior._sprite = this.tempImage;

	},
	_clearWaitingBehaviors: function(spritePath){
		if( this._waitingBehaviors[spritePath] !== undefined){
			var beh = this._waitingBehaviors[spritePath].pop();

			while(beh !== undefined){
				beh._sprite = this._spriteCache[spritePath];
				beh._nativeWidth = this._spriteCache[spritePath].width;
				beh._nativeHeight = this._spriteCache[spritePath].height;
				beh._adjustDimensions();
				beh._loaded = true;
				beh = this._waitingBehaviors[spritePath].pop();
			}
			delete this._waitingBehaviors[spritePath];
		}

	},

	_addToWaitingList: function(spriteBehavior,spritePath){
		if(this._waitingBehaviors[spritePath] === undefined)
				this._waitingBehaviors[spritePath]=[];
			this._waitingBehaviors[spritePath].push(spriteBehavior);
	}






};