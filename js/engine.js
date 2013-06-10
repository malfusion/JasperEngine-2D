/**
 * Created with JetBrains WebStorm.
 * User: Jude Naveen Raj
 * Date: 9/6/13
 * Time: 10:44 PM
 * To change this template use File | Settings | File Templates.
 */

var Jasper = {};

var JasperCore    = (function(){

    var fps = 0;
    var canvasContext;
    var running = false;
    var scenes=[];
    var activeScene;
    //var core;
    //var behaviorManager;

    function createCanvas(width, height){
        canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        document.getElementById('container').appendChild(canvas);
        canvasContext = canvas.getContext('2d');
    }

    function render() {

    }

    function update(){
        if(running)
            requestAnimFrame(update);
        console.log('Frame');
        if(activeScene != undefined)
            if(activeScene.class == "JasperScene")
                activeScene.update();
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
        update: function(){
            console.log(this.getSceneName());

            for (var i=0 ;i<numLayers; i++){
                layerList[i].update(i);
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
        update: function(layerNumber){
            console.log('Layer '+layerNumber+" then "+numObjects);
            for(var i=0; i<numObjects; i++){
                objects[i].update();
            }
        }

    };

});

var JasperObject = (function(objectName){
    var behaviorNames=[];
    var visible = false;
    var name=objectName;

    return {
        class: 'JasperObject',
        core : undefined,
        scene : undefined,

        //RETURNS: JasperBehavior Object
        addBehavior: function (behaviorName){                   //Can add both by string // NOT SURE: or by passing custom behavior object
            if(typeof (behavior) == "string"){
                var behavior = Jasper.core.addBehaviorObjectPair(behaviorName);
                if(behavior.class == "JasperBehavior"){
                    behaviorNames.push(behaviorName);
                    return behavior;
                }
            }
        },
        removeBehavior: function (behaviorName){
            for( var i=0; i<behaviorNames.length; i++){
                //if(behaviors[i])
            }
        },
        setVisible: function(isVisible){
            visible=isVisible;
        },
        isVisible: function(){
            return visible;
        },
        update: function(){
            console.log(name);
        }

    }
});


var JasperBehaviorManager = (function(){
    var beh_BehObjPairs={};
    var Name_Beh={'move':MoveBehavior};

    return{
        class: 'JasperBehaviorManager',

        //Could be behavior NAME ////////////NOT SURE: or JasperBEhavior Object
        addBehaviorToObject: function(behaviorName, object){
            if(typeof (behavior) == "string")
                if( hasOwnProperty(Name_Beh,behaviorName) ){
                    var behavior = Name_Beh[behaviorName]();
                    beh_BehObjPairs[behaviorName] = [behavior,object];
                    return behavior;
                }
                else{
                    console.log("Behavior has not been registered to JasperCore");
                    return null;
                }

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