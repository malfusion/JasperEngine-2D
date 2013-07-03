/*
    ERROR: init missing from object. workaround temp init function. Need to find out how to extend.

*/



Jasper.SpriteBehavior = function(){

    this.path = '';

    this._nativeWidth = 0;
    this._nativeHeight = 0;
    this._scaleX = 1;
    this._scaleY = 1; 
    this._sprite = null;
    this._loaded = false;
    this._toAdjust = false;


};

Jasper.SpriteBehavior.prototype = new Jasper.RenderableBehavior();

Object.extend(Jasper.SpriteBehavior.prototype, {
        _attr: function(args){
            console.log("_attr");
            if(args.width !== undefined)
                this.setWidth(args.width);
            if(args.height !== undefined)
                this.setHeight(args.height);
            if(args.path !== undefined)
                this.setSprite(args.path);
            return this;
        },

        update: function(dt){},

        render:function(ctx){
            if(this._loaded){
                parent = this.getParentObject();
                pos = parent.getViewportPos();
                ctx.drawImage(this._sprite, pos[0], pos[1], parent.width, parent.height);
            }
        },      

        setSprite: function(path){
            
            if(this.path != path){
                this.path = path;
                Jasper._spriteManager.setSprite(this, this.path);
            }
            return this;
        },
        setHeight: function(height){
            this.getParentObject().setHeight(height);
            return this;
        },
        setWidth: function(width){
            this.getParentObject().setWidth(width);
            return this;
        },
        getHeight: function(){
            return this.getParentObject().getHeight();
        },
        getWidth: function(){
            return this.getParentObject().getWidth();
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
        _setLoaded: function(loaded){
            this._loaded = loaded;
        },
        _adjustDimensions: function(){
            
                this._nativeWidth = this._sprite.width;
                this._nativeHeight = this._sprite.height;
            if(this._toAdjust){
                parent = this.getParentObject();
                parent.width=Math.floor(this._nativeWidth*this._scaleX);
                parent.height=Math.floor(this._nativeHeight*this._scaleY);
            }
        }
     
});