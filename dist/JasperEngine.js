
var Jasper = function(){




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
;Jasper.Behavior = function(){
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
        'sprite': Jasper.SpriteBehavior
    };

    this._nonUpdateBehaviors = ['mouse'];

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
                behavior.init(object); //TODO: Add behavior init functionality for each behavior
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


};;/*
Handle createbehavior

*/


Jasper.Core    = function(){

    this.fps = 60;
    this.running = false;
    
    this.lastTime = 0;
    
    this.canvas = null;
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.canvasContext = null;
    
    this.scenes = [];
    this.activeScene = null;

    this. __next_objid=1;
    this.onInit = function(){};

    //this. core;
    //this. behaviorManager;
};



Jasper.Core.prototype = {

        _createCanvas: function(width, height){
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.canvasWidth = width;
            this.canvas.height = this.canvasHeight = height;
            this.canvas.onmousemove = function(e){ Jasper._mouseManager.mouseMove(e);};
            this.canvas.onmousedown = Jasper._mouseManager.mouseDown.bind(Jasper._mouseManager);
            this.canvas.onmouseup = Jasper._mouseManager.mouseUp.bind(Jasper._mouseManager);
            this.canvas.onclick = Jasper._mouseManager.mouseClick.bind(Jasper._mouseManager);
            this.canvas.ondblclick = Jasper._mouseManager.mouseDblClick.bind(Jasper._mouseManager);
            this.canvasContext = this.canvas.getContext('2d');
            document.getElementById('container').appendChild(this.canvas);
        },

        _render: function () {
            this.canvasContext.save();
            this.canvasContext.clearRect(0,0,this.canvasWidth,this.canvasHeight);
            this.activeScene._render(this.canvasContext);
            this.canvasContext.restore();        
        },

        _update : function (){
            //console.log(this.lastTime);

            currTime = new Date().getTime();
            //console.log(this.currTime);
            elapsedTime = currTime - this.lastTime;
            this.lastTime=currTime;
            

            //if(this.showFps)
            //  console.log(elapsedTime);
            if(this.running)
                requestAnimFrame(this._update.bind(this));

            //console.log('Frame');
            if(this.activeScene instanceof Jasper.Scene){
                this.activeScene._update(elapsedTime);
                Jasper._mouseManager._activateCallbacks();
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
       
        
        // expects 'width', 'height', 'fps'
        init : function(args){
            Jasper._mouseManager = new Jasper.Mouse();
            Jasper._behaviorManager = new Jasper.BehaviorManager();
            Jasper._spriteManager = new Jasper.SpriteManager();
            this._createCanvas(args.width, args.height);
            this.setFps(args.fps || 30);
            Jasper._core = this;
            this._start();
        },

       

        getCanvas: function(){
            return this.canvas;
        },

        getMouseManager: function(){
            return Jasper._mouseManager;
        },

        addScene: function(jasperScene){
            if(this.scenes.indexOf(jasperScene) == -1)
                this.scenes.push(jasperScene);
        },
        removeScene: function(jasperScene){
            if(this.activeScene == jasperScene){
                console.log("Trying to remove currently active scene not permitted.");
                return;
            }

            var indx = this.scenes.indexOf(jasperScene);
            if(indx != -1)
                this.scenes.splice(indx,1);

        },
        removeSceneByName: function(jasperSceneName){
            if(this.activeScene.getSceneName() == jasperSceneName){
                console.log("Trying to remove currently active scene not permitted.");
                return;
            }
            for (var i=0; i<this.scenes.length; i++){
                if(this.scenes.getSceneName()==jasperSceneName){
                    this.scenes.splice(i,1);
                }
            }
        },
        getScenes: function(){
            return this.scenes;
        },

        startScene: function(jasperScene){
            this.activeScene = jasperScene;
        },

        endScene: function(){
            this.scenes.splice(this.scenes.indexOf(this.activeScene),1);
            this.activeScene = undefined;

        },
/*
        addBehaviorObjectPair: function(behaviorName, object){
           return Jasper.BehaviorManager.addBehaviorToObject(behaviorName, object);
        },
        deleteBehaviorObjectPair: function(behaviorName, object){
            Jasper.BehaviorManager.deleteBehaviorFromObject(behaviorName, object);
        },
        

        objectId: function objectId(obj) {
            if (obj==null) return null;
            if (obj.__obj_id==null) obj.__obj_id=__next_objid++;
            return obj.__obj_id;
        },
*/
createBehavior: function(behaviorName, behaviorVars, behaviorFuns){
            var behaviorClass = Jasper.Behavior._createBehavior(behaviorVars, behaviorFuns);
            return Jasper._behaviorManager._createBehavior(behaviorName, behaviorClass);
        },
        setFps : function(engineFps){
                       fps=engineFps;
                    }


};

;/*
*TODO: add object id calc in Jasper.Object
        remove objects


*/

Jasper.Layer = function(){
    this._scene = null;
    this._layerNumber = -1;

    this.worldSize={};
    this.viewportSize={};

    this.objects = [];
    this.numObjects = 0;


    this.onInit=function(){};
    this.onUpdate=function(){};
    this.onDestroy=function(){};
       
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

        setWorldSize: function(width,height){
            this.worldSize.x=width; 
            this.worldSize.y=height;
        },
        getWorldSize: function(){
            return this.worldSize;
        },
        setViewportSize: function(width,height){
            this.viewportSize.x=width; 
            this.viewportSize.y=height;
        },
        getViewportSize: function(){
            return this.viewportSize;
        },
        addObject: function(jasperObject){
            if(jasperObject instanceof Jasper.Object){
                jasperObject._layer = this;
                this.objects.push(jasperObject);
                this.numObjects++;
            }
            else{
                console.log("Cannot add object of type : "+jasperObject.class+" ; needs JasperObject" );
            }

        },
        removeObject: function(object){

        },
        getObjects: function(){
            return this.objects;
        },
        getScene: function(){
            return this._scene;
        }

        
};
;/**
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
    this.height = 0;
    this.width = 0; 
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
            if(this._rendererBehavior instanceof Jasper.RenderableBehavior){
                this._rendererBehavior.renderBefore(ctx);
                this._rendererBehavior.render(ctx);
                this._rendererBehavior.renderAfter(ctx);
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

                    behavior._parent = this;
                    
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
;Jasper.Scene = function(sceneName){
    this.sceneName = sceneName;

    this.layerList=[];
    this.numLayers=0;

    this.onInit=function(){};
    this.onUpdate=function(){};
    this.onDestroy=function(){};
       
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

        setSceneName: function(name){
            this.sceneName=name;
        },

        getSceneName: function(){
            return this.sceneName;
        },
        //                                Option to add layer number for comfort
        addLayer: function(jasperLayer){
            if(jasperLayer instanceof Jasper.Layer){
                this.layerList.push(jasperLayer);
                jasperLayer.scene = this;
                jasperLayer.layerNumber = this.numLayers;
                this.numLayers++;
            }
            else{
                console.log("Cannot add object to scene. need Jasper.Layer");
            }
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






};;
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
        /*
        setClickPos: function(x,y){
            clickX=x;
            clickY=y;
        },
        setDblClickPos: function(x,y){
            dblclickX=x;
            dblclickY=y;
        },
        setUpPos: function(x,y){
            upX=x;
            upY=y;
        },
        setDownPos: function(x,y){
            downX=x;
            downY=y;                                
        },
        */
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




        registerCallbackObject: function(object){
            if(this._existsCallbackObject(object) == -1){
                this._callbackObjects.push(object);
            }
        },
        removeCallbackObject: function(object){
            var pos = this._existsCallbackObject(object);
            if(pos != -1){
                this._callbackObjects.splice(pos,1);
            }
        },
        _activateCallbacks: function(){
            var len = this._callbackObjects.length;
            var evs = this._events.length;
            for(var i=0; i<evs; i++){
                var e = this._events[i][0];
                var x = this._events[i][1];
                var y = this._events[i][2];
                
                for(var j=0; j<len; j++){

                    this._callbackObjects[j].getBehavior("mouse")[e](x,y);                 //Calls onMove(x,y), onClick(x,y), etc, ...
                }
                

            }
            //Clear the this._events array
            this._events.length=0;
        }



        
};



;/*
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
        
});;Jasper.MouseBehavior = function(){};

Jasper.MouseBehavior.prototype = new Jasper.Behavior();



Object.extend(Jasper.MouseBehavior.prototype,{

        init: function(object){
            Jasper._behaviorManager._addNonUpdateBehavior('mouse');
            Jasper._mouseManager.registerCallbackObject(object);
        },
        onClick: function(){},
        onMove: function(){},
        onDown: function(){},
        onUp: function(){},
        onDblClick: function(){}

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