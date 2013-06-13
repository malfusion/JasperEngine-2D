/**
 * Created with JetBrains WebStorm.
 * User: Jude Naveen Raj
 * Date: 9/6/13
 * Time: 10:44 PM
 * To change this template use File | Settings | File Templates.
 */

 /*
 *
 * ALWAYS RENDER WITHOUT FLOATS
 *
 * TODO: remove behavior
 *
 *
  */

var showFps = false;
var Jasper = {};


var JasperCore    = (function(){

    var fps = 0;
    var canvasContext;
    var running = false;
    var scenes=[];
    var activeScene;
    var lastTime;
    var canvas;
    //var core;
    //var behaviorManager;

    function createCanvas(width, height){
        canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.onmousemove = JasperMouse.mouseMove;
        //canvas.onmousedown = JasperMouse.mouseDown;

        document.getElementById('container').appendChild(canvas);
        canvasContext = canvas.getContext('2d');
    }

    function render() {

        if(activeScene != undefined)
            if(activeScene.class == "JasperScene"){
                canvasContext.clearRect(0,0,500,500);
                activeScene.render(canvasContext);
            }

    }

    function update(){
        currTime = new Date().getTime();
        if(lastTime == undefined)
            lastTime = currTime;
        var elapsedTime = currTime - lastTime;
        lastTime=currTime;
        if(showFps)
            console.log(elapsedTime);

        if(running)
            requestAnimFrame(update);
        //console.log('Frame');
        if(activeScene != undefined)
            if(activeScene.class == "JasperScene")
                activeScene.update(elapsedTime);
        render();

    }

    return{
        class : "JasperCore",

        setFps : function(engineFps){
                       fps=engineFps;
                    },

        // expects 'width', 'height', 'fps'
        init : function(args){
            createCanvas(args.width, args.height);
            this.setFps(args.fps || 30);
            Jasper.core = this;
            Jasper.behaviorManager = JasperBehaviorManager();
            this.start();
        },

        start : function(){
            running=true;
            requestAnimFrame(update);
        },
        getCanvas: function(){
            return canvas;
        },
        addScene: function(jasperScene){
            if(scenes.indexOf(jasperScene) == -1)
                scenes.push(jasperScene);
        },
        removeScene: function(jasperScene){
            if(activeScene == jasperScene){
                console.log("Trying to remove currently active scene not permitted.");
                return;
            }

            var indx=scenes.indexOf(jasperScene);
            if(indx != -1)
                scenes.splice(indx,1);

        },
        removeSceneByName: function(jasperSceneName){
            if(activeScene.getSceneName() == jasperSceneName){
                console.log("Trying to remove currently active scene not permitted.")
                return;
            }
            for (var i=0; i<scenes.length; i++){
                if(scenes.getSceneName()==jasperSceneName){
                    scenes.splice(i,1);
                }
            }
        },
        getScenes: function(){
            return scenes;
        },
        startScene: function(jasperScene){
            activeScene = jasperScene;
        },
        endScene: function(){
            scenes.splice(scenes.indexOf(activeScene),1);
            activeScene = undefined;

        },

        getCore: function(){
            return core;
        },
        addBehaviorObjectPair: function(behaviorName, object){
           return Jasper.behaviorManager.addBehaviorToObject(behaviorName, object);
        },
        createBehavior: function(behaviorName, behaviorContent){
            return Jasper.behaviorManager.createBehavior(behaviorName, behaviorContent)
        }


    };



});


var JasperScene = (function(sceneName){
    var sceneName = sceneName;
    var layerList=[]
    var numLayers=0;

    return {
        class : 'JasperScene',
        setSceneName: function(name){
            sceneName=name;
        },
        getSceneName: function(){
            return sceneName;
        },
        //                                Option to add layer number for comfort
        addLayer: function(jasperLayer){
            if(jasperLayer.class == "JasperLayer"){
                layerList.push(jasperLayer);
                numLayers++;
            }
            else{
                console.log("Cannot add object of type : "+jasperLayer.class+" need JasperLayer");
            }
        },
        update: function(dt){
            //console.log(this.getSceneName());

            for (var i=0 ;i<numLayers; i++){
                layerList[i].update(dt);
            }
        },
        render: function(canvasContext){
            for (var i=0 ;i<numLayers; i++){
                layerList[i].render(canvasContext);
            }
        }


    };


});

var JasperLayer=(function(){
    var worldSize={};
    var viewportSize={};
    var objects = [];
    var numObjects = 0;

    return {
        class: "JasperLayer",
        setWorldSize: function(width,height){
            worldSize.x=width; worldSize.y=height;
        },
        getWorldSize: function(){
            return worldSize;
        },
        setViewportSize: function(width,height){
            viewportSize.x=width; viewportSize.y=height;
        },
        getViewportSize: function(){
            return viewportSize;
        },
        addObject: function(jasperObject){
            if(jasperObject.class == "JasperObject"){
                objects.push(jasperObject);
                numObjects++;
            }
            else{
                console.log("Cannot add object of type : "+jasperObject.class+" ; needs JasperObject" );
            }

        },
        removeObject: function(object){

        },
        getObjects: function(){
            return objects;
        },
        update: function(dt){//layerNumber{
            //console.log('Layer '+layerNumber+" then "+numObjects);
            for(var i=0; i<numObjects; i++){
                objects[i].update(dt);
            }
        },
        render: function(canvasContext){
            for(var i=0; i<numObjects; i++){
                objects[i].render(canvasContext);
            }
        }

    };

});

var JasperObject = (function(objectName){
    var behaviors={};
    var rendererBehavior;
    var visible = false;
    var posX = 0;
    var posY = 0;
    var worldX = 0;
    var worldY = 0;
    var rotation = 0;
    var alpha = 0;


    var name=objectName;

    return {
        class: 'JasperObject',
        core : undefined,

        scene : undefined,
        getPosX: function(){
            return posX;
        },
        setPosX: function(posx){
            posX=posx;
        },
        getPosY:function(){
            return posY;
        },
        setPosY: function(posy){
            posY=posy;
        },
        setPos: function(x,y){
            posX=x; posY=y;
        },
        getAlpha:function(){
            return alpha;
        },
        setAlpha: function(val){
            alpha=val;
        },
        //RETURNS: JasperBehavior Object
        addBehavior: function (behaviorName){                   //Can add both by string // NOT SURE: or by passing custom behavior object
            if(typeof (behaviorName) == "string"){
                var behavior = Jasper.core.addBehaviorObjectPair(behaviorName, this);
                console.log(behavior);
                if(behavior.class == "JasperBehavior"){
                    behaviors[behaviorName]=behavior;
                    behavior.parentObject = this;
                    behavior.getParentObject = function(){
                        return this.parentObject;
                    }
                    if(hasOwnProperty(behavior,'render')){
                        if(typeof(behavior.render) == "function"){
                            console.log("renderer found");
                            rendererBehavior = behavior;
                        }
                    }
                    return behavior;
                }
            }
        },
        removeBehavior: function (behaviorName){
            delete behaviors[behaviorName];
        },
        hasBehavior: function(behaviorName){
            if(behaviors[behaviorName] == undefined){
                return false;
            }
            return true;
        },
        setVisible: function(isVisible){
            visible=isVisible;
        },
        isVisible: function(){
            return visible;
        },
        update: function(dt){
            //console.log(name);
            for (behavior in behaviors){
                //console.log(name+" : "+behavior);
                behaviors[behavior].update(dt);
            }
        },
        render: function(ctx){
            rendererBehavior.render(ctx);
        },
        // Custom Renderer Behavior overwrites all older behaviors and can be used for dynamic rendering
        setCustomRenderer: function(rendererBehaviorName){
            rendererBehavior = behaviors[rendererBehaviorName];
        }


    }
});


var JasperBehaviorManager = (function(){
    var beh_BehObjPairs={};
    var Name_Beh={
        //'move': MoveBehavior,
        'circle': CircleDrawBehavior,
        'testmove': RandomMoveBehavior
    };

    return{
        class: 'JasperBehaviorManager',

        //Could be behavior NAME ////////////NOT SURE: or JasperBEhavior Object
        addBehaviorToObject: function(behaviorName, object){
            if(typeof (behaviorName) == "string"){
                if( hasOwnProperty(Name_Beh,behaviorName) ){

                    var behavior = Name_Beh[behaviorName]();
                    beh_BehObjPairs[behaviorName] = [behavior,object];
                    console.log("returning behavior");
                    return behavior;
                }
                else{
                    console.log("Behavior has not been registered to JasperCore");
                    console.log("returning null");
                    return null;

                }
            }

        },

        createBehavior: function(behaviorName, contents){
            if(typeof (behaviorName) == "string"){
                if( hasOwnProperty(Name_Beh,behaviorName) ){
                    console.log("Behavior name already present : "+behaviorName);
                    return null;
                }
                else{
                    //contents.class = "JasperBehavior";
                    Name_Beh[behaviorName] = (function(){
                        var con = contents();
                        con.class = "JasperBehavior";
                        return con;
                    });

                    return behaviorName;
                }
            }
        }


        //Debug functions:
        ,getAllBehaviors: function(){
            var behNames = [];
            for (name in Name_Beh)
                behNames.push(name);
            return behNames;
        }

    }
});
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

// Must define "class":"JasperBehavior" when creating behaviour



var DrawBehavior = (function(){
    return {
        render: function(){

        }
    }
});

var RandomMoveBehavior = (function(){
    var finalx = Math.floor((Math.random()*500)+1);
    var finaly = Math.floor((Math.random()*500)+1);
    var initx = 0;
    var inity = 0;
    var elapsed=0;
    return{
        class: "JasperBehavior",
        update: function(dt){
            parent = this.getParentObject();
            elapsed+=dt;
            if(elapsed<20000){
                parent.setPosX(Math.floor((finalx-initx)/20000.0*elapsed));
                parent.setPosY(Math.floor((finaly-inity)/20000.0*elapsed));
            }
        }

    }
});

var CircleDrawBehavior = (function(){
    var rad = 0;
    var strokeColor = 'black';
    var strokeWidth = 5;
    var fillColorR = 0;
    var fillColorG = 0;
    var fillColorB = 0;
    var fillColorA = 1;

    var fill = true;
    var stroke = true;


    return{
        class: "JasperBehavior",

        setRadius:function(radius){
            rad=radius;
            return this;
        },
        setFillColor: function(r,g,b,a){
            fillColorR=r;
            fillColorG=g;
            fillColorB=b;

            if(a != undefined){
                this.getParentObject().setAlpha(a);
                fillColorA=a;
            }
            return this;
        },
        setFillEnabled: function(boolean){
            fill=boolean;
            return this;
        },
        setStrokeEnabled: function(boolean){
            stroke=boolean;
            return this;
        },
        setStrokeWidth: function(width){
            strokeWidth=width;
            return this;
        },
        update: function(dt){

        },

        render:function(ctx){
            parent = this.getParentObject();
            ctx.beginPath();

            ctx.arc(Math.floor(parent.getPosX()), Math.floor(parent.getPosY()), rad, 0, 2 * Math.PI, true);
            if(fill){
                ctx.fillStyle = "rgba("+fillColorR+","+fillColorG+","+fillColorB+","+parent.getAlpha()+")";
                ctx.fill();
            }
            if(stroke){
                ctx.lineWidth = strokeWidth;
                ctx.strokeStyle = strokeColor;
                ctx.stroke();
            }


        }

    }
});



//HELPERS


function hasOwnProperty(obj, prop) {
    var proto = obj.__proto__ || obj.constructor.prototype;
    return (prop in obj) &&
        (!(prop in proto) || proto[prop] !== obj[prop]);
}

if ( Object.prototype.hasOwnProperty ) {
    var hasOwnProperty = function(obj, prop) {
        return obj.hasOwnProperty(prop);
    }
}

var JasperMouse = ((function(){
    return{
        mouseX:0,
        mouseY:0,
        funs:[],

        getMousePos: function(){
            return [this.mouseX,this.mouseY];
        },
        setMousePos: function(x,y){
            this.mouseX=x;
            this.mouseY=y;
        },
        mouseMove: function(e)
        {
            if(e.offsetX) {
                JasperMouse.setMousePos(e.offsetX, e.offsetY);
            }
            else if(e.layerX) {
                JasperMouse.setMousePos(e.layerX, e.layerY);
            }
        },
        mouseDown: function(e){
            console.log("inside click");
            console.log(this.funs);

        },
        onMouseDown: function(fun){
            console.log(fun);
            this.funs.push(fun);
            console.log(this.funs);
        }

        }
})());
