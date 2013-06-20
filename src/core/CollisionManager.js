/*

TODO: dont know how to change addbehavior and createbheavior yet
*/


Jasper.CollisionManager = function () {
    this._layerNumber_Objects={};
    this._layerNum_QuadTree = {};

    this._waitingList=[];



};


Jasper.CollisionManager.prototype = {
    _registerCollidableObject: function(obj){

        try{
        if(obj.getLayer() === undefined){
            this._waitingList.push(obj);
            return;
        }
        }
        catch(c){
            console.log(obj);
        }
        if(this._layerNum_QuadTree[obj.getLayer().getLayerNumber()] === undefined){

            var bounds = {
            x:0,
            y:0,
            width:obj.getLayer().getWorldSize().x,
            height:obj.getLayer().getWorldSize().y
            };
            this._layerNum_QuadTree[obj.getLayer().getLayerNumber()] = new QuadTree(bounds);
        }

        if(this._layerNumber_Objects[obj.getLayer().getLayerNumber()] === undefined){
            this._layerNumber_Objects[obj.getLayer().getLayerNumber()] = [];
        }

        if(this._hasAlreadyRegistered(obj) === false){
            this._layerNumber_Objects[obj.getLayer().getLayerNumber()].push(obj);
        }

    },

    _clearWaiting: function(obj){
        
        len=this._waitingList.length;

        for(var i=0;i<len;i++){
            if(obj === this._waitingList[i]){
                this._registerCollidableObject(obj);
                this._waitingList.splice(i,1);
                break;    
            }
            
        }
    },

    _hasAlreadyRegistered: function(obj){

        objs = this._layerNumber_Objects[obj.getLayer().getLayerNumber()];
        len=objs.length;
        registered=false;

        for(var i=0;i<len;i++){
            if(obj == objs[i])
                registered = true;
        }
        return registered;
    },


    calculateCollisions: function(){

        for(var layerNum in this._layerNum_QuadTree){
            
            var bounds = {
            x:0,
            y:0,
            width:1000,
            height:1000
            };
            tree = this._layerNum_QuadTree[layerNum] = new QuadTree(bounds);

            var len = this._layerNumber_Objects[layerNum].length;
            console.log("layer"+layerNum+" objsinsert:"+len);
            for(var i=0; i<len; i++){
                var obj = this._layerNumber_Objects[layerNum][i];
                tree.insert({
                    x:obj.posX,//obj. worldX,
                    y:obj.posY,//obj.worldY,
                    height: obj.height,
                    width: obj.width,
                    obj: obj
                });
            }

            this._activateCollisionsInLayer(layerNum);
        }
    },

    _activateCollisionsInLayer: function(layerNum){
        var len = this._layerNumber_Objects[layerNum].length;
        var tree = this._layerNum_QuadTree[layerNum];
            for(var i=0; i<len; i++){

                var obj = this._layerNumber_Objects[layerNum][i];
                var collidedObjs = tree.retrieve({
                    x:obj.posX,//obj. worldX,
                    y:obj.posY,//obj.worldY,
                    height:obj.height,
                    width:obj.width
                });
                var colLen = collidedObjs.length;
                //console.log(collidedObjs);
                console.log("insame layer"+ colLen +" choildren count "+tree.root.children.length);

                for(var j=0; j<colLen; j++){
                    //Collision check : basic rectangle without rotation
                    if  (obj.x < (collidedObjs[j].obj.x + collidedObjs[j].obj.width) && 
                        (obj.x+obj.width) > collidedObjs[j].obj.X1 && 
                        obj.y < (collidedObjs[j].obj.y + collidedObjs[j].obj.height) && 
                        (obj.y+obj.height) > collidedObjs[j].obj.y){

                            obj.getBehavior("collision").onCollide(collidedObjs[j].obj);
                    }
                }
                
            }
    }



    


    

};