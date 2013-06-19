/*
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

