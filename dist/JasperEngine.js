
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

Jasper.Behavior.prototype.init = function(){};
Jasper.Behavior.prototype.update=function(){};
Jasper.Behavior.prototype.getParentObject = function(){
                        return this._parent;
                    };


Jasper.Behavior._createBehavior = function(varsObj, funsObj){
	var temp = new Jasper.Behavior();
	Object.extend(temp, funsObj);

	var newBeh = function(){};
	newBeh.prototype = temp;

	Object.extend(newBeh.prototype, funsObj);
    return newBeh;


};

///	RENDERABLE BEHAVIOR EXTENDING BEHAVIOR ///

Jasper.RenderableBehavior = function(){

	
}; 

Jasper.RenderableBehavior.prototype = new Jasper.Behavior();

Jasper.RenderableBehavior.prototype.renderBefore = function(ctx){
	ctx.save();
};

Jasper.RenderableBehavior.prototype.renderAfter = function(ctx){
	ctx.restore();
};

Jasper.RenderableBehavior.prototype.render = function(){};


Jasper.RenderableBehavior._createRenderBehavior = function(varsObj, funsObj){
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
        'testmove': Jasper.RandomMoveBehavior,
        'mouse': Jasper.MouseBehavior,
        'sprite': Jasper.SpriteBehavior,
        'collision': Jasper.CollisionBehavior
    };

    this._nonUpdateBehaviors = ['mouse', 'collision'];

};


Jasper.BehaviorManager.prototype = {

    _addBehaviorToObject: function (behaviorName, object) {
        if (typeof (behaviorName) == "string") {
            if (hasOwnProperty(this._name_beh, behaviorName)) {

                var behavior = new this._name_beh[behaviorName]();

                if (this._beh_BehObjPairs[behaviorName] === undefined) {
                    this._beh_BehObjPairs[behaviorName] = [];
                }
                this._beh_BehObjPairs[behaviorName].push([behavior, object]);

                console.log("returning behavior", behavior);

                if (typeof (behavior.init) == "undefined") {
                    behavior.prototype.init = function (object) {};
                }
                //behavior.init(object); //TODO: Add behavior init functionality for each behavior
                return behavior;
            } else {
                console.log("Behavior "+behaviorName+" has not been registered to JasperCore");
                console.log("returning null");
                return null;

            }
        }

    },

    _createBehavior: function (behaviorName, behaviorClass) {
        if (typeof (behaviorName) == "string") {
            if (hasOwnProperty(this._name_beh, behaviorName)) {
                console.log("Behavior name already present : " + behaviorName);
                return null;
            } else {
                //contents.class = "JasperBehavior";
                this._name_beh[behaviorName] = behaviorClass;

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


	followObject: function(obj, offsetX, offsetY){

	},

	getViewportPos: function(obj){
		return [obj.getPosX()-this.getCameraX(), obj.getPosY()-this.getCameraY()];
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
                   // 
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



    


    

};;/*
Handle createbehavior

*/


Jasper.Core    = function(args){

    this.fps = 60;
    this.running = false;
    
    this.lastTime = 0;
    
    this.canvas = null;
    this.canvasWidth = args.canvasWidth;
    this.canvasHeight = args.canvasHeight;
    this.containerId = args.container;
    this.canvasContext = null;
    
    this.scenes = [];
    this.activeScene = null;

    this. __next_objid=1;
    this.onInit = function(){};

    //this. core;
    //this. behaviorManager;
};



Jasper.Core.prototype = {

        _createCanvas: function(){
            this.canvas = document.createElement('canvas');
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
       
        
        
        init : function(){
            Jasper._core = this;
            
            Jasper._mouseManager = new Jasper.Mouse();
            Jasper._behaviorManager = new Jasper.BehaviorManager();
            Jasper._spriteManager = new Jasper.SpriteManager();
            Jasper._collisionManager = new Jasper.CollisionManager();
            Jasper._animationManager = new Jasper.AnimationManager();
            this._createCanvas();
            this._start();
            return this;
        },

        pause: function(){
            this.running = false;
            return this;
        },

        play: function(){
            this.running = true;
            return this;
        },

        getCanvas: function(){
            return this.canvas;
        },

        getMouseManager: function(){
            return Jasper._mouseManager;
        },

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

        getCurrentScene: function(){
            return this.activeScene;
        },

        startScene: function(jasperScene){
            if(jasperScene instanceof Jasper.Scene){
                jasperScene._onStart();
                this.activeScene = jasperScene;
                return this;
            }
            else
                throw Error("Can only start a valid Jasper.Scene");
        },

        endScene: function(){
            this.scenes.splice(this.scenes.indexOf(this.activeScene),1);
            this.activeScene = undefined;
            return this;
        },

        getSceneByName: function(jasperSceneName){
            for (var i=0; i<this.scenes.length; i++){
                if(this.scenes[i].getSceneName()==jasperSceneName){
                    return this.scenes[i];
                }
            }
        },

        getScenes: function(){
            return this.scenes;
        },

        createBehavior: function(behaviorName, behaviorVars, behaviorFuns){
            var behaviorClass = Jasper.Behavior._createBehavior(behaviorVars, behaviorFuns);
            return Jasper._behaviorManager._createBehavior(behaviorName, behaviorClass);
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
*TODO: add object id calc in Jasper.Object
        remove objects


*/

Jasper.Layer = function(args){
    this._name=args.name;

    this._hud = false;
    this._camera  = undefined;
    if(args.hud !== undefined){
        this._hud = true;
    }
    
    this._scene = null;
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

        getWorldSize: function(){
            return [this.worldW, this.worldH];
        },

        addObject: function(jasperObject){
            if(jasperObject instanceof Jasper.Object){
                jasperObject._layer = this;
                this.objects.push(jasperObject);
                this.numObjects++;

                this._onObjectAdd(jasperObject);
                jasperObject._onAddedToLayer();
                return this;
                
            } 
            else{
                throw Error("Cannot add object, needs JasperObject" );
            }

        },

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
        getObjects: function(){
            return this.objects;
        },
        getScene: function(){
            return this._scene;
        },
        getLayerNumber: function(){
            return this._layerNumber;
        },
        getCamera: function(){
            return this._camera;
        },
        isHud: function(){
            return this._hud;
        }

        
};
;/**
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
;Jasper.Scene = function(args){

    this.sceneName = args.name;

    this.worldW = args.worldW;
    this.worldH = args.worldH;

    this._camera = new Jasper.Camera({
        width:500,
        height:500,
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

        setSceneName: function(name){
            this.sceneName=name;
            return this;
        },

        getSceneName: function(){
            return this.sceneName;
        },
        //                                Option to add layer number for comfort
        addLayer: function(jasperLayer){
            if(jasperLayer instanceof Jasper.Layer){
                
                jasperLayer.worldW=this.worldW;
                jasperLayer.worldH=this.worldH;
                
                this.layerList.push(jasperLayer);
                jasperLayer.scene = this;
                jasperLayer._layerNumber = this.numLayers;
                jasperLayer._camera = this._camera;
                this.numLayers++;


                this._onAddLayer(jasperLayer);
                jasperLayer._onAdd();

                return this;
            }
            else{
                throw Error("Cannot add object to scene. need Jasper.Layer");
            }
        },
        //jasperLayers is an array of jasper.layer
        addLayers: function(jasperLayers){
            var len = jasperLayers.length;
            for(var i=0; i<len; i++){
                this.addLayer(jasperLayers[i]);
            }
        },
        getLayerWithNumber: function(num){
            len = this.layerList.length;
            for(var i=0;i<len;i++){
                if(this.layerList[i].getLayerNumber() == num){
                    return this.layerList[i];
                }
            }
            return null;
        },
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






};;Jasper.AnimationManager = function(){
	
	this._objectsToAnimate = [];
	this._animLookup = {
		"move": Jasper.MoveAnimation,
		"movex": Jasper.MoveXAnimation,
		"movey": Jasper.MoveYAnimation,
		"alpha": Jasper.AlphaAnimation,
		"rotate": Jasper.RotateAnimation
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
    this._mousePos = [];
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
    this.rad = 0;
    this.strokeColor = 'black';
    this.strokeWidth = 5;
    this.fillColor = 'black';


    this.fill = true;
    this.stroke = true;

};

Jasper.CircleDrawBehavior.prototype = new Jasper.RenderableBehavior();

Object.extend(Jasper.CircleDrawBehavior.prototype, {
        init:function(){

        },
        update: function(dt){},

        render:function(ctx){
            parent = this.getParentObject();
            ctx.beginPath();

            ctx.arc(Math.floor(parent.getPosX()), Math.floor(parent.getPosY()), this.rad, 0, 2 * Math.PI, true);
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
            this.rad=radius;
            return this;
        },
        setFillColor: function(r,g,b,a){

            if(typeof(r) == 'string' && g === undefined && b === undefined && a === undefined){
                this.fillColor = r;
            }
            else if(typeof(r) !== undefined && g !== undefined && b !== undefined && a === undefined){
                this.fillColor="rgba("+r+","+g+","+b+","+this.getParentObject().getAlpha()+")";
            }
            else if(typeof(r) !== undefined && g !== undefined && b !== undefined && a !== undefined){
                this.getParentObject().setAlpha(a);
                this.fillColor="rgba("+r+","+g+","+b+","+a+")";
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
        
});;Jasper.CollisionBehavior = function(){
    this._collided = false;
};

Jasper.CollisionBehavior.prototype = new Jasper.Behavior();



Object.extend(Jasper.CollisionBehavior.prototype,{

        init: function(object){
            Jasper._behaviorManager._addNonUpdateBehavior('collision');
            Jasper._collisionManager._registerCollidableObject(this.getParentObject());
            //Jasper._mouseManager.registerCallbackObject(object);
        },

        setOnCollide: function(collideFunc){
            this.onCollide = collideFunc;
        },

        onCollide: function(collidedObj){}

        


});;Jasper.MouseBehavior = function(){

};

Jasper.MouseBehavior.prototype = new Jasper.Behavior();



Object.extend(Jasper.MouseBehavior.prototype,{

        init: function(object){
            Jasper._behaviorManager._addNonUpdateBehavior('mouse');
            //Jasper._mouseManager.registerCallbackObject(object);
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
        init:function(){

        },
        update: function(dt){},

        render:function(ctx){
            parent = this.getParentObject();

            ctx.beginPath();
            ctx.moveTo(this._points[0][0], this._points[0][1]);
            for (var i=0; i<this._numPoints; i++){
                ctx.lineTo(this._points[this._numPoints][0], this._points[this._numPoints][1]);
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

            if(typeof(r) == 'string' && g === undefined && b === undefined && a === undefined){
                this.fillColor = r;
            }
            else if(typeof(r) !== undefined && g !== undefined && b !== undefined && a === undefined){
                this.fillColor="rgba("+r+","+g+","+b+","+this.getParentObject().getAlpha()+")";
            }
            else if(typeof(r) !== undefined && g !== undefined && b !== undefined && a !== undefined){
                this.getParentObject().setAlpha(a);
                this.fillColor="rgba("+r+","+g+","+b+","+a+")";
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
    this.width = 0;
    this.height = 0;
    this.strokeColor = 'black';
    this.strokeWidth = 5;
    this.fillColor = 'black';

    this.fill = true;
    this.stroke = true;

};

Jasper.RectangleDrawBehavior.prototype = new Jasper.RenderableBehavior();

Object.extend(Jasper.RectangleDrawBehavior.prototype, {
        init:function(){

        },
        update: function(dt){},

        render:function(ctx){
            parent = this.getParentObject();

            if(this.fill){
                ctx.fillStyle = this.fillColor;
                ctx.fillRect(parent.posX, parent.posY, this.width, this.height);
            }
            if(this.stroke){
                ctx.lineWidth = this.strokeWidth;
                ctx.strokeStyle = this.strokeColor;
                ctx.strokeRect(parent.posX, parent.posY, this.width, this.height);
            }


        },

        setWidth: function(width){
            this.width=width;
            return this;
        },
        setHeight: function(height){
            this.height=height;
            return this;
        },
        setFillColor: function(r,g,b,a){

            if(typeof(r) == 'string' && g === undefined && b === undefined && a === undefined){
                this.fillColor = r;
            }
            else if(typeof(r) !== undefined && g !== undefined && b !== undefined && a === undefined){
                this.fillColor="rgba("+r+","+g+","+b+","+this.getParentObject().getAlpha()+")";
            }
            else if(typeof(r) !== undefined && g !== undefined && b !== undefined && a !== undefined){
                this.getParentObject().setAlpha(a);
                this.fillColor="rgba("+r+","+g+","+b+","+a+")";
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
        
});;/*
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
                pos = parent.getViewportPos();
                ctx.drawImage(this._sprite, pos[0], pos[1], parent.width, parent.height);
            }
        },      

        setSprite: function(path){
            if(this._path != path){
                this._path = path;
                Jasper._spriteManager.setSprite(this, this._path);
            }
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
        _adjustDimensions: function(){
            if(this._toAdjust){
                parent = this.getParentObject();
                parent.width=Math.floor(this._nativeWidth*this._scaleX);
                parent.height=Math.floor(this._nativeHeight*this._scaleY);
            }
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
	},






});;Jasper.LinearInterpolator = function(){
	
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
				this.getParentObject().setRotation(this.toRadian);
			else
				this.getParentObject().setRotation(
					this._interpolator.getValue(
						this.fromRadian, this.toRadian, this._elapsedTime, this.duration
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
