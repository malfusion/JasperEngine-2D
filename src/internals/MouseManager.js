
Jasper.Mouse = function(){

    /*var clickX=0;
    var clickY=0;
    var downX=0;
    var downY=0;
    var upX=0;
    var upY=0;
    var dblclickX=0;
    var dblclickY=0;
                     */
    this._events = [];
    this._onClickObjects = [];
    this._onMoveObjects = [];
    this._onDownObjects = [];
    this._onUpObjects = [];
    this._onDblClickObjects = [];


    this._callbackObjects = [];
    this._mousePos = [];
};

Jasper.Mouse.prototype={

        _existsCallbackObject: function(object){
            var len = this._callbackObjects.length;
            for (var i=0; i<len; i++){
                if(object == this._callbackObjects[i])
                    return i;
            }
            return -1;
        },

        

           

        getMousePos: function(){
            return this._mousePos;
        },
        setMousePos: function(x,y){
            this._mousePos=[x,y];
        },

        mouseMove: function(e){
            this.setMousePos(/*(e.layerX || e.offsetX),(e.layerY || e.offsetY)*/e.offsetX,e.offsetY);
            this._events.push(['onMove',/*(e.layerX || e.offsetX),(e.layerY || e.offsetY)*/e.offsetX,e.offsetY]);

        },
        mouseClick:function(e){
            console.log("inside mouseClick");
            this._events.push(['onClick',/*(e.layerX || e.offsetX),(e.layerY || e.offsetY)*/e.offsetX,e.offsetY]);
        },
        mouseDblClick: function(e){
            console.log("inside mouseDblClick");
            this._events.push(['onDblClick',/*(e.layerX || e.offsetX),(e.layerY || e.offsetY)*/e.offsetX,e.offsetY]);
        },
        mouseUp: function(e){
            console.log("inside mouseUp");
            this._events.push(['onUp',/*(e.layerX || e.offsetX),(e.layerY || e.offsetY)*/e.offsetX,e.offsetY]);
        },
        mouseDown: function(e){
            console.log("inside mouseDown");
            this._events.push(['onDown',/*(e.layerX || e.offsetX),(e.layerY || e.offsetY)*/e.offsetX,e.offsetY]);
        },



        registerOnClickObject: function(obj){
            if(obj instanceof Jasper.Object)
                this._onClickObjects.push(obj);

        },
        registerOnMoveObject: function(obj){
            if(obj instanceof Jasper.Object)
                this._onMoveObjects.push(obj);
        },
        registerOnDownObject: function(obj){
            if(obj instanceof Jasper.Object)
                this._onDownObjects.push(obj);
        },
        registerOnUpObject: function(obj){
            if(obj instanceof Jasper.Object)
                this._onUpObjects.push(obj);
        },
        registerOnDblClickObject: function(obj){
            if(obj instanceof Jasper.Object)
                this._onDblClickObjects.push(obj);
        },
        unregisterOnClickObject: function(obj){
            if(obj instanceof Jasper.Object){
                var len = this._onClickObjects.length;
                for(var i=0; i<len; i++){
                    if(this._onClickObjects[i]==object){
                        this._onClickObjects.splice(i,1);
                        break;
                    }
                }
            }
        },
        unregisterOnMoveObject: function(obj){
            if(obj instanceof Jasper.Object){
                var len = this._onMoveObjects.length;
                for(var i=0; i<len; i++){
                    if(this._onClickObjects[i]==object){
                        this._onMoveObjects.splice(i,1);
                        break;
                    }
                }
            }
        },
        unregisterOnDownObject: function(obj){
            if(obj instanceof Jasper.Object){
                var len = this._onDownObjects.length;
                for(var i=0; i<len; i++){
                    if(this._onClickObjects[i]==object){
                        this._onDownObjects.splice(i,1);
                        break;
                    }
                }
            }
        },
        unregisterOnUpObject: function(obj){
            if(obj instanceof Jasper.Object){
                var len = this._onUpObjects.length;
                for(var i=0; i<len; i++){
                    if(this._onClickObjects[i]==object){
                        this._onUpObjects.splice(i,1);
                        break;
                    }
                }
            }
        },
        unregisterOnDblClickObject: function(obj){
            if(obj instanceof Jasper.Object){
                var len = this._onDblClickObjects.length;
                for(var i=0; i<len; i++){
                    if(this._onClickObjects[i]==object){
                        this._onDblClickObjects.splice(i,1);
                        break;
                    }
                }
            }
        },



        registerCallbackObject: function(obj){
            if(this._existsCallbackObject(obj) == -1){
                this._callbackObjects.push(obj);
            }
        },
        removeCallbackObject: function(obj){
            var pos = this._existsCallbackObject(obj);
            if(pos != -1){
                this._callbackObjects.splice(pos,1);
            }
        },
        _activateCallbacks: function(){
            var len = 0;
            var evs = this._events.length;
            for(var i=0; i<evs; i++){
                var e = this._events[i][0];
                var x = this._events[i][1];
                var y = this._events[i][2];

                var objs = this["_"+e+"Objects"];
                len = objs.length;
                console.log("Processed: "+len+ "_"+e+"Objects");
                for(var j=0; j<len; j++){

                    //this._callbackObjects[j].getBehavior("mouse")[e](x,y); 
                    objs[j].getBehavior("mouse")[e](x,y);                 //Calls onMove(x,y), onClick(x,y), etc, ...
                }
                
                
                
            }
            //Clear the this._events array
            this._events.length=0;
        }



        
};



