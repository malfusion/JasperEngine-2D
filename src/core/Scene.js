Jasper.Scene = function(args){

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
