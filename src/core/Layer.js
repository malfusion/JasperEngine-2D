/*
*TODO: add object id calc in Jasper.Object
        remove objects


*/

Jasper.Layer = function(args){
    this._name=args.name;

    this._hud = false;
    this._camera  = undefined;
    if(args.hud !== undefined){
        this._hud = true;
    }
    
    this._scene = null;
    this._layerNumber = -1;

    this.worldW=0;
    this.worldH=0;

    this.objects = [];
    this.numObjects = 0;


    this.onAdd = function(){};
    this.onObjectAdd = function(obj){};
    this.onObjectRemove = function(obj){};
    this.onUpdate = function(){};
    this.onDestroy =function(){};
       
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
        _onAdd: function(){
            this.onAdd();
        },
        _onStart: function(){
            this.onStart();
        },
        _onDestroy: function(){
            this.onDestroy();
            var len=objects.length;
            for(var i=0; i<len; i++){
                objects[i]._onDestroy();
            }
            
        },
        _onObjectAdd: function(obj){
            this.onObjectAdd(obj);
        },
        _onObjectRemove: function(obj){
            this.onObjectRemove(obj);
        },

        getWorldSize: function(){
            return [this.worldW, this.worldH];
        },

        addObject: function(jasperObject){
            if(jasperObject instanceof Jasper.Object){
                jasperObject._layer = this;
                this.objects.push(jasperObject);
                this.numObjects++;

                this._onObjectAdd(jasperObject);
                jasperObject._onAddedToLayer();
                return this;
                
            } 
            else{
                throw Error("Cannot add object, needs JasperObject" );
            }

        },

        removeObject: function(jasperObject){
            if(jasperObject instanceof Jasper.Object){
                var indx = this.objects.indexOf(jasperObject);
                if(indx !== -1){
                    obj=this.objects.splice(indx,1);
                    this._onObjectRemove(obj);
                }
                return this;
            }
            else{
                throw Error("Cannot remove object, needs JasperObject" );
            }
        },
        getObjects: function(){
            return this.objects;
        },
        getScene: function(){
            return this._scene;
        },
        getLayerNumber: function(){
            return this._layerNumber;
        },
        getCamera: function(){
            return this._camera;
        },
        isHud: function(){
            return this._hud;
        }

        
};
