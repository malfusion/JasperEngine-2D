Jasper.Camera = function(args){

	this.posX=0;
	this.posY=0;

	this.width = args.width;
	this.height = args.height;

	this.worldWidth=args.worldWidth;
	this.worldHeight=args.worldHeight;



};




Jasper.Camera.prototype = {
	setCameraX: function(x){
		if(x+this.width <= this.worldWidth  &&  x>=0)
			this.posX=Math.floor(x);
		return this;
	},
	setCameraY: function(y){
		if(y>=0  &&  y+this.height <= this.worldHeight)
			this.posY=Math.floor(y);
		return this;
	},
	setCameraPos: function(x,y){
		if(x+this.width <= this.worldWidth  &&  x>=0)
			this.posX=Math.floor(x);
		if(y>=0  &&  y+this.height <= this.worldHeight)
			this.posY=Math.floor(y);
	},

	getCameraX: function(){
		return this.posX;
	},
	getCameraY: function(){
		return this.posY;
	},
	getCameraPos: function(){
		return [this.posX, this.posY];
	},


	followObject: function(obj, offsetX, offsetY){

	},

	getViewportPos: function(obj){
		return [obj.getPosX()-this.posX, obj.getPosY()-this.posY];
	}




};