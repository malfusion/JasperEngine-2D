/*
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
