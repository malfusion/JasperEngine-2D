/*
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

