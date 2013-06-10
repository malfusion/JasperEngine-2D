/**
 * Created with JetBrains WebStorm.
 * User: Jude Naveen Raj
 * Date: 9/6/13
 * Time: 10:44 PM
 * To change this template use File | Settings | File Templates.
 */



var JunisCore    = (function(){

    var fps = 0;
    var canvasContext;
    var running = false;
    var scenes=[];

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
        render();

    }

    return{


        setFps : function(engineFps){
                       fps=engineFps;
                    },

        // expects 'width', 'height', 'fps'
        init : function(args){
            createCanvas(args.width, args.height);
            this.setFps(args.fps || 30);
            this.start();
        },

        start : function(){
            running=true;
            requestAnimFrame(update);
        },
        addScene: function(junisScene){
            if(scenes.indexOf(junisScene) == -1)
                scenes.push(junisScene);
        },
        removeScene: function(junisScene){
            if(activeScene == junisScene){
                console.log("Trying to remove currently active scene not permitted.")
                return;
            }

            indx=scenes.indexOf(junisScene);
            if(indx != -1)
                scenes.splice(indx,1);

        },
        removeSceneByName: function(junisSceneName){
            if(activeScene.getSceneName() == junisSceneName){
                console.log("Trying to remove currently active scene not permitted.")
                return;
            }
            for (var i=0; i<scenes.length; i++){
                if(scenes.getSceneName()==junisSceneName){
                    scenes.splice(i,1);
                }
            }
        },
        getScenes: function(){
            return scenes;
        },
        startScene: function(junisScene){

        }

    };



});


var JunisScene = (function(){
    var objects = [];
    var sceneName = "";
    var worldSize={};
    var viewportSize={};

    return {

      setSceneName: function(name){
            sceneName=name;
      },
      getSceneName: function(){
            return sceneName;
      },
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
      addObject: function(object){

      },
      removeObject: function(object){

      },
      getObjects: function(){
          return objects;
      }



    };


});



window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();
