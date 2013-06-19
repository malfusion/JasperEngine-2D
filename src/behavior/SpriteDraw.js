/*
    ERROR: init missing from object. workaround temp init function. Need to find out how to extend.

*/



Jasper.SpriteBehavior = function(){

    this._nativeWidth = 0;
    this._nativeHeight = 0;
    this._scaleX = 1;
    this._scaleY = 1; 
    this._sprite = null;
    this._path = '';
    this._loaded = false;

    this._sprite=null;

    this._toAdjust = false;


};

Jasper.SpriteBehavior.prototype = new Jasper.RenderableBehavior();

Object.extend(Jasper.SpriteBehavior.prototype, {
        init:function(){
            
        },
        update: function(dt){},

        render:function(ctx){
            if(this._loaded){
                parent = this.getParentObject();
                ctx.drawImage(this._sprite, parent.posX, parent.posY, parent.width, parent.height);
            }
        },      

        setSprite: function(path){
            this._path = path;
            Jasper._spriteManager.setSprite(this, this._path);
            return this;
        },
        setHeight: function(height){
            this.getParentObject().height=Math.floor(height);
            return this;
        },
        setWidth: function(width){
            this.getParentObject().width=Math.floor(width);
            return this;
        },
        getHeight: function(){
            return this.getParentObject.height;
        },
        getWidth: function(){
            return this.getParentObject.width;
        },
        getNativeHeight: function(){
            return this._nativeHeight;
        },
        getNativeWidth: function(){
            return this._nativeWidth;
        },
        setScaleX: function(scaleX){
            this._toAdjust = true;
            this.getParentObject().width=Math.floor(this._nativeWidth*this._scaleX);
            this._scaleX = scaleX;
            return this;
        },
        setScaleY: function(scaleY){
            this._toAdjust = true;
            this.getParentObject().height=Math.floor(this._nativeHeight*this._scaleY);
            this._scaleY = scaleY;
            return this;
        },
        getScaleX: function(){
            return this._scaleX;
        },
        getScaleY: function(){
            return this._scaleY;
        },
        _adjustDimensions: function(){
            if(this._toAdjust){
                parent = this.getParentObject();
                parent.width=Math.floor(this._nativeWidth*this._scaleX);
                parent.height=Math.floor(this._nativeHeight*this._scaleY);
            }
        }
     
});