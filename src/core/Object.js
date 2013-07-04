/*
TODO: the core intermediary call in addobject remove

*/

/*
*TODO:  remove objects
*/

/**
 *
 * ## The main component of the engine
 * 
 * A Jasper.Object object is an object of logical existence. It does not do anything nor visually exists.
 * 
 * Behaviors are attached to objects to give them the required characteristics such as a sprite image, moving capabilities, reaction to mouse events, 
 * collision capabilities, or any other user-defined behavior.
 * 
 * This Object-Behavior combinations give each object a unique representation within the game and makes the objects highly flexible.
 * 
 * Behaviors can b plugged in and out of the objects as and when desired. This allows for complex behavior changes from instant of time to another.
 *
 * Any number of behaviors can be added to the object.
 * 
 * But only one renderable behavior such as circle, rectangle, sprite, spritesheet, etc are active.
 *
 * However any number of non-rendering behaviors can be attached.
 * 
 * 
 *
 * @class Jasper.Object
 * @constructor
 * @param {String} objectName The name to be assigned to the object
 * 
 * 
 * @example
 *     var hero = new Jaser.Scene({
 *     name:"bg",
 *     hud:false });
 *
 *     var statsLayer = new Jaser.Scene({
 *     name:"stats",
 *     hud:true });
 *
 *     gameScene.addLayers([bgLayer, statsLayer]);
 *     
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
    this.alpha = 1.0;

    this._name=objectName;

    this._camera = undefined;


//    this.core : undefined;
    this._scene = null;
    this.onAdd = function(){};
    this.onUpdate = function(){};
    this.onDestroy =function(){};

};

Jasper.Object.prototype = {

        _update: function(dt){
            
            // Call All initialisations on newly attached behaviors
            if(this._initWaiting.length>0){
                var toInitBehav = this._initWaiting.pop();
                while(toInitBehav !== undefined){
                    toInitBehav._init();
                    toInitBehav = this._initWaiting.pop();
                }
            }

            for (var behavior in this._behaviors){
                this._behaviors[behavior].update(dt);
            }
            this.onUpdate(dt);
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
        
        _hasNormalBehavior: function(behaviorName){
            inNormalBehaviors = (this._behaviors[behaviorName] !== undefined);
            return inNormalBehaviors;
        },
        _hasExtraBehavior: function(behaviorName){
            inExtraBehaviors = (this._extraBehaviors[behaviorName] !== undefined);
            return inExtraBehaviors;
        },
        _addInitWaiting: function(behavior){
            this._initWaiting.push(behavior);
        },

        /**
         * Add an animation to the animation queue
         * @method addAnimation
         * @param  {String} animName     The name of the animation to be added. The name must be a registered animation name in the engine.
         * @param  {Object} attrs        The options required for the specified animation.
         * @return {Jasper.Animation}    The Jasper.Animation instance assigned to this object
         */
        addAnimation: function(animName, attrs){
            var anim = Jasper._animationManager._createAnimation(animName, attrs);
            this._anims[animName] = anim;
            anim._setParentObject(this);
            Jasper._animationManager._registerObject(this);
            return anim;
        },

        /**
         * Ends and removes the specified animation from the queue.
         * @method removeAnimation
         * @param  {String} animName     The name of the animation to be removed from this object
         * @chainable
         */
        removeAnimation: function(animName){
            delete this._anims[animName];
            this._checkAnimationList();
            return this;
        },

        /**
         * Get the animation from the 
         * @method [    methodName]
         * @param  {[type]} animName     [description]
         * @return {[type]}              [description]
         */
        getAnimation: function(animName){
            if(this._anims[animName] !== undefined){
                return this._anims[animName];
            }
            else{
                console.log("Animation does not exist in object");
                return ;
            }
        },
        _clearCollisionManagerWaiting: function(){
            Jasper._collisionManager._clearWaiting(this);
        },

        /**
         * Get the x coordinate of the object's current position in the world
         * @method getPosX
         * @return {Number} The x-coordinate of the object
         */
        getPosX: function(){
            return this.posX;
        },
        setPosX: function(posx){
            this.posX=posx;//Math.floor(posx);
        },
        /**
         * Get the y coordinate of the object's current position in the world
         * @method getPosY
         * @return {Number} The y-coordinate of the object
         */
        getPosY:function(){
            return this.posY;
        },
        setPosY: function(posy){
            this.posY=posy;//Math.floor(posy);
        },
        /**
         * Get the height of the object
         * @method getHeight
         * @return {Number} The height of the object
         */
        getHeight: function(){
            return this.height;
        },
        setHeight: function(h){
            this.height=Math.floor(h);
        },
        /**
         * Get the width of the object
         * @method getWidth
         * @return {Number} The width of the object
         */
        getWidth: function(){
            return this.width;
        },
        setWidth: function(w){
            this.width=Math.floor(w);
        },
        
        /**
         * Get the [x,y] coordinate of the camera's current position in the world
         * @method getViewportPos
         * @return {[Number,Number]} The [x,y] coordinates of the camera
         */
        getViewportPos: function(){
            if(this.getLayer().isHud()){
                return [this.getPosX(), this.getPosY()];
            }else{
                return this.getLayer().getCamera().getViewportPos(this);
            }
        },
        /**
         * Get the [x,y] coordinate of the objects's current position in the world
         * @method getPos
         * @return {[Number,Number]} The [x,y] coordinates of the object
         */
        getPos: function(){
            return [this.posX, this.posY];
        },
        setPos: function(x,y){
            this.posX=x;//Math.floor(x); 
            this.posY=y;//Math.floor(y);
        },
        /**
         * Get the alpha of the object
         * @method getAlpha
         * @return {Number} The alpha of the object
         */
        getAlpha:function(){
            return this.alpha;
        },
        setAlpha: function(val){
            this.alpha=val;
        },
        /**
         * Get the current rotation angle of the object
         * @method getRotationAngle
         * @return {Number} The rotation angle of the object
         */
        getRotationAngle:function(){
            return this.rotation*180/Math.PI;
        },
        setRotationAngle: function(val){
            this.rotation=val*Math.PI/180;
        },
        /**
         * Get the rotation of the object in radians
         * @method getRotationRadian
         * @return {Number} The rotation of the object in radians
         */
        getRotationRadian: function(){
            return this.rotation;
        },
        setRotationRadian: function(val){
            this.rotation=val;
        },
        setVisible: function(isVisible){
            this.visible=isVisible;
        },
        /**
         * Whether the object is visible in the world
         * @method isVisible
         * @return {Boolean} The visibilty of the object
         */
        isVisible: function(){
            return this.visible;
        },

        /**
         * Get this object's parent layer
         * @method getLayer
         * @return {Jasper.Layer} This object's parent layer
         */
        getLayer:function(){
            return this._layer;
        },

        _setLayer: function(jasperLayer){
            if(jasperLayer instanceof Jasper.Layer)
                this._layer = jasperLayer;
        },
        
        //RETURNS: JasperBehavior Object
        /**
         * Create an instance of the behavior with the supplied name and add it to this object. The behavior name must be registered to the game engine.
         * @method addBehavior
         * @param  {String} behaviorName The name of the registered behavior to add to the object
         * @return {Jasper.Behavior}              The instance of the behavior that has been succesfully added to the object. Otherwise null.
         */
        addBehavior: function (behaviorName){                  
            if(typeof (behaviorName) == "string"){
                var behavior = Jasper._behaviorManager._addBehaviorToObject(behaviorName, this);
                
                if(behavior instanceof Jasper.Behavior){


                    behavior._parent = this;
                    this._addInitWaiting(behavior);
                    if(Jasper._behaviorManager._isNonUpdateBehavior(behaviorName)){
                        //console.log("extra behavior found:" +behaviorName);
                        this._extraBehaviors[behaviorName] = behavior;
                    }
                    else{
                        this._behaviors[behaviorName]=behavior;

                        /////////WILL IT WORK
                        if(behavior instanceof Jasper.RenderableBehavior){
                            //console.log("renderer found");
                            this._rendererBehavior = behavior;
                        }
                    }
                    
                    return behavior;
                }
            }
        },

        /**
         * Remove the behavior ,with the given name, from this object
         * @method removeBehavior
         * @param  {String} behaviorName The name of the behavior to remove
         * @chainable
         */
        removeBehavior: function (behaviorName){
            Jasper._behaviorManager._deleteBehaviorFromObject(behaviorName,this);
            delete this._behaviors[behaviorName];
        },
        
        /**
         * Checks whether the behavior with the given name is attached to this object
         * @method hasBehavior
         * @param  {String} behaviorName The name of the behavior to check
         * @return {Boolean}              If behavior is present (true) or not (false)
         */
        hasBehavior: function(behaviorName){
            inNormalBehaviors = this._hasNormalBehavior(behaviorName);
            inExtraBehaviors = this._hasExtraBehavior(behaviorName);

            return (inNormalBehaviors || inExtraBehaviors);
            
        },
        
        /**
         * Get the instance of the behavior with the given name that has been attached to this object.
         * @method getBehavior
         * @param  {String} behaviorName The name of the behavior to get from this object
         * @return {Jasper.Behavior}              The behavior instance that is attached to the object
         */
        getBehavior: function(behaviorName){
            if(this._hasNormalBehavior(behaviorName))
                return this._behaviors[behaviorName];
            else {
                if(this._hasExtraBehavior(behaviorName))
                    return this._extraBehaviors[behaviorName];
            }
        },
        
        

        



        /**
         * Set the Rendering Behavior of the object. This overwrites the older rendering behavior. 
         * Note: An object can have only one rendering behavior active at a time.
         * @method setObjectRenderer
         * @param  {String} rendererBehaviorName The name of the renderer behavior
         * @return {[type]}                      [description]
         */
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
        },

        _setCamera: function(camera){
            console.log("setting camera");
            this._camera = camera;
        }
    
};

Jasper.Object.ID = 0;
