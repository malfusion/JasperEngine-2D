/*

TODO: dont know how to change addbehavior and createbheavior yet
*/


Jasper.CollisionManager = function () {
    this._layerNumber_Objects = {};
    this._layerNum_QuadTree = {};

    this._layerNumber_TreeObjects = {}; 
    this._waitingList=[];

    this.count=0;


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
            throw Error(c);
        }
        if(this._layerNum_QuadTree[obj.getLayer().getLayerNumber()] === undefined){

            args = {
               // mandatory fields
                x:0,
                y:0,
                w:500,//obj.getLayer().getWorldSize().x,
                h:500,//obj.getLayer().getWorldSize().y,       
            };

    
            this._layerNum_QuadTree[obj.getLayer().getLayerNumber()] = QUAD.init(args);
        }

        if(this._layerNumber_Objects[obj.getLayer().getLayerNumber()] === undefined){
            this._layerNumber_Objects[obj.getLayer().getLayerNumber()] = [];
            this._layerNumber_TreeObjects[obj.getLayer().getLayerNumber()] = [];
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
       //console.log("count:"+this.count);
        this.count=0;
        for(var layerNum in this._layerNum_QuadTree){

            tree = this._layerNum_QuadTree[layerNum];
            tree.clear();

            var len = this._layerNumber_Objects[layerNum].length;
            //console.log("layer"+layerNum+" objsinsert:"+len);
            for(var i=0; i<len; i++){
                var obj = this._layerNumber_Objects[layerNum][i];
                var treeobj = {
                    x:Math.floor(obj.posX),//obj. worldX,
                    y:Math.floor(obj.posY),//obj.worldY,
                    h: obj.height,
                    w: obj.width,
                    obj: obj
                };
                tree.insert(treeobj);
                this._layerNumber_TreeObjects[layerNum].push(treeobj);
            }

            this._activateCollisionsInLayer(layerNum);
        }
    },

    _activateCollisionsInLayer: function(layerNum){
        var len = this._layerNumber_Objects[layerNum].length;
        var tree = this._layerNum_QuadTree[layerNum];
            for(var i=0; i<len; i++){

                var obj = this._layerNumber_Objects[layerNum][i];

                var search = this._layerNumber_TreeObjects[layerNum][i];

                var collidedObjs = tree.retrieve(search, function(item){
                   // Jasper._collisionManager.count++;
                    //this.count++;
                    if(search != item){
                        if  (search.x < (item.x + item.w) && 
                            (search.x+search.w) > item.x && 
                            search.y < (item.y + item.h) && 
                            (search.y+search.h) > item.y){
                                //Jasper._collisionManager.count++;
                                search.obj.getBehavior("collision").onCollide(item.obj);
                                item.obj.getBehavior("collision").onCollide(search.obj);
                        }
                    }

                });
                
                /*var colLen = collidedObjs.length;
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
                }*/
                
            }
            this._layerNumber_TreeObjects[layerNum].length = 0;
    }



    


    

};