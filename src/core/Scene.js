Jasper.Scene = function(sceneName){
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
                jasperLayer._layerNumber = this.numLayers;
                this.numLayers++;
            }
            else{
                console.log("Cannot add object to scene. need Jasper.Layer");
            }
        },
        getLayerWithNumber: function(num){
            len = this.layerList.length;
            for(var i=0;i<len;i++){
                if(layerList[i].getLayerNumber() == num){
                    return layerList[i];
                }
            }
            return null;
        }

};
