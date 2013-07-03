/**
 * A Scene Object is used to seperate the game into different components. At a time only one scene can be run by the engine. However, every Scene consists 
 * of a set of Jasper.Layer objects that are rendered one after another during every frame in the order in which they are added to the Scene.
 *
 *
 * @class Jasper.Scene
 * @constructor
 * @param {Object} args The object with the following options
 * @param {String} args.name The name of the scene, for easy retrieval later on
 * @param {Number} args.worldW The maximum width of the world in the current scene, can exceed canvas' width
 * @param {Number} args.worldH The maximum height of the world in the current scene, can exceed canvas' height.
 * 
 * @example
 *     var gameScene = new Jaser.Scene({
 *     name:"mainscene",
 *     worldW: 1000,
 *     worldH: 1500});
 *
 *     gameCore.addScene(gameScene).startScene(gameScene);
 *     
 */

Jasper.Scene = function(args){

    this.sceneName = args.name;

    this.worldW = args.worldW;
    this.worldH = args.worldH;

    this._camera = new Jasper.Camera({
        width: Jasper._core.canvasWidth,
        height: Jasper._core.canvasHeight,
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

        /**
         * Set the scene's name
         * @method setSceneName
         * @param  {String} name         The name to be set as the scene's name
         * @chainable
         */
        setSceneName: function(name){
            this.sceneName=name;
            return this;
        },

        /**
         * Get the scene's name
         * @method getSceneName
         * @return {String} The name of the scene
         */
        getSceneName: function(){
            return this.sceneName;
        },
        //                                Option to add layer number for comfort
        /**
         * Add a new Jasper.Layer to the LayerList
         * @method addLayer
         * @param  {Jasper.Layer} jasperLayer  A Jasper.Layer object that is to be added to the LayerList. The order in which layers are added has significance
         * @chainable
         */
        addLayer: function(jasperLayer){
            if(jasperLayer instanceof Jasper.Layer){
                
                jasperLayer.worldW=this.worldW;
                jasperLayer.worldH=this.worldH;
                
                this.layerList.push(jasperLayer);
                jasperLayer.scene = this;
                jasperLayer._layerNumber = this.numLayers;
                jasperLayer._setCamera(this._camera);
                this.numLayers++;


                this._onAddLayer(jasperLayer);
                jasperLayer._onAdd();

                return this;
            }
            else{
                throw Error("Cannot add object to scene. need Jasper.Layer");
            }
        },
        /**
         * Add a list of layers to the LayerList in the same order as in the argument
         * @method addLayers
         * @param  {Array<Jasper.Layer>} jasperLayers Array of Jasper.Layer objects to be added to the LayerList of the Scene.
         * @chainable
         */
        addLayers: function(jasperLayers){
            var len = jasperLayers.length;
            for(var i=0; i<len; i++){
                this.addLayer(jasperLayers[i]);
            }
            return this;
        },

        /**
         * Get the layer that is present at the given 'index' from the LayerList. Index starts at 0
         * @method getLayerWithIndex
         * @param  {Number}     index       The index of the layer in the LayerList. Value of index starts from 0, ie, [0,1,2,3,...]
         * @return {Jasper.Layer}           The Jasper.Layer object at the given index
         */
        getLayerWithNumber: function(num){
            len = this.layerList.length;
            for(var i=0;i<len;i++){
                if(this.layerList[i].getLayerNumber() == num){
                    return this.layerList[i];
                }
            }
            return null;
        },

        /**
         * Get the list of Jasper.Layer objects in the LayerList of this scene.
         * @method getLayers
         * @return {Array<Jasper.Layer>} The list of layers in the LayerList of the Scene
         */
        getLayers: function(){
            return this.layerList;
        }

};
