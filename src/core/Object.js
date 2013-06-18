/**
TODO: the core intermediary call in addobject remove

*/


Jasper.Object = function(objectName){

    this._id = Jasper.Object.ID++;
    this._layer = null;


    this._behaviors={};
    this._extraBehaviors={};
    this._rendererBehavior = null;
    
    this.visible = false;
    
    this.posX = 0;
    this.posY = 0;
    this.worldX = 0;
    this.worldY = 0;
    this.rotation = 0;
    this.alpha = 0;

    this._name=objectName;

//    this.core : undefined;
    this._scene = null;

};

Jasper.Object.prototype = {

        _update: function(dt){
            //console.log(name);
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
            if(this._rendererBehavior instanceof Jasper.Behavior){
                this._rendererBehavior.render(ctx);
            }

        },

        getPosX: function(){
            return this.posX;
        },
        setPosX: function(posx){
            this.posX=posx;
        },
        getPosY:function(){
            return this.posY;
        },
        setPosY: function(posy){
            this.posY=posy;
        },
        setPos: function(x,y){
            this.posX=x; this.posY=y;
        },
        getAlpha:function(){
            return this.alpha;
        },
        setAlpha: function(val){
            this.alpha=val;
        },
        //RETURNS: JasperBehavior Object
        addBehavior: function (behaviorName){                   //Can add both by string // NOT SURE: or by passing custom behavior object
            if(typeof (behaviorName) == "string"){
                var behavior = Jasper._behaviorManager._addBehaviorToObject(behaviorName, this);

                if(behavior instanceof Jasper.Behavior){

                    behavior.parentObject = this;
                    behavior.getParentObject = function(){
                        return this.parentObject;
                    }
                    if(Jasper._behaviorManager._isNonUpdateBehavior(behaviorName)){
                        console.log("extra behavior found:" +behaviorName);
                        this._extraBehaviors[behaviorName] = behavior;
                    }
                    else{
                        this._behaviors[behaviorName]=behavior;

                        /////////WILL IT WORK
                        if(typeof(behavior.render) == "function"){
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
            inNormalBehaviors = !(this._behaviors[behaviorName] == undefined)
            return inNormalBehaviors;
        },
        _hasExtraBehavior: function(behaviorName){
            inExtraBehaviors = !(this._extraBehaviors[behaviorName] == undefined)
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
            this._rendererBehavior = this._behaviors[rendererBehaviorName];
        }

        //DEBUG
        ,_getExtraBehaviors: function(){
            return this._extraBehaviors;
        }
        ,_getAllBehaviors: function(){
            return this._behaviors;
        }
    
};

Jasper.Object.ID = 0;
