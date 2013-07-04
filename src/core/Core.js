

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

