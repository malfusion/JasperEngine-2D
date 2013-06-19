Jasper.MouseBehavior = function(){

};

Jasper.MouseBehavior.prototype = new Jasper.Behavior();



Object.extend(Jasper.MouseBehavior.prototype,{

        init: function(object){
            Jasper._behaviorManager._addNonUpdateBehavior('mouse');
            //Jasper._mouseManager.registerCallbackObject(object);
        },
        onClick: function(){},
        onMove: function(){},
        onDown: function(){},
        onUp: function(){},
        onDblClick: function(){},

        setOnClick: function(clickFun){
			this.onClick = clickFun;
			Jasper._mouseManager.registerOnClickObject(this.getParentObject());
			return this;
        },
        setOnMove: function(clickFun){
			this.onMove = clickFun;
			Jasper._mouseManager.registerOnMoveObject(this.getParentObject());
			return this;
        },
        setOnDown: function(clickFun){
			this.onDown = clickFun;
			Jasper._mouseManager.registerOnDownObject(this.getParentObject());
			return this;
        },
        setOnUp: function(clickFun){
			this.onUp = clickFun;
			Jasper._mouseManager.registerOnUpObject(this.getParentObject());
			return this;
        },
        setOnDblClick: function(clickFun){
			this.onDblClick = clickFun;
			Jasper._mouseManager.registerOnDblClickObject(this.getParentObject());
			return this;
        },

        removeOnClick: function(){
			delete this.onClick;
			Jasper._mouseManager.unregisterOnClickObject(this.getParentObject());
        },
        removeOnMove: function(){
			delete this.onMove;
			Jasper._mouseManager.unregisterOnMoveObject(this.getParentObject());
        },
        removeOnDown: function(){
			delete this.onDown;
			Jasper._mouseManager.unregisterOnDownObject(this.getParentObject());
        },
        removeOnUp: function(){
			delete this.onUp;
			Jasper._mouseManager.unregisterOnUpObject(this.getParentObject());
        },
        removeOnDblClick: function(){
			delete this.onDblClick;
			Jasper._mouseManager.unregisterOnDblClickObject(this.getParentObject());
        },


});