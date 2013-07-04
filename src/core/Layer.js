/*
*TODO:  remove objects
*/

/**
 * A Layer Object is used to hold any number of Jasper.Object objects which are the next level of heirarchy. A Layer can hold any number of Jasper.Object objects
 * within it, that are rendered one after another during every frame in the order in which they are added to the Layer.
 *
 * The Layer can be set into two modes:
 * Normal mode (World mode)
 * HUD mode 
 *
 * Normal mode is set when the user does not provide a 'hud' property in the arguments to the constructor. or if it set to false,
 * HUD mode is set when the user provides 'hud' property as true in the arguments to the constructor.
 *
 *
 * @class Jasper.Layer
 * @constructor
 * @param {Object} args The object with the following options
 * @param {String} args.name The name of the layer, for easy retrieval later on
 * @param {Boolean} args.hud Whether HUD mode (true) or World mode (false)
 * 
 * 
 * @example
 *     var bgLayer = new Jaser.Scene({
 *     name:"bg",
 *     hud:false });
 *
 *     var statsLayer = new Jaser.Scene({
 *     name:"stats",
 *     hud:true });
 *
 *     gameScene.addLayers([bgLayer, statsLayer]);
 *     
 */


Jasper.Layer = function(args){
    this._name=args.name;

    this._hud = false;
    this._camera  = undefined;
    if(args.hud !== undefined){
        this._hud = args.hud;
    }
    
    this._scene = undefined;
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

        /**
         * Get the worldWidth and worldHeight of the scene, which this layer is part of.
         * @method getWorldSize
         * @return {[Number, Number]} An array with the width and the height of the world
         */
        getWorldSize: function(){
            return [this.worldW, this.worldH];
        },

        /**
         * Add a new Jasper.Object to the ObjectList
         * @method addObject
         * @param  {Jasper.Object} jasperObject  A Jasper.Objct object that is to be added to the ObjectList. The order in which objects are added has significance.
         * @chainable
         */
        addObject: function(jasperObject){
            if(jasperObject instanceof Jasper.Object){
                if(jasperObject.getLayer() !== undefined){
                    jasperObject.getLayer().removeObject(jasperObject);
                }

                jasperObject._setLayer(this);
                this.objects.push(jasperObject);
                this.numObjects++;

                this._onObjectAdd(jasperObject);
                if(this.getScene() !== undefined){
                    jasperObject._setCamera(this._camera);
                }
                jasperObject._clearCollisionManagerWaiting();
                jasperObject.onAdd();
                return this;
                
            } 
            else{
                throw Error("Cannot add object, needs JasperObject" );
            }

        },
        /**
         * Add a list of objects to the ObjectList in the same order as in the argument
         * @method addObjects
         * @param  {Array<Jasper.Object>} jasperObjects Array of Jasper.Object objects to be added to the ObjectList of the Layer.
         * @chainable
         */
        addObjects: function(jasperObjects){
            var len = jasperObjects.length;
            for(var i=0; i<len; i++){
                this.addObject(jasperObjects[i]);
            }
            return this;
        },

        /**
         * Remove the given Jasper.Object from the ObjectList of the layer
         * @method removeObject
         * @param  {Jasper.Object} jasperObject [description]
         * @return {[type]}              [description]
         */
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

        /**
         * Get the list of Jasper.Object from the ObjectList of this scene
         * @method getObjects
         * @return {Array<Jasper.Object>} The ObjectList of this scene
         */
        getObjects: function(){
            return this.objects;
        },

        /**
         * Get the scene which the layer is a part of.
         * @method getScene
         * @return {Jasper.Scene} The parent scene
         */
        getScene: function(){
            return this._scene;
        },

        /**
         * Get the index of the current layer in the parent Jasper.Scene's LayerList
         * @method getLayerNumber
         * @return {Number} The index of the layer in the parent scene's LayerList
         */
        getLayerNumber: function(){
            return this._layerNumber;
        },

        /**
         * Get the camera that is associated with the current layer
         * @method getCamera
         * @return {Jasper.Camera} The camera attached to the parent scene
         */
        getCamera: function(){
            return this._camera;
        },
        /**
         * Returns if this layer is in HUD mode
         * @method isHud
         * @return {Boolean} The mode of the layer is HUD mode (true) or Normal mode (false)
         */
        isHud: function(){
            return this._hud;
        },
        _setCamera: function(camera){
            this._camera = camera;
            objs = this.getObjects();
            var l=objs.length;
            for (var i=0; i<l;i++){
                objs[i]._setCamera(camera);
            }
        }

        
};
