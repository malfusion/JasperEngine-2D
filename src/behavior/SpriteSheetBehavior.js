/*
    ERROR: init missing from object. workaround temp init function. Need to find out how to extend.

*/



// ADD LOOP TO ACTIONS and Loop TIMES

Jasper.SpriteSheetFrameAction = function(args){
    this._name = args.name;
    this._currentFrame = 0 ;
    this._frames = args.frames;
    this._ended = false;
    this._paused = false;
    this._loop = args.loop;
};
Jasper.SpriteSheetTimeAction = function(args){
    this._name = args.name;
    this._elapsed = 0;
    this._currentFrame = 0;
    this._duration = args.duration;
    this._frames = args.frames;
    this._numFrames = this._frames.length;
    this._ended = false;
    this._paused = false;
    this._loop = args.loop;

};
Jasper.SpriteSheetFrameAction.prototype = {
    _getCurrentFrame: function(){
        return this._frames[this._currentFrame];
    },
    _update: function(){
            if(!this._ended){
                this._currentFrame++;
                if(this._currentFrame >= this._frames.length){
                    if(this._loop)
                        this._reset();
                    
                    else{
                        this._currentFrame--;
                        this._ended=true;
                    }
                }
            }
    },
    _reset: function(){
        this._currentFrame=0;
        this._ended = false;
        this._paused = false;
        return this;
    }



};

Jasper.SpriteSheetTimeAction.prototype = {
    _getCurrentFrame: function(){
        return this._frames[this._currentFrame];
    },
    _update: function(dt){
            if(!this._ended){

                this._elapsed += dt;
                if(this._elapsed >= this._duration){
                    if(this._loop)
                        this._reset();
                    
                    else{
                        this._currentFrame = this._frames.length-1;
                        this._ended=true;
                    }
                }else{
                this._currentFrame = Math.floor((this._elapsed/this._duration)*this._numFrames*1);
                }
            }
    },
    _reset: function(){
        this._currentFrame = 0;
        this._elapsed = 0;
        this._ended = false;
        this._paused = false;
        return this;
    }


};

Jasper.SpriteSheetBehavior = function(){


    this.spritesheet = "";
    this.actions = {};
    this.width = 0;
    this.height = 0;
    this.fWidth = 0;
    this.fHeight = 0;

    this._nativeWidth = 0;
    this._nativeHeight = 0;
    this._scaleX = 1;
    this._scaleY = 1; 
    this._sprite = null;
    this._path = '';
    this._loaded = false;

    this._sprite=null;

    this._toAdjust = false;
    
    //will change to object when demanded
    this._currentAction = 0;


    this._numFramesRow = 0;
    this._paused = false;


};

Jasper.SpriteSheetBehavior.prototype = new Jasper.RenderableBehavior();

Object.extend(Jasper.SpriteSheetBehavior.prototype, {
       
        _attr: function(args){
            if(args.spritesheet === undefined || args.actions === undefined ||
            args.frameWidth === undefined || args.frameHeight === undefined){

                throw Error("not enough information during spritesheet creation");
            }
            this.spritesheet = args.spritesheet;
            this._setSprite(this.spritesheet);

            for(var action in args.actions){
                var actObj = {};
                actObj.name = action;
                if(args.actions[action].loop !== undefined)
                    actObj.loop = args.actions[action].loop ;
                else
                    actObj.loop = false;

                if(args.actions[action].frames !== undefined){
                    actObj.frames = args.actions[action].frames;
                }else{
                    var frames = [];
                    for (var i=args.actions[action].from; i<=args.actions[action].to; i++){
                        frames.push(i);
                    }
                    actObj.frames = frames;
                }


                if(args.actions[action].duration !== undefined){
                    //Time based action
                    actObj.duration = args.actions[action].duration;

                    act = new Jasper.SpriteSheetTimeAction( actObj );
                    this.actions[action] = act;
                }
                else{
                    //Frame based action
                    act = new Jasper.SpriteSheetFrameAction( actObj );
                    this.actions[action] = act;
                }
            }

            this.fWidth = args.frameWidth;
            this.fHeight = args.frameHeight;

            if(args.width !== undefined)
                this.getParentObject().setWidth(args.width);
            if(args.height !== undefined)
                this.getParentObject().setHeight(args.height);

            return this;

        },

        update: function(dt){
            if(typeof(this._currentAction) !== "number" && this._paused === false)
                this._currentAction._update(dt);
        },

        render:function(ctx){
           if(this._loaded){
                parent = this.getParentObject();
                pos = parent.getViewportPos();
                if(typeof(this._currentAction) === "number" )
                    curr = this._currentAction;
                else
                    curr = this._currentAction._getCurrentFrame();
                
                ctx.drawImage(this._sprite, 
                    curr%this._numFramesRow*this.fWidth,
                    Math.floor(curr/this._numFramesRow)*this.fHeight,
                    this.fWidth, this.fHeight,
                    pos[0], pos[1], parent.width, parent.height);
            }
        },      

        

        _setSprite: function(path){
            if(this._path != path){
                this._path = path;
                Jasper._spriteManager.setSprite(this, this._path);
            }
            return this;
        },
        gotoFrame: function(frame){
            this._currentAction = frame;
        },
        runAction: function(action){
           
            this._currentAction = this.actions[action]._reset();
        },
        pause: function(){
            this._paused = true;
        },
        resume: function(){
            this._paused = false;
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
            return this.getParentObject().height;
        },
        getWidth: function(){
            return this.getParentObject().width;
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

                this._numFramesRow = Math.floor(this._nativeWidth/this.fWidth*1.0);
            if(this._toAdjust){
                parent = this.getParentObject();

                parent.setWidth(Math.floor(this._nativeWidth*this._scaleX));
                parent.setHeight(Math.floor(this._nativeHeight*this._scaleY));
            }
        }
     
});