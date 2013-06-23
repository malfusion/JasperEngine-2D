/**
TODO: the core intermediary call in addobject remove

*/


Jasper.Object = function(objectName){

    this._id = Jasper.Object.ID++;
    this._layer = undefined;

    this._initWaiting = [];

    this._behaviors={};
    this._extraBehaviors={};
    this._rendererBehavior = null;
    
    this._anims ={};

    this.visible = false;
    
    this.posX = 0;
    this.posY = 0;
    this.height = 0;
    this.width = 0; 
    this._viewportX = 0;
    this._viewportY = 0;
    
    this.rotation = 0;
    this.alpha = 0;

    this._name=objectName;


//    this.core : undefined;
    this._scene = null;


};

Jasper.Object.prototype = {

        _update: function(dt){
            
            // Call All initialisations on newly attached behaviors
            if(this._initWaiting.length>0){
                var toInitBehav = this._initWaiting.pop();
                while(toInitBehav !== undefined){
                    toInitBehav.init();
                    toInitBehav = this._initWaiting.pop();
                }
            }

            for (var behavior in this._behaviors){
                //console.log(name+" : "+behavior);
                //try{
                this._behaviors[behavior].update(dt);
                //}
                /*catch(e){
                    console.log(behavior);
                    for(var b in this.getExtraBehaviors())
                    console.log(i);
                }*/

            }
        },

        _render: function(ctx){
            if(this._rendererBehavior instanceof Jasper.RenderableBehavior){
                this._rendererBehavior.renderBefore(ctx);
                this._rendererBehavior.render(ctx);
                this._rendererBehavior.renderAfter(ctx);
            }

        },
        _runAnimations: function(dt){
            for (var key in this._anims) {
                this._anims[key]._update(dt);
            }
            this._checkAnimationList();
        },
        _checkAnimationList: function(){
            var empty = false;
            for (var key in this._anims) {
                if (hasOwnProperty.call(this._anims, key))    { empty =  false; break; }
            }
            if(empty){
                Jasper._animationManager._unregisterObject(this);
            }
        },
        removeAnimation: function(animName){
            delete this._anims[animName];
            this._checkAnimationList();
        },
        addAnimation: function(animName, attrs){
            var anim = Jasper._animationManager._createAnimation(animName, attrs);
            this._anims[animName] = anim;
            anim._setParentObject(this);
            Jasper._animationManager._registerObject(this);
            return anim;
        },
        _onAddedToLayer: function(){
            Jasper._collisionManager._clearWaiting(this);
        },

        getPosX: function(){
            return this.posX;
        },
        setPosX: function(posx){
            this.posX=Math.floor(posx);
        },
        getPosY:function(){
            return this.posY;
        },
        setPosY: function(posy){
            this.posY=Math.floor(posy);
        },
        getViewportPos: function(){
            if(this.getLayer().isHud()){
                return [this.getPosX(), this.getPosY()];
            }else{
                return this.getLayer().getCamera().getViewportPos(this);
            }
        },
        setPos: function(x,y){
            this.posX=Math.floor(x); this.posY=Math.floor(y);
        },
        getAlpha:function(){
            return this.alpha;
        },
        setAlpha: function(val){
            this.alpha=val;
        },
        getRotationAngle:function(){
            return this.rotation*180/Math.PI;
        },
        setRotationAngle: function(val){
            this.rotation=val*Math.PI/180;
        },
        getRotationRadian: function(){
            return this.rotation;
        },
        setRotationARadian: function(val){
            this.rotation=val;
        },


        getLayer:function(){
            return this._layer;
        },
        _addInitWaiting: function(behavior){
            this._initWaiting.push(behavior);
        },
        //RETURNS: JasperBehavior Object
        addBehavior: function (behaviorName){                   //Can add both by string // NOT SURE: or by passing custom behavior object
            if(typeof (behaviorName) == "string"){
                var behavior = Jasper._behaviorManager._addBehaviorToObject(behaviorName, this);
                
                if(behavior instanceof Jasper.Behavior){


                    behavior._parent = this;
                    this._addInitWaiting(behavior);
                    if(Jasper._behaviorManager._isNonUpdateBehavior(behaviorName)){
                        console.log("extra behavior found:" +behaviorName);
                        this._extraBehaviors[behaviorName] = behavior;
                    }
                    else{
                        this._behaviors[behaviorName]=behavior;

                        /////////WILL IT WORK
                        if(behavior instanceof Jasper.RenderableBehavior){
                            console.log("renderer found");
                            this._rendererBehavior = behavior;
                        }
                    }
                    return behavior;
                }
            }
        },
        removeBehavior: function (behaviorName){
            Jasper._behaviorManager._deleteBehaviorFromObject(behaviorName,this);
            delete this._behaviors[behaviorName];

        },
        hasBehavior: function(behaviorName){
            inNormalBehaviors = this._hasNormalBehavior(behaviorName);
            inExtraBehaviors = this._hasExtraBehavior(behaviorName);

            return (inNormalBehaviors || inExtraBehaviors);
            
        },
        _hasNormalBehavior: function(behaviorName){
            inNormalBehaviors = (this._behaviors[behaviorName] !== undefined);
            return inNormalBehaviors;
        },
        _hasExtraBehavior: function(behaviorName){
            inExtraBehaviors = (this._extraBehaviors[behaviorName] !== undefined);
            return inExtraBehaviors;
        },
        getBehavior: function(behaviorName){
            if(this._hasNormalBehavior(behaviorName))
                return this._behaviors[behaviorName];
            else {
                if(this._hasExtraBehavior(behaviorName))
                    return this._extraBehaviors[behaviorName];
            }
        },
        setVisible: function(isVisible){
            this.visible=isVisible;
        },
        isVisible: function(){
            return this.visible;
        },



        // Custom Renderer Behavior overwrites all older behaviors and can be used for dynamic rendering
        setObjectRenderer: function(rendererBehaviorName){
            if(this._behaviors[rendererBehaviorName] instanceof Jasper.RendererBehavior)
                this._rendererBehavior = this._behaviors[rendererBehaviorName];
            else{
                throw Error("Cannot add behavior "+rendererBehaviorName+" as objectRenderer. Not a RenderableBehavior" );
            }
        },

        //DEBUG
        _getExtraBehaviors: function(){
            return this._extraBehaviors;
        },
        _getAllBehaviors: function(){
            return this._behaviors;
        }
    
};

Jasper.Object.ID = 0;
