


/**
 * @module Jasper
 * 
 */
var Jasper = function(){
  
};


Jasper.Constants = {
  ANIM_SHORT_DURATION: 1000,
  ANIM_LONG_DURATION: 3000
  
};









function hasOwnProperty(obj, prop) {
    var proto = obj.__proto__ || obj.constructor.prototype;
    return (prop in obj) &&
        (!(prop in proto) || proto[prop] !== obj[prop]);
}

if ( Object.prototype.hasOwnProperty ) {
    var hasOwnProperty = function(obj, prop) {
        return obj.hasOwnProperty(prop);
    };
}


//Initiator

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

Object.extend = function(destination, source) {
  for (var property in source)
    destination[property] = source[property];
  return destination;
};



if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
          // closest thing possible to the ECMAScript 5 internal IsCallable function
          throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1), 
            fToBind = this, 
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis? this : oThis,
                                   aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
  };
}
;Jasper.Animation = function(){

	this._name = "";
	this._started = false;
	this._paused = true;
	this._elapsedTime = 0 ;
	this._object = null;

	//the public variable is the name
	
	this.interpolator = "linear";
	this._interpolator = null;
	this.duration = Jasper.Constants.ANIM_SHORT_DURATION;
	this.loop = false;

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
	

};;Jasper.Behavior = function(){
	this._parent = null;
	
}; 

Object.extend(Jasper.Behavior.prototype, {
	attr : function(args){ 
		this._attr(args); 
		return this;
	},
	locals: function(args){
		Object.extend(this, args); 
	},
	_attr : function(args){},

	update : function(){
		this.onUpdate();
	},

	getParentObject  :  function(){
        return this._parent;
	},
	_init: function(){ 
		this.onInit();
	},
    onInit : function(){},
    onUpdate : function(){},
    onRemove : function(){}
});



Jasper.Behavior._createBehavior = function(funsObj){
	var newBeh = function(){};
	newBeh.prototype = new Jasper.Behavior();

	Object.extend(newBeh.prototype, funsObj);
	
    return newBeh;


};

///	RENDERABLE BEHAVIOR EXTENDING BEHAVIOR ///

Jasper.RenderableBehavior = function(){

	
}; 

Jasper.RenderableBehavior.prototype = new Jasper.Behavior();

Object.extend(Jasper.RenderableBehavior.prototype, {
	renderBefore : function(ctx){
		ctx.save();
		parent = this.getParentObject();
		pos = parent.getViewportPos();
		ctx.translate( pos[0] , pos[1]  );
		ctx.rotate( parent.getRotationRadian() );
		ctx.translate( -pos[0] , -pos[1]  );
		ctx.globalAlpha = parent.getAlpha();
		
	},

	renderAfter : function(ctx){
		ctx.restore();
	},

	render : function(){},

    setWidth: function(width){
        this.getParentObject().setWidth(width);
        return this;
    },
    setHeight: function(height){
        this.getParentObject().setHeight(height);
        return this;
    },
    setPosX: function(x){
		this.getParentObject().setPosX(x);
		return this;
    },
    setPosY: function(y){
		this.getParentObject().setPosY(y);
		return this;
    },
    setPos: function(x,y){
		this.getParentObject().setPos(x,y);
		return this;
    }

});

Jasper.RenderableBehavior._createRenderBehavior = function(funsObj){
	var temp = new Jasper.RenderableBehavior();
	Object.extend(temp, funsObj);

	var newBeh = function(){};
	newBeh.prototype = temp;

	Object.extend(newBeh.prototype, funsObj);

    return newBeh;


};;/*

TODO: dont know how to change addbehavior and createbheavior yet
*/


Jasper.BehaviorManager = function () {

    this._beh_BehObjPairs = {};

    this._name_beh = {
        //'move': MoveBehavior,
        'circle': Jasper.CircleDrawBehavior,
        'rect': Jasper.RectangleDrawBehavior,
        'polygon': Jasper.PolygonDrawBehavior,
        'testmove': Jasper.RandomMoveBehavior,
        'mouse': Jasper.MouseBehavior,
        'sprite': Jasper.SpriteBehavior,
        'spritesheet': Jasper.SpriteSheetBehavior,
        'collision': Jasper.CollisionBehavior,
        'text': Jasper.TextDrawBehavior
    };

    this._nonUpdateBehaviors = ['mouse', 'collision'];

    this._beh_attrs = {};

};


Jasper.BehaviorManager.prototype = {

    _addBehaviorToObject: function (behaviorName, object) {
        if (typeof (behaviorName) == "string") {
            if (hasOwnProperty(this._name_beh, behaviorName)) {
                
                var behavior = new this._name_beh[behaviorName]();
                if(this._beh_attrs[behaviorName] !== undefined){
                    Object.extend(behavior,this._beh_attrs[behaviorName]);
                }

                if (this._beh_BehObjPairs[behaviorName] === undefined) {
                    this._beh_BehObjPairs[behaviorName] = [];
                }
                this._beh_BehObjPairs[behaviorName].push([behavior, object]);

                //console.log("returning behavior", behavior);

                //if (typeof (behavior.init) == "undefined") {
                //    behavior.prototype.init = function (object) {};
                //}
                //behavior.init(object); //TODO: Add behavior init functionality for each behavior
                return behavior;
            } else {
                console.log("Behavior "+behaviorName+" has not been registered to JasperCore");
                console.log("returning null");
                return null;

            }
        }

    },

    _createBehavior: function (behaviorName, behaviorClass, behaviorAttrs) {
        if (typeof (behaviorName) == "string") {
            if (hasOwnProperty(this._name_beh, behaviorName)) {
                console.log("Behavior name already present : " + behaviorName);
                return null;
            } else {
                //contents.class = "JasperBehavior";
                this._name_beh[behaviorName] = behaviorClass;
                if(behaviorAttrs !== undefined){
                    this._beh_attrs[behaviorName] = behaviorAttrs;
                }

                return behaviorName;
            }
        }
    },
    _deleteBehaviorFromObject: function (behaviorName, object) {
        if (this._beh_BehObjPairs[behaviorName] !== undefined) {
            var len = this._beh_BehObjPairs[behaviorName].length;
            for (var i = 0; i < len; i++) {
                if (this._beh_BehObjPairs[behaviorName][i][1].__obj_id == object.__obj_id) {
                    this._beh_BehObjPairs[behaviorName].splice(i, 1);
                    return;
                }
            }
        }
    },

    _isNonUpdateBehavior: function (behaviorName) {
        var len = this._nonUpdateBehaviors.length;
        for (var i = 0; i < len; i++) {
            if (this._nonUpdateBehaviors[i] == behaviorName)
                return true;
        }
        return false;
    },
    _addNonUpdateBehavior: function (behaviorName) {
        if (!this._isNonUpdateBehavior(behaviorName))
            this._nonUpdateBehaviors.push(behaviorName);
    },

    //Debug functions:
    

    _getAllBehaviors: function () {
        var behNames = [];
        for (var name in this._name_beh)
            behNames.push(name);
        return behNames;
    },
    _getBehArray: function () {
        return this._beh_BehObjPairs;
    }


};;Jasper.Camera = function(args){

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




};;/*

TODO: dont know how to change addbehavior and createbheavior yet
*/


Jasper.CollisionManager = function () {
    this._layerNumber_Objects = {};
    this._layerNum_QuadTree = {};

    this._layerNumber_TreeObjects = {}; 
    this._waitingList=[];

    this.count=0;


};


Jasper.CollisionManager.prototype = {
    _registerCollidableObject: function(obj){

        try{
        if(obj.getLayer() === undefined){
            this._waitingList.push(obj);
            return;
        }
        }
        catch(c){
            console.log(obj);
            throw Error(c);
        }
        if(this._layerNum_QuadTree[obj.getLayer().getLayerNumber()] === undefined){

            args = {
               // mandatory fields
                x:0,
                y:0,
                w:500,//obj.getLayer().getWorldSize().x,
                h:500,//obj.getLayer().getWorldSize().y,       
            };

    
            this._layerNum_QuadTree[obj.getLayer().getLayerNumber()] = QUAD.init(args);
        }

        if(this._layerNumber_Objects[obj.getLayer().getLayerNumber()] === undefined){
            this._layerNumber_Objects[obj.getLayer().getLayerNumber()] = [];
            this._layerNumber_TreeObjects[obj.getLayer().getLayerNumber()] = [];
        }

        if(this._hasAlreadyRegistered(obj) === false){
            this._layerNumber_Objects[obj.getLayer().getLayerNumber()].push(obj);
        }

    },

    _clearWaiting: function(obj){
        
        len=this._waitingList.length;

        for(var i=0;i<len;i++){
            if(obj === this._waitingList[i]){
                this._registerCollidableObject(obj);
                this._waitingList.splice(i,1);
                break;    
            }
            
        }
    },

    _hasAlreadyRegistered: function(obj){

        objs = this._layerNumber_Objects[obj.getLayer().getLayerNumber()];
        len=objs.length;
        registered=false;

        for(var i=0;i<len;i++){
            if(obj == objs[i])
                registered = true;
        }
        return registered;
    },


    calculateCollisions: function(){
       //console.log("count:"+this.count);
        this.count=0;
        for(var layerNum in this._layerNum_QuadTree){

            tree = this._layerNum_QuadTree[layerNum];
            tree.clear();

            var len = this._layerNumber_Objects[layerNum].length;
            //console.log("layer"+layerNum+" objsinsert:"+len);
            for(var i=0; i<len; i++){
                var obj = this._layerNumber_Objects[layerNum][i];
                var treeobj = {
                    x:Math.floor(obj.posX),//obj. worldX,
                    y:Math.floor(obj.posY),//obj.worldY,
                    h: obj.height,
                    w: obj.width,
                    obj: obj
                };
                tree.insert(treeobj);
                this._layerNumber_TreeObjects[layerNum].push(treeobj);
            }

            this._activateCollisionsInLayer(layerNum);
        }
    },

    _activateCollisionsInLayer: function(layerNum){
        var len = this._layerNumber_Objects[layerNum].length;
        var tree = this._layerNum_QuadTree[layerNum];
            for(var i=0; i<len; i++){

                var obj = this._layerNumber_Objects[layerNum][i];

                var search = this._layerNumber_TreeObjects[layerNum][i];

                var collidedObjs = tree.retrieve(search, function(item){
                   // Jasper._collisionManager.count++;
                    //this.count++;
                    if(search != item){
                        if  (search.x < (item.x + item.w) && 
                            (search.x+search.w) > item.x && 
                            search.y < (item.y + item.h) && 
                            (search.y+search.h) > item.y){
                                //Jasper._collisionManager.count++;
                                search.obj.getBehavior("collision").onCollide(item.obj);
                                item.obj.getBehavior("collision").onCollide(search.obj);
                        }
                    }

                });
                
                /*var colLen = collidedObjs.length;
                //console.log(collidedObjs);
                console.log("insame layer"+ colLen +" choildren count "+tree.root.children.length);

                for(var j=0; j<colLen; j++){
                    //Collision check : basic rectangle without rotation
                    if  (obj.x < (collidedObjs[j].obj.x + collidedObjs[j].obj.width) && 
                        (obj.x+obj.width) > collidedObjs[j].obj.X1 && 
                        obj.y < (collidedObjs[j].obj.y + collidedObjs[j].obj.height) && 
                        (obj.y+obj.height) > collidedObjs[j].obj.y){

                            obj.getBehavior("collision").onCollide(collidedObjs[j].obj);
                    }
                }*/
                
            }
            this._layerNumber_TreeObjects[layerNum].length = 0;
    }



    


    

};;

/**
 *
 * ###The main component of the Jasper Engine. 
 * 
 * When a new instance of this class is constructed, the new canvas is created and 
 * the all of the internal manager components are initialised. 
 *
 * Jasper.Scene objects are added to the core as a next level of hierarchy.
 * 
 * This class provides access to :
 * Jasper.MouseManager
 * DOM Canvas
 * SceneList
 * 
 * 
 * The init() must be called on this object to start the engine core loop.
 *
 * 
 * @class Jasper.Core
 * @constructor
 * @param {Object} args                 An object containing options for initialising the Core object.
 * @param {Number} args.canvasWidth     The width of the canvas required
 * @param {Number} args.canvasHeight    The height of the canvas required
 * @param {String} args.container       The id of the container div that will contain the canvas
 * @param {String} args.canvasId        The id of the canvas to be created
 *
 * @example
 *     var gameCore = new Jasper.Core({
 *     canvasWidth: 500,
 *     canvasHeight: 500,
 *     container: "contDiv",
 *     canvasId: "mycanvas"
 *     }).init();
 */


Jasper.Core    = function(args){

    this.fps = 60;
    this.running = false;
    
    this.lastTime = 0;
    
    this.canvas = null;
    this.canvasWidth = args.canvasWidth;
    this.canvasHeight = args.canvasHeight;
    this.containerId = args.container;
    this.canvasId = args.canvasId;
    this.canvasContext = null;
    
    this.scenes = [];
    this.activeScene = null;

    this. __next_objid=1;
    this.onInit = function(){};
    Jasper._core = this;


    //this. core;
    //this. behaviorManager;
};



Jasper.Core.prototype = {

        _createCanvas: function(){
            this.canvas = document.createElement('canvas');
            this.canvas.id = this.canvasId;
            this.canvas.width = this.canvasWidth ;
            this.canvas.height = this.canvasHeight ;
            this.canvas.onmousemove = function(e){ Jasper._mouseManager.mouseMove(e);};
            this.canvas.onmousedown = Jasper._mouseManager.mouseDown.bind(Jasper._mouseManager);
            this.canvas.onmouseup = Jasper._mouseManager.mouseUp.bind(Jasper._mouseManager);
            this.canvas.onclick = Jasper._mouseManager.mouseClick.bind(Jasper._mouseManager);
            this.canvas.ondblclick = Jasper._mouseManager.mouseDblClick.bind(Jasper._mouseManager);
            this.canvasContext = this.canvas.getContext('2d');
            document.getElementById(this.containerId).appendChild(this.canvas);
        },

        _render: function () {
            this.canvasContext.save();
            this.canvasContext.clearRect(0,0,this.canvasWidth,this.canvasHeight);
            this.activeScene._render(this.canvasContext);
            this.canvasContext.restore();        
        },

        _update : function (){
            
            requestAnimFrame(this._update.bind(this));
            
            currTime = new Date().getTime();
            dt = currTime - this.lastTime;
            this.lastTime=currTime;
            
            if(this.running){
                this.activeScene._update(dt);
                Jasper._mouseManager._activateCallbacks();
                Jasper._collisionManager.calculateCollisions();
                Jasper._animationManager._runAnimations(dt);
                this._render();
            }
        },

        _start : function(){
            this.onInit();
            this.lastTime = new Date().getTime();
            this.running=true;
            
            requestAnimFrame(this._update.bind(this));
        },
        _getBehaviorManager: function(){
            return Jasper._behaviorManager;
        },
       
        
        
        /**
         * Start the JasperEngine core loop.
         * @method init
         * @chainable
         */
        init : function(){
            
            Jasper._mouseManager = new Jasper.Mouse();
            Jasper._behaviorManager = new Jasper.BehaviorManager();
            Jasper._spriteManager = new Jasper.SpriteManager();
            Jasper._collisionManager = new Jasper.CollisionManager();
            Jasper._animationManager = new Jasper.AnimationManager();
            this._createCanvas();
            this._start();
            return this;
        },

        /**
         * Pause the game core loop.
         * @method pause
         * @chainable
         */

        pause: function(){
            this.running = false;
            return this;
        },

        /**
         * Resume the game core loop.
         * @method resume
         * @chainable
         */
        resume: function(){
            this.running = true;
            return this;
        },

        /**
         * Get the canvas DOM Object that is created and used by the engine.
         * @method getCanvas
         * @return {Canvas DOM Object} The canvas DOM object.
         */
        getCanvas: function(){
            return this.canvas;
        },


        /**
         * Get the Jasper.MouseManager object. It gives access to the mouse position.
         * @method getMouseManager
         * @return {Jasper.MouseManager} The global Jasper.MouseManager Object used by the engine
         */
        getMouseManager: function(){
            return Jasper._mouseManager;
        },

        /**
         * Add a scene to the engine core's Scenelist.
         * @method addScene
         * @param  {Jasper.Scene} jasperScene The scene to be added
         * @chainable
         */
        addScene: function(jasperScene){
            if(jasperScene instanceof Jasper.Scene){
                if(this.scenes.indexOf(jasperScene) == -1){
                    this.scenes.push(jasperScene);
                    jasperScene._onAdd();
                    return this;
                }
                
            }
            else
                throw Error("Can only add a valid Jasper.Scene");
        },

        /**
         * Remove a scene from the engine core's Scenelist
         * @method removeScene
         * @param  {Jasper.Scene} jasperScene The scene to be removed
         * @chainable
         */
        removeScene: function(jasperScene){
            if(this.activeScene == jasperScene){
                throw Error("Trying to remove currently active scene not permitted. end scene first");
            }

            var indx = this.scenes.indexOf(jasperScene);
            if(indx != -1){
                this.scenes[indx]._onDestroy();
                this.scenes.splice(indx,1);
                return this;
            }

        },
        /**
         * Remove a scene from the game core's Scenelist, providing the name of the scene to be removed
         * @method removeSceneByName
         * @param  {String} jasperSceneName The name of the scene to be removed
         * @chainable
         */
        removeSceneByName: function(jasperSceneName){
            if(this.activeScene.getSceneName() == jasperSceneName){
                throw Error("Trying to remove currently active scene not permitted.");
            }
            for (var i=0; i<this.scenes.length; i++){
                if(this.scenes[i].getSceneName()==jasperSceneName){
                    this.scenes.splice(i,1);
                    return this;
                }
            }
        },

        /**
         * Get the currently running scene
         * @method getCurrentScene
         * @return {Jasper.Scene} The currently running Jasper.Scene object
         */
        getCurrentScene: function(){
            return this.activeScene;
        },

        /**
         * Start the scene passed as argumemt
         * @method startScene
         * @param  {Jasper.Scene} jasperScene The Jasper.Scene object to start. Must already be in the scenelist
         * @chainable
         */
        startScene: function(jasperScene){
            if(jasperScene instanceof Jasper.Scene){
                jasperScene._onStart();
                this.activeScene = jasperScene;
                return this;
            }
            else
                throw Error("Can only start a valid Jasper.Scene");
        },

        /**
         * End the currently running scene
         * @method endScene
         * @chainable
         */
        endScene: function(){
            if(this.activeScene !== undefined){
                this.scenes.splice(this.scenes.indexOf(this.activeScene),1);
                this.activeScene = undefined;
            }
            return this;
        },
        /**
         * Get the scene having the given name from the SceneList
         * @method getSceneByName
         * @param  {String} jasperSceneName Name of the scene to get
         * @return {Jasper.Scene}                 The scene object having the given name
         */
        getSceneByName: function(jasperSceneName){
            for (var i=0; i<this.scenes.length; i++){
                if(this.scenes[i].getSceneName()==jasperSceneName){
                    return this.scenes[i];
                }
            }
        },
        /**
         * Get the SceneList from the game core
         * @method getScenes
         * @return {Array<Jasper.Scene>} The array of Jasper.Scene objects taht have been added to the core.
         */
        getScenes: function(){
            return this.scenes;
        },

        /**
         * Create and register a custom behavior to the core. This behavior can be used by any object, by using Jasper.Object.addBehavior(behaviorName) 
         * @method createBehavior
         * @param  {String} behaviorName Name of the behavior to be registered
         * @param  {Object} behaviorVars Object containing the variables to be used by the behavior
         * @param  {Object} behaviorFuns Object containing the functions required for the functioning of the behavior
         * @return {String | null}              Returns the name of the behavior on successful creation/registration of behavior. Otherwise null is returned.
         */
        createBehavior: function(behaviorName, behaviorVars, behaviorFuns){
            var behaviorClass = Jasper.Behavior._createBehavior(behaviorFuns);
            return Jasper._behaviorManager._createBehavior(behaviorName, behaviorClass, behaviorVars);
        }

        /*
        setFps: function(engineFps){
                       fps=engineFps;
        }
                    */


};

;Jasper.Interpolator = function(){
	
};


Jasper.Interpolator.prototype = {
	getValue: function(){}
};
;/*
*TODO:  remove objects
*/

/**
 * A Layer Object is used to hold any number of Jasper.Object objects which are the next level of heirarchy. A Layer can hold any number of Jasper.Object objects
 * within it, that are rendered one after another during every frame in the order in which they are added to the Layer.
 *
 * The Layer can be set into two modes:
 * Normal mode (World mode)
 * HUD mode 
 *
 * Normal mode is set when the user does not provide a 'hud' property in the arguments to the constructor. or if it set to false,
 * HUD mode is set when the user provides 'hud' property as true in the arguments to the constructor.
 *
 *
 * @class Jasper.Layer
 * @constructor
 * @param {Object} args The object with the following options
 * @param {String} args.name The name of the layer, for easy retrieval later on
 * @param {Boolean} args.hud Whether HUD mode (true) or World mode (false)
 * 
 * 
 * @example
 *     var bgLayer = new Jaser.Scene({
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


Jasper.Layer = function(args){
    this._name=args.name;

    this._hud = false;
    this._camera  = undefined;
    if(args.hud !== undefined){
        this._hud = args.hud;
    }
    
    this._scene = undefined;
    this._layerNumber = -1;

    this.worldW=0;
    this.worldH=0;

    this.objects = [];
    this.numObjects = 0;


    this.onAdd = function(){};
    this.onObjectAdd = function(obj){};
    this.onObjectRemove = function(obj){};
    this.onUpdate = function(){};
    this.onDestroy =function(){};
       
};

Jasper.Layer.prototype = {

        
        _update: function(dt){//layerNumber{
            //console.log('Layer '+layerNumber+" then "+numObjects);
            this.onUpdate();
            for(var i=0; i<this.numObjects; i++){
                this.objects[i]._update(dt);
            }
        },

        _render: function(canvasContext){
            for(var i=0; i<this.numObjects; i++){
                this.objects[i]._render(canvasContext);
            }
        },
        _onAdd: function(){
            this.onAdd();
        },
        _onStart: function(){
            this.onStart();
        },
        _onDestroy: function(){
            this.onDestroy();
            var len=objects.length;
            for(var i=0; i<len; i++){
                objects[i]._onDestroy();
            }
            
        },
        _onObjectAdd: function(obj){
            this.onObjectAdd(obj);
        },
        _onObjectRemove: function(obj){
            this.onObjectRemove(obj);
        },

        /**
         * Get the worldWidth and worldHeight of the scene, which this layer is part of.
         * @method getWorldSize
         * @return {[Number, Number]} An array with the width and the height of the world
         */
        getWorldSize: function(){
            return [this.worldW, this.worldH];
        },

        /**
         * Add a new Jasper.Object to the ObjectList
         * @method addObject
         * @param  {Jasper.Object} jasperObject  A Jasper.Objct object that is to be added to the ObjectList. The order in which objects are added has significance.
         * @chainable
         */
        addObject: function(jasperObject){
            if(jasperObject instanceof Jasper.Object){
                if(jasperObject.getLayer() !== undefined){
                    jasperObject.getLayer().removeObject(jasperObject);
                }

                jasperObject._setLayer(this);
                this.objects.push(jasperObject);
                this.numObjects++;

                this._onObjectAdd(jasperObject);
                if(this.getScene() !== undefined){
                    jasperObject._setCamera(this._camera);
                }
                jasperObject._clearCollisionManagerWaiting();
                jasperObject.onAdd();
                return this;
                
            } 
            else{
                throw Error("Cannot add object, needs JasperObject" );
            }

        },
        /**
         * Add a list of objects to the ObjectList in the same order as in the argument
         * @method addObjects
         * @param  {Array<Jasper.Object>} jasperObjects Array of Jasper.Object objects to be added to the ObjectList of the Layer.
         * @chainable
         */
        addObjects: function(jasperObjects){
            var len = jasperObjects.length;
            for(var i=0; i<len; i++){
                this.addObject(jasperObjects[i]);
            }
            return this;
        },

        /**
         * Remove the given Jasper.Object from the ObjectList of the layer
         * @method removeObject
         * @param  {Jasper.Object} jasperObject [description]
         * @return {[type]}              [description]
         */
        removeObject: function(jasperObject){
            if(jasperObject instanceof Jasper.Object){
                var indx = this.objects.indexOf(jasperObject);
                if(indx !== -1){
                    obj=this.objects.splice(indx,1);
                    this._onObjectRemove(obj);
                }
                return this;
            }
            else{
                throw Error("Cannot remove object, needs JasperObject" );
            }
        },

        /**
         * Get the list of Jasper.Object from the ObjectList of this scene
         * @method getObjects
         * @return {Array<Jasper.Object>} The ObjectList of this scene
         */
        getObjects: function(){
            return this.objects;
        },

        /**
         * Get the scene which the layer is a part of.
         * @method getScene
         * @return {Jasper.Scene} The parent scene
         */
        getScene: function(){
            return this._scene;
        },

        /**
         * Get the index of the current layer in the parent Jasper.Scene's LayerList
         * @method getLayerNumber
         * @return {Number} The index of the layer in the parent scene's LayerList
         */
        getLayerNumber: function(){
            return this._layerNumber;
        },

        /**
         * Get the camera that is associated with the current layer
         * @method getCamera
         * @return {Jasper.Camera} The camera attached to the parent scene
         */
        getCamera: function(){
            return this._camera;
        },
        /**
         * Returns if this layer is in HUD mode
         * @method isHud
         * @return {Boolean} The mode of the layer is HUD mode (true) or Normal mode (false)
         */
        isHud: function(){
            return this._hud;
        },
        _setCamera: function(camera){
            this._camera = camera;
            objs = this.getObjects();
            var l=objs.length;
            for (var i=0; i<l;i++){
                objs[i]._setCamera(camera);
            }
        }

        
};
;/*
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
;/**
 * A Scene Object is used to seperate the game into different components. At a time only one scene can be run by the engine. However, every Scene consists 
 * of a set of Jasper.Layer objects that are rendered one after another during every frame in the order in which they are added to the Scene.
 *
 *
 * @class Jasper.Scene
 * @constructor
 * @param {Object} args The object with the following options
 * @param {String} args.name The name of the scene, for easy retrieval later on
 * @param {Number} args.worldW The maximum width of the world in the current scene, can exceed canvas' width
 * @param {Number} args.worldH The maximum height of the world in the current scene, can exceed canvas' height.
 * 
 * @example
 *     var gameScene = new Jaser.Scene({
 *     name:"mainscene",
 *     worldW: 1000,
 *     worldH: 1500});
 *
 *     gameCore.addScene(gameScene).startScene(gameScene);
 *     
 */

Jasper.Scene = function(args){

    this.sceneName = args.name;

    this.worldW = args.worldW;
    this.worldH = args.worldH;

    this._camera = new Jasper.Camera({
        width: Jasper._core.canvasWidth,
        height: Jasper._core.canvasHeight,
        worldWidth: this.worldW,
        worldHeight: this.worldH
    });
    
    
    this.layerList=[];
    this.numLayers=0;


    this.onAdd = function(){};
    this.onAddLayer = function(layer){};
    this.onStart = function(){};
    this.onUpdate = function(){};
    this.onDestroy = function(){};
       
};

Jasper.Scene.prototype = {
        _update: function(dt){
            //console.log(this.getSceneName());

            for (var i=0 ;i<this.numLayers; i++){
                this.onUpdate();
                this.layerList[i]._update(dt);
            }
        },

        _render: function(canvasContext){
            for (var i=0 ;i<this.numLayers; i++){
                this.layerList[i]._render(canvasContext);
            }
        },

        _onAdd: function(){
            this.onAdd();
        },
        _onStart: function(){
            this.onStart();
        },
        _onDestroy: function(){
            this.onDestroy();
            var len = this.layerList.length;
            for(var i=0; i<len; i++){
                this.layerList[i]._onDestroy();
            }
        },
        _onAddLayer: function(layer){
            this.onAddLayer(layer);
        },

        /**
         * Set the scene's name
         * @method setSceneName
         * @param  {String} name         The name to be set as the scene's name
         * @chainable
         */
        setSceneName: function(name){
            this.sceneName=name;
            return this;
        },

        /**
         * Get the scene's name
         * @method getSceneName
         * @return {String} The name of the scene
         */
        getSceneName: function(){
            return this.sceneName;
        },
        //                                Option to add layer number for comfort
        /**
         * Add a new Jasper.Layer to the LayerList
         * @method addLayer
         * @param  {Jasper.Layer} jasperLayer  A Jasper.Layer object that is to be added to the LayerList. The order in which layers are added has significance
         * @chainable
         */
        addLayer: function(jasperLayer){
            if(jasperLayer instanceof Jasper.Layer){
                
                jasperLayer.worldW=this.worldW;
                jasperLayer.worldH=this.worldH;
                
                this.layerList.push(jasperLayer);
                jasperLayer.scene = this;
                jasperLayer._layerNumber = this.numLayers;
                jasperLayer._setCamera(this._camera);
                this.numLayers++;


                this._onAddLayer(jasperLayer);
                jasperLayer._onAdd();

                return this;
            }
            else{
                throw Error("Cannot add object to scene. need Jasper.Layer");
            }
        },
        /**
         * Add a list of layers to the LayerList in the same order as in the argument
         * @method addLayers
         * @param  {Array<Jasper.Layer>} jasperLayers Array of Jasper.Layer objects to be added to the LayerList of the Scene.
         * @chainable
         */
        addLayers: function(jasperLayers){
            var len = jasperLayers.length;
            for(var i=0; i<len; i++){
                this.addLayer(jasperLayers[i]);
            }
            return this;
        },

        /**
         * Get the layer that is present at the given 'index' from the LayerList. Index starts at 0
         * @method getLayerWithIndex
         * @param  {Number}     index       The index of the layer in the LayerList. Value of index starts from 0, ie, [0,1,2,3,...]
         * @return {Jasper.Layer}           The Jasper.Layer object at the given index
         */
        getLayerWithNumber: function(num){
            len = this.layerList.length;
            for(var i=0;i<len;i++){
                if(this.layerList[i].getLayerNumber() == num){
                    return this.layerList[i];
                }
            }
            return null;
        },

        /**
         * Get the list of Jasper.Layer objects in the LayerList of this scene.
         * @method getLayers
         * @return {Array<Jasper.Layer>} The list of layers in the LayerList of the Scene
         */
        getLayers: function(){
            return this.layerList;
        }

};
;Jasper.SpriteManager = function(){
	
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
			
			spriteBehavior._adjustDimensions();
			spriteBehavior._setLoaded(true);
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
				
				beh._adjustDimensions();
				beh._setLoaded(true);
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






};;Jasper.AnimationManager = function(){
	
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


	
};	;
Jasper.Mouse = function(){

    /*var clickX=0;
    var clickY=0;
    var downX=0;
    var downY=0;
    var upX=0;
    var upY=0;
    var dblclickX=0;
    var dblclickY=0;
                     */
    this._events = [];
    this._onClickObjects = [];
    this._onMoveObjects = [];
    this._onDownObjects = [];
    this._onUpObjects = [];
    this._onDblClickObjects = [];


    this._callbackObjects = [];
    this._mousePos = [0,0];
};

Jasper.Mouse.prototype={

        _existsCallbackObject: function(object){
            var len = this._callbackObjects.length;
            for (var i=0; i<len; i++){
                if(object == this._callbackObjects[i])
                    return i;
            }
            return -1;
        },

        

           

        getMousePos: function(){
            return this._mousePos;
        },
        setMousePos: function(x,y){
            this._mousePos=[x,y];
        },

        mouseMove: function(e){
            this.setMousePos(/*(e.layerX || e.offsetX),(e.layerY || e.offsetY)*/e.offsetX,e.offsetY);
            this._events.push(['onMove',/*(e.layerX || e.offsetX),(e.layerY || e.offsetY)*/e.offsetX,e.offsetY]);

        },
        mouseClick:function(e){
            console.log("inside mouseClick");
            this._events.push(['onClick',/*(e.layerX || e.offsetX),(e.layerY || e.offsetY)*/e.offsetX,e.offsetY]);
        },
        mouseDblClick: function(e){
            console.log("inside mouseDblClick");
            this._events.push(['onDblClick',/*(e.layerX || e.offsetX),(e.layerY || e.offsetY)*/e.offsetX,e.offsetY]);
        },
        mouseUp: function(e){
            console.log("inside mouseUp");
            this._events.push(['onUp',/*(e.layerX || e.offsetX),(e.layerY || e.offsetY)*/e.offsetX,e.offsetY]);
        },
        mouseDown: function(e){
            console.log("inside mouseDown");
            this._events.push(['onDown',/*(e.layerX || e.offsetX),(e.layerY || e.offsetY)*/e.offsetX,e.offsetY]);
        },



        registerOnClickObject: function(obj){
            if(obj instanceof Jasper.Object)
                this._onClickObjects.push(obj);

        },
        registerOnMoveObject: function(obj){
            if(obj instanceof Jasper.Object)
                this._onMoveObjects.push(obj);
        },
        registerOnDownObject: function(obj){
            if(obj instanceof Jasper.Object)
                this._onDownObjects.push(obj);
        },
        registerOnUpObject: function(obj){
            if(obj instanceof Jasper.Object)
                this._onUpObjects.push(obj);
        },
        registerOnDblClickObject: function(obj){
            if(obj instanceof Jasper.Object)
                this._onDblClickObjects.push(obj);
        },
        unregisterOnClickObject: function(obj){
            if(obj instanceof Jasper.Object){
                var len = this._onClickObjects.length;
                for(var i=0; i<len; i++){
                    if(this._onClickObjects[i]==object){
                        this._onClickObjects.splice(i,1);
                        break;
                    }
                }
            }
        },
        unregisterOnMoveObject: function(obj){
            if(obj instanceof Jasper.Object){
                var len = this._onMoveObjects.length;
                for(var i=0; i<len; i++){
                    if(this._onClickObjects[i]==object){
                        this._onMoveObjects.splice(i,1);
                        break;
                    }
                }
            }
        },
        unregisterOnDownObject: function(obj){
            if(obj instanceof Jasper.Object){
                var len = this._onDownObjects.length;
                for(var i=0; i<len; i++){
                    if(this._onClickObjects[i]==object){
                        this._onDownObjects.splice(i,1);
                        break;
                    }
                }
            }
        },
        unregisterOnUpObject: function(obj){
            if(obj instanceof Jasper.Object){
                var len = this._onUpObjects.length;
                for(var i=0; i<len; i++){
                    if(this._onClickObjects[i]==object){
                        this._onUpObjects.splice(i,1);
                        break;
                    }
                }
            }
        },
        unregisterOnDblClickObject: function(obj){
            if(obj instanceof Jasper.Object){
                var len = this._onDblClickObjects.length;
                for(var i=0; i<len; i++){
                    if(this._onClickObjects[i]==object){
                        this._onDblClickObjects.splice(i,1);
                        break;
                    }
                }
            }
        },



        registerCallbackObject: function(obj){
            if(this._existsCallbackObject(obj) == -1){
                this._callbackObjects.push(obj);
            }
        },
        removeCallbackObject: function(obj){
            var pos = this._existsCallbackObject(obj);
            if(pos != -1){
                this._callbackObjects.splice(pos,1);
            }
        },
        _activateCallbacks: function(){
            var len = 0;
            var evs = this._events.length;
            for(var i=0; i<evs; i++){
                var e = this._events[i][0];
                var x = this._events[i][1];
                var y = this._events[i][2];

                var objs = this["_"+e+"Objects"];
                len = objs.length;
                //console.log("Processed: "+len+ "_"+e+"Objects");
                for(var j=0; j<len; j++){

                    //this._callbackObjects[j].getBehavior("mouse")[e](x,y); 
                    objs[j].getBehavior("mouse")[e](x,y);                 //Calls onMove(x,y), onClick(x,y), etc, ...
                }
                
                
                
            }
            //Clear the this._events array
            this._events.length=0;
        }



        
};



;/*
 * QuadTree Implementation in JavaScript
 * @author: silflow <https://github.com/silflow>
 *
 * Usage:
 * To create a new empty Quadtree, do this:
 * var tree = QUAD.init(args)
 *
 * args = {
 *    // mandatory fields
 *    x : x coordinate
 *    y : y coordinate
 *    w : width
 *    h : height
 *
 *    // optional fields
 *    maxChildren : max children per node
 *    maxDepth : max depth of the tree
 *}
 *
 * API:
 * tree.insert() takes arrays or single items
 * every item must have a .x and .y property. if not, the tree will break.
 *
 * tree.retrieve(item, callback) calls the callback for all objects that are in
 * the same region or overlapping.
 *
 * tree.clear() removes all items from the quadtree.
 */

var QUAD = {}; // global var for the quadtree

QUAD.init = function(args) {

    var node;
    var TOP_LEFT     = 0;
    var TOP_RIGHT    = 1;
    var BOTTOM_LEFT  = 2;
    var BOTTOM_RIGHT = 3;
    var PARENT       = 4;

    // assign default values
    args.maxChildren = args.maxChildren || 2;
    args.maxDepth = args.maxDepth || 4;

    /**
     * Node creator. You should never create a node manually. the algorithm takes
     * care of that for you.
     */
    node = function (x, y, w, h, depth, maxChildren, maxDepth) {

        var items = [], // holds all items
            nodes = []; // holds all child nodes

        // returns a fresh node object
        return {

            x : x, // top left point
            y : y, // top right point
            w : w, // width
            h : h, // height
            depth : depth, // depth level of the node

            /**
             * iterates all items that match the selector and invokes the supplied callback on them.
             */
            retrieve : function (item, callback) {
                for (var i = 0; i < items.length; ++i) {
                    callback(items[i]);
                }
                // check if node has subnodes
                if (nodes.length) {
                    // call retrieve on all matching subnodes
                    this.findOverlappingNodes(item, function(dir) {
                        nodes[dir].retrieve(item, callback);
                    });
                }
            },

            /**
             * Adds a new Item to the node.
             *
             * If the node already has subnodes, the item gets pushed down one level.
             * If the item does not fit into the subnodes, it gets saved in the
             * "children"-array.
             *
             * If the maxChildren limit is exceeded after inserting the item,
             * the node gets divided and all items inside the "children"-array get
             * pushed down to the new subnodes.
             */
            insert : function (item) {

                var i;

                if (nodes.length) {
                    // get the node in which the item fits best
                    i = this.findInsertNode(item);
                    if (i === PARENT) {
                        // if the item does not fit, push it into the
                        // children array
                        items.push(item);
                    } else {
                        nodes[i].insert(item);
                    }
                } else {
                    items.push(item);
                    //divide the node if maxChildren is exceeded and maxDepth is not reached
                    if (items.length > maxChildren && this.depth < maxDepth) {
                        this.divide();
                    }
                }
            },

            /**
             * Find a node the item should be inserted in.
             */
            findInsertNode : function (item) {
                // left
                if (item.x + item.w < x + (w / 2)) {
                    if (item.y + item.h < y + (h / 2)) return TOP_LEFT;
                    if (item.y >= y + (h / 2)) return BOTTOM_LEFT;
                    return PARENT;
                }

                // right
                if (item.x >= x + (w / 2)) {
                    if (item.y + item.h < y + (h / 2)) return TOP_RIGHT;
                    if (item.y >= y + (h / 2)) return BOTTOM_RIGHT;
                    return PARENT;
                }

                return PARENT;
            },

            /**
             * Finds the regions the item overlaps with. See constants defined
             * above. The callback is called for every region the item overlaps.
             */
            findOverlappingNodes : function (item, callback) {
                // left
                if (item.x < x + (w / 2)) {
                    if (item.y < y + (h / 2)) callback(TOP_LEFT);
                    if (item.y + item.h >= y + h/2) callback(BOTTOM_LEFT);
                }
                // right
                if (item.x + item.w >= x + (w / 2)) {
                    if (item.y < y + (h / 2)) callback(TOP_RIGHT);
                    if (item.y + item.h >= y + h/2) callback(BOTTOM_RIGHT);
                }
            },

            /**
             * Divides the current node into four subnodes and adds them
             * to the nodes array of the current node. Then reinserts all
             * children.
             */
            divide : function () {

                var width, height, i, oldChildren;
                var childrenDepth = this.depth + 1;
                
                // set dimensions of the new nodes
                width = (w / 2);
                height = (h / 2);
                // create top left node
                nodes.push(node(this.x, this.y, width, height, childrenDepth, maxChildren, maxDepth));
                // create top right node
                nodes.push(node(this.x + width, this.y, width, height, childrenDepth, maxChildren, maxDepth));
                // create bottom left node
                nodes.push(node(this.x, this.y + height, width, height, childrenDepth, maxChildren, maxDepth));
                // create bottom right node
                nodes.push(node(this.x + width, this.y + height, width, height, childrenDepth, maxChildren, maxDepth));

                oldChildren = items;
                items = [];
                for (i = 0; i < oldChildren.length; i++) {
                    this.insert(oldChildren[i]);
                }
            },

            /**
             * Clears the node and all its subnodes.
             */
            clear : function () {
                for (var i = 0; i < nodes.length; i++) nodes[i].clear();
                items.length = 0;
                nodes.length = 0;
            },

            /*
             * convenience method: is not used in the core algorithm.
             * ---------------------------------------------------------
             * returns this nodes subnodes. this is usful if we want to do stuff
             * with the nodes, i.e. accessing the bounds of the nodes to draw them
             * on a canvas for debugging etc...
             */
            getNodes : function () {
                return nodes.length ? nodes : false;
            }
        };
    };

    return {

        root : (function () {
            return node(args.x, args.y, args.w, args.h, 0, args.maxChildren, args.maxDepth);
        }()),

        insert : function (item) {

            var len, i;

            if (item instanceof Array) {
                len = item.length;

                for (i = 0; i < len; i++) {
                    this.root.insert(item[i]);
                }

            } else {
                this.root.insert(item);
            }
        },

        retrieve : function (selector, callback) {
            return this.root.retrieve(selector, callback);
        },

        clear : function () {
            this.root.clear();
        }
    };
};;/*
    ERROR: init missing from object. workaround temp init function. Need to find out how to extend.

*/



Jasper.CircleDrawBehavior = function(){
    this.radius = 0;
    this.strokeColor = 'black';
    this.strokeWidth = 5;
    this.fillColor = 'black';

    this.fill = true;
    this.stroke = true;

};

Jasper.CircleDrawBehavior.prototype = new Jasper.RenderableBehavior();

Object.extend(Jasper.CircleDrawBehavior.prototype, {
        _attr: function(args){
            if(args.radius !== undefined)
                this.setRadius(args.radius);
            if(args.strokeColor !== undefined)
                this.setStrokeColor(args.strokeColor);
            if(args.strokeWidth !== undefined)
                this.setStrokeWidth(args.strokeWidth);
            if(args.fillColor !== undefined)
                this.setFillColor(args.fillColor);
            return this;
        },

        update: function(dt){},

        render:function(ctx){
            parent = this.getParentObject();
            pos = parent.getViewportPos();
            ctx.beginPath();

            ctx.arc(Math.floor(pos[0]), Math.floor(pos[1]), this.radius, 0, 2 * Math.PI, true);
            if(this.fill){
                ctx.fillStyle = this.fillColor;
                ctx.fill();
            }
            if(this.stroke){
                ctx.lineWidth = this.strokeWidth;
                ctx.strokeStyle = this.strokeColor;
                ctx.stroke();
            }


        },


        setRadius:function(radius){
            this.radius=radius;
            return this;
        },
        getRadius: function(){
            return this.radius;
        },

        setFillColor: function(r,g,b,a){

            if(typeof(r) == 'string' && g === undefined && b === undefined){
                this.fillColor = r;
            }
            else if(typeof(r) !== undefined && g !== undefined && b !== undefined){
                this.fillColor="rgb("+r+","+g+","+b+")";
            }
            else if(typeof(r) !== undefined && g !== undefined && b !== undefined){
                this.fillColor="rgb("+r+","+g+","+b+")";
            }
            return this;
        },
        setStrokeColor: function(r,g,b,a){

            if(typeof(r) == 'string' && g === undefined && b === undefined){
                this.strokeColor = r;
            }
            else if(typeof(r) !== undefined && g !== undefined && b !== undefined){
                this.strokeColor="rgb("+r+","+g+","+b+")";
            }
            else if(typeof(r) !== undefined && g !== undefined && b !== undefined){
                this.strokeColor="rgb("+r+","+g+","+b+")";
            }
            return this;
        },
        getFillColor: function(){
            return this.fillColor;
        },
        getStrokeColor: function(){
            return this.strokeColor;
        },
        setStrokeWidth: function(width){
            this.strokeWidth=width;
            return this;
        },
        getStrokeWidth: function(){
            return this.getStrokeWidth;
        },
        setFillEnabled: function(boolean){
            this.fill=boolean;
            return this;
        },
        setStrokeEnabled: function(boolean){
            this.stroke=boolean;
            return this;
        }
        
});;Jasper.CollisionBehavior = function(){
    this._collided = false;
};

Jasper.CollisionBehavior.prototype = new Jasper.Behavior();



Object.extend(Jasper.CollisionBehavior.prototype,{

        _init: function(object){
            Jasper._behaviorManager._addNonUpdateBehavior('collision');
            Jasper._collisionManager._registerCollidableObject(this.getParentObject());
            //Jasper._mouseManager.registerCallbackObject(object);
            this.onInit();
        },

        setOnCollide: function(collideFunc){
            this.onCollide = collideFunc;
        },

        onCollide: function(collidedObj){}

        


});;Jasper.MouseBehavior = function(){

};

Jasper.MouseBehavior.prototype = new Jasper.Behavior();



Object.extend(Jasper.MouseBehavior.prototype,{
        _attr: function(args){
            if(args.onClick !== undefined)
                this.setOnClick(args.onClick);
            if(args.onMove !== undefined)
                this.setOnMove(args.onMove);
            if(args.onDown !== undefined)
                this.setOnDown(args.onDown);
            if(args.onUp !== undefined)
                this.setOnUp(args.onUp);
            if(args.onDblClick !== undefined)
                this.setOnDblClick(args.onDblClick);
        },
        _init: function(object){
            Jasper._behaviorManager._addNonUpdateBehavior('mouse');
            //Jasper._mouseManager.registerCallbackObject(object);
            this.onInit();
        },
        onClick: function(){},
        onMove: function(){},
        onDown: function(){},
        onUp: function(){},
        onDblClick: function(){},

        setOnClick: function(clickFun){
			this.onClick = clickFun;
			Jasper._mouseManager.registerOnClickObject(this.getParentObject());
			return this;
        },
        setOnMove: function(clickFun){
			this.onMove = clickFun;
			Jasper._mouseManager.registerOnMoveObject(this.getParentObject());
			return this;
        },
        setOnDown: function(clickFun){
			this.onDown = clickFun;
			Jasper._mouseManager.registerOnDownObject(this.getParentObject());
			return this;
        },
        setOnUp: function(clickFun){
			this.onUp = clickFun;
			Jasper._mouseManager.registerOnUpObject(this.getParentObject());
			return this;
        },
        setOnDblClick: function(clickFun){
			this.onDblClick = clickFun;
			Jasper._mouseManager.registerOnDblClickObject(this.getParentObject());
			return this;
        },

        removeOnClick: function(){
			delete this.onClick;
			Jasper._mouseManager.unregisterOnClickObject(this.getParentObject());
        },
        removeOnMove: function(){
			delete this.onMove;
			Jasper._mouseManager.unregisterOnMoveObject(this.getParentObject());
        },
        removeOnDown: function(){
			delete this.onDown;
			Jasper._mouseManager.unregisterOnDownObject(this.getParentObject());
        },
        removeOnUp: function(){
			delete this.onUp;
			Jasper._mouseManager.unregisterOnUpObject(this.getParentObject());
        },
        removeOnDblClick: function(){
			delete this.onDblClick;
			Jasper._mouseManager.unregisterOnDblClickObject(this.getParentObject());
        },


});;/*
    ERROR: init missing from object. workaround temp init function. Need to find out how to extend.

*/



Jasper.PolygonDrawBehavior = function(){
    this._points = [];
    this._numPoints = 0;

    this.strokeColor = 'black';
    this.strokeWidth = 5;
    this.fillColor = 'black';


    this.fill = true;
    this.stroke = true;

};

Jasper.PolygonDrawBehavior.prototype = new Jasper.RenderableBehavior();

Object.extend(Jasper.PolygonDrawBehavior.prototype, {
        
        update: function(dt){},

        render:function(ctx){
            parent = this.getParentObject();
            pos = parent.getViewportPos();
            ctx.beginPath();
            ctx.moveTo(pos[0], pos[1]);
            for (var i=0; i<this._numPoints; i++){
                ctx.lineTo(pos[0] + this._points[i][0], pos[1]+ this._points[i][1]);
            }
            ctx.closePath();

            
            if(this.fill){
                ctx.fillStyle = this.fillColor;
                ctx.fill();
            }
            if(this.stroke){
                ctx.lineWidth = this.strokeWidth;
                ctx.strokeStyle = this.strokeColor;
                ctx.stroke();
            }


        },


        // point is an array having [x,y]
        addPoint:function(point){
            parent = this.getParentObject();
            if(this._numPoints === 0){
                parent.posX = point[0];
                parent.posY = point[1];
                parent.width = 0;
                parent.height = 0;
            }
            else{
                if( point[0] < parent.posX )
                    parent.posX = point[0];
                if( point[1] < parent.posY )
                    parent.posY = point[1];
                if( point[0] > (parent.posX+parent.width) )
                    parent.width = point[0] - parent.posX;
                if( point[1] > (parent.posY+parent.height) )
                    parent.height = point[1] - parent.posY;
            }
            this._points.push(point);
            this._numPoints++;
            return this;
        },

        addPoints: function(points){
            var len = points.length;
            for(var i=0; i<len ; i++){
                this.addPoint(points[i]);
            }
        },

        clearPoints: function(){
            this._points.length = 0;
            this._numPoints = 0;
        },
        setFillColor: function(r,g,b,a){

            if(typeof(r) == 'string' && g === undefined && b === undefined){
                this.fillColor = r;
            }
            else if(typeof(r) !== undefined && g !== undefined && b !== undefined){
                this.fillColor="rgb("+r+","+g+","+b+")";
            }
            else if(typeof(r) !== undefined && g !== undefined && b !== undefined){
                this.fillColor="rgb("+r+","+g+","+b+")";
            }
            return this;
        },
        setFillEnabled: function(boolean){
            this.fill=boolean;
            return this;
        },
        setStrokeEnabled: function(boolean){
            this.stroke=boolean;
            return this;
        },
        setStrokeWidth: function(width){
            this.strokeWidth=width;
            return this;
        }
        
});;Jasper.RandomMoveBehavior = function(){
    this.finalx = Math.floor((Math.random()*500)+1);
    this.finaly = Math.floor((Math.random()*500)+1);
    this.initx = 0;
    this.inity = 0;
    this.elapsed=0;
} ;

Jasper.RandomMoveBehavior.prototype = new Jasper.Behavior();

Object.extend(Jasper.RandomMoveBehavior.prototype , {
        update: function(dt){
            parent = this.getParentObject();
            this.elapsed+=dt;
            if(this.elapsed<20000){
                parent.setPosX(Math.floor((this.finalx-this.initx)/20000.0*this.elapsed));
                parent.setPosY(Math.floor((this.finaly-this.inity)/20000.0*this.elapsed));
            }
        }
        
});;/*
    ERROR: init missing from object. workaround temp init function. Need to find out how to extend.

*/



Jasper.RectangleDrawBehavior = function(){
    this.strokeColor = 'black';
    this.strokeWidth = 5;
    this.fillColor = 'black';

    this.fill = true;
    this.stroke = true;

};

Jasper.RectangleDrawBehavior.prototype = new Jasper.RenderableBehavior();

Object.extend(Jasper.RectangleDrawBehavior.prototype, {
        _attr: function(args){
            if(args.width !== undefined)
                this.setWidth(args.width);
            if(args.height !== undefined)
                this.setHeight(args.height);
            if(args.strokeColor !== undefined)
                this.setStrokeColor(args.strokeColor);
            if(args.strokeWidth !== undefined)
                this.setStrokeWidth(args.strokeWidth);
            if(args.fillColor !== undefined)
                this.setFillColor(args.fillColor);
        },
       
        update: function(dt){},

        render:function(ctx){
            parent = this.getParentObject();
            pos = parent.getViewportPos();

            if(this.fill){
                ctx.fillStyle = this.fillColor;
                ctx.fillRect(pos[0], pos[1], parent.getWidth(), parent.getHeight());
            }
            if(this.stroke){
                ctx.lineWidth = this.strokeWidth;
                ctx.strokeStyle = this.strokeColor;
                ctx.strokeRect(pos[0], pos[1], parent.getWidth(), parent.getHeight());
            }


        },

        setFillColor: function(r,g,b,a){

            if(typeof(r) == 'string' && g === undefined && b === undefined){
                this.fillColor = r;
            }
            else if(typeof(r) !== undefined && g !== undefined && b !== undefined){
                this.fillColor="rgb("+r+","+g+","+b+")";
            }
            else if(typeof(r) !== undefined && g !== undefined && b !== undefined){
                this.fillColor="rgb("+r+","+g+","+b+")";
            }
            return this;
        },
        setStrokeColor: function(r,g,b,a){

            if(typeof(r) == 'string' && g === undefined && b === undefined){
                this.strokeColor = r;
            }
            else if(typeof(r) !== undefined && g !== undefined && b !== undefined){
                this.strokeColor="rgb("+r+","+g+","+b+")";
            }
            else if(typeof(r) !== undefined && g !== undefined && b !== undefined){
                this.strokeColor="rgb("+r+","+g+","+b+")";
            }
            return this;
        },
        getFillColor: function(){
            return this.fillColor;
        },
        getStrokeColor: function(){
            return this.strokeColor;
        },
        setStrokeWidth: function(width){
            this.strokeWidth=width;
            return this;
        },
        getStrokeWidth: function(){
            return this.getStrokeWidth;
        },
        setFillEnabled: function(boolean){
            this.fill=boolean;
            return this;
        },
        setStrokeEnabled: function(boolean){
            this.stroke=boolean;
            return this;
        }
        
});;/*
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
     
});;/*
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
     
});;/*
    ERROR: init missing from object. workaround temp init function. Need to find out how to extend.

*/



Jasper.TextDrawBehavior = function(){
    this.text = "";
    
    this.color = 'black';

    this.font = "Lucida Console";
    this.size = "18px";
    this.maxWidth = "";

    this._changed = true;

    

};

Jasper.TextDrawBehavior.prototype = new Jasper.RenderableBehavior();

Object.extend(Jasper.TextDrawBehavior.prototype, {
        _attr: function(args){
             if(args.text !== undefined)
                this.setText(args.text);
            if(args.color !== undefined)
                this.setFontColor(args.color);
            if(args.size !== undefined)
                this.setFontSize(args.size);
            if(args.maxWidth !== undefined)
                this.setMaxWidth(args.maxWidth);
            return this;
        },
       
        update: function(dt){},

        render:function(ctx){
            parent = this.getParentObject();
            pos = parent.getViewportPos();
            
            ctx.fillStyle = this.color;
            ctx.font = this.size + " " +this.font;
            ctx.textBaseline = 'top';
            ctx.fillText(this.text, pos[0], pos[1]);

            var metrics = ctx.measureText(this.text);
            if(this._changed === true){
                parent.setWidth(metrics.width);
                parent.setHeight(parseInt(this.size, 10));
                this._changed = false;
            }

        },


        // point is an array having [x,y]
        setText: function(text){
            this.text = text;
            this._changed = true;
            return this;
        },
        getText: function(){
            return this.text;
        },
        setFont: function(fontname){
            this.font = fontname;
            this._changed = true;
            return this;
        },
        getFont: function(){
            return this.font;
        },
        setFontSize: function(size){
            if(typeof(size) === "number"){
                this.size = size+"px";
            }
            else{
                this.size = size;
            }
            this._changed = true;
            return this;
        },
        getFontSize: function(){
            return this.size;
        },
        setMaxWidth: function(maxWidth){
            if(typeof(size) === "number"){
                this.maxWidth = maxWidth+"px";
            }
            else{
                this.maxWidth = maxWidth;
            }
            this._changed = true;
            return this;
        },
        getMaxWidth: function(){
            return this.maxWidth;
        },
        setFontColor: function(r,g,b){

            if(typeof(r) == 'string' && g === undefined && b === undefined ){
                this.fontColor = r;
            }
            else if(typeof(r) !== undefined && g !== undefined && b !== undefined){
                this.fontColor="rgb("+r+","+g+","+b+")";
            }
            else if(typeof(r) !== undefined && g !== undefined && b !== undefined ){
                this.fontColor="rgb("+r+","+g+","+b+")";
            }
            return this;
        }

        
});;Jasper.AlphaAnimation = function(){
	this._name = "alpha";
	this.fromAlpha = null;
	this.toAlpha = null;
};



Jasper.AlphaAnimation.prototype = new Jasper.Animation();


Object.extend(Jasper.AlphaAnimation.prototype, {

	_update: function(dt){
		if(this._started && !this._paused){
			this._elapsedTime+=dt;
			if(this._elapsedTime >=this.duration){
				if(this.loop === true){
					this._elapsedTime%=this.duration;
					this.getParentObject().setAlpha(
						this._interpolator.getValue(this.fromAlpha, this.toAlpha, this._elapsedTime, this.duration));
					this._onFrame(dt);
					return;	
				}
				this.getParentObject().setAlpha(this.toAlpha);
				this._onFrame(dt);
				this._onEnd(dt);
			}
			else{
			this.getParentObject().setAlpha(
				this._interpolator.getValue(this.fromAlpha, this.toAlpha, this._elapsedTime, this.duration));
			this._onFrame(dt);
			}
		}
	}






});;Jasper.Interpolator = function(){
	
};


Jasper.Interpolator.prototype = {
	getValue: function(){}
};
;Jasper.LinearInterpolator = function(){
	
};

Jasper.LinearInterpolator.prototype = new Jasper.Interpolator();


Object.extend(Jasper.LinearInterpolator.prototype, {

	getValue: function(start, end, elapsed , dur){
		return start+((end-start) * elapsed/dur * 1.0);
	}
		
});
;Jasper.MoveAnimation = function(){
	this._name = "move";
	this.fromX = null;
	this.fromY = null;
	this.toX = null;
	this.toY = null;
};



Jasper.MoveAnimation.prototype = new Jasper.Animation();


Object.extend(Jasper.MoveAnimation.prototype, {


	_update: function(dt){
		if(this._started && !this._paused){
			this._elapsedTime+=dt;
			if(this._elapsedTime >=this.duration){
				if(this.loop === true){
					this._elapsedTime%=this.duration;
					this.getParentObject().setPos(
						this._interpolator.getValue(this.fromX, this.toX, this._elapsedTime, this.duration),
						this._interpolator.getValue(this.fromY, this.toY, this._elapsedTime, this.duration));
					this._onFrame(dt);
					return;	
				}
				this.getParentObject().setPos(this.toX, this.toY);
				this._onFrame(dt);
				this._onEnd(dt);
			}
			else{
			this.getParentObject().setPos(
				this._interpolator.getValue(this.fromX, this.toX, this._elapsedTime, this.duration),
				this._interpolator.getValue(this.fromY, this.toY, this._elapsedTime, this.duration));
			this._onFrame(dt);
			}
		}
	},






});;Jasper.MoveXAnimation = function(){
	this._name = "movex";
	this.fromX = null;
	this.toX = null;
};



Jasper.MoveXAnimation.prototype = new Jasper.Animation();


Object.extend(Jasper.MoveXAnimation.prototype, {


	_update: function(dt){
		if(this._started && !this._paused){
			this._elapsedTime+=dt;
			if(this._elapsedTime >=this.duration){
				if(this.loop === true){
					this._elapsedTime%=this.duration;
					this.getParentObject().setPosX(
						this._interpolator.getValue(this.fromX, this.toX, this._elapsedTime, this.duration)
						);
					this._onFrame(dt);	
					return;	
				}
				this.getParentObject().setPosX(this.toX);
				this._onFrame(dt);
				this._onEnd(dt);
			}
			else{
			this.getParentObject().setPosX(
				this._interpolator.getValue(this.fromX, this.toX, this._elapsedTime, this.duration)
				);
			this._onFrame(dt);
			}
		}
	},






});;Jasper.MoveYAnimation = function(){
	this._name = "movey";
	this.fromY = null;
	this.toY = null;
};



Jasper.MoveYAnimation.prototype = new Jasper.Animation();


Object.extend(Jasper.MoveYAnimation.prototype, {


	_update: function(dt){
		if(this._started && !this._paused){
			this._elapsedTime+=dt;
			if(this._elapsedTime >=this.duration){
				
				if(this.loop === true){
					this._elapsedTime%=this.duration;
					this.getParentObject().setPosY(
						this._interpolator.getValue(this.fromY, this.toY, this._elapsedTime, this.duration)
					);
					this._onFrame(dt);	
					return;	
				}
				this.getParentObject().setPosY(this.toY);
				this._onFrame(dt);
				this._onEnd(dt);
			}
			else{
			this.getParentObject().setPosY(
				this._interpolator.getValue(this.fromY, this.toY, this._elapsedTime, this.duration)
				);
			this._onFrame(dt);
			}
		}
	},






});;Jasper.RotateAnimation = function(){
	this._name = "rotate";
	this.fromRadian = null;
	this.fromAngle = null;
	this.toRadian = null;
	this.toAngle = null;
};



Jasper.RotateAnimation.prototype = new Jasper.Animation();


Object.extend(Jasper.RotateAnimation.prototype, {

	_update: function(dt){
		if(this._started && !this._paused){
			this._elapsedTime+=dt;
			if(this._elapsedTime >=this.duration){
				if(this.loop === true){
					this._elapsedTime%=this.duration;
					this._setRotation();
					this._onFrame(dt);	
					return;	
				}
				this._setRotation(true);
				this._onFrame(dt);
				this._onEnd(dt);
			}
			else{
			this._setRotation();
			this._onFrame(dt);
			}
		}
	},

	_setRotation: function(final){
		if(this.fromRadian === null && this.toRadian === null){
			if(final)
				this.getParentObject().setRotationAngle(this.toAngle);
			else
				this.getParentObject().setRotationAngle(
					this._interpolator.getValue(
						this.fromAngle, this.toAngle, this._elapsedTime, this.duration
						)
					);
		}
		else{
			if(final)
				this.getParentObject().setRotationRadian(this.toRadian);
			else
				this.getParentObject().setRotationRadian(
					this._interpolator.getValue(
						this.fromRadian, this.toRadian, this._elapsedTime, this.duration
						)
					);
		}
	}






});;Jasper.SizeAnimation = function(){
	this._name = "size";
	this.fromWidth = null;
	this.toWidth = null;
	this.fromHeight = null;
	this.toHeight = null;
};



Jasper.SizeAnimation.prototype = new Jasper.Animation();


Object.extend(Jasper.SizeAnimation.prototype, {

	_update: function(dt){
		if(this._started && !this._paused){
			this._elapsedTime+=dt;
			if(this._elapsedTime >=this.duration){
				if(this.loop === true){
					this._elapsedTime%=this.duration;
					this._setSize();
					this._onFrame(dt);	
					return;	
				}
				this._setSize(true);
				this._onFrame(dt);
				this._onEnd(dt);
			}
			else{
				this._setSize();
				this._onFrame(dt);
			}
		}
	},

	_setSize: function(final){
		if(final){
			this.getParentObject().setWidth(this.toWidth);
			this.getParentObject().setHeight(this.toHeight);	
		}
		else{
			this.getParentObject().setWidth(
				this._interpolator.getValue(
					this.fromWidth, this.toWidth, this._elapsedTime, this.duration
					)
				);
			this.getParentObject().setHeight(
				this._interpolator.getValue(
					this.fromHeight, this.toHeight, this._elapsedTime, this.duration
					)
				);
		}
	}






});;Jasper.SwingInterpolator = function(){
	
};

Jasper.SwingInterpolator.prototype = new Jasper.Interpolator();


Object.extend(Jasper.SwingInterpolator.prototype, {

	getValue: function(start, end, elapsed , dur){
		return start + (end-start) * ((- Math.cos(elapsed/dur * Math.PI) / 2) + 0.5);
	}
		
});
