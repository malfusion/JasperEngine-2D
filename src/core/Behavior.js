Jasper.Behavior = function(){
	this._parent = null;
	
}; 

Object.extend(Jasper.Behavior.prototype, {
	attr : function(args){ 
		this._attr(args); 
		return this;
	},
	locals: function(args){
		Object.extend(this, args); 
	},
	_attr : function(args){},

	update : function(){
		this.onUpdate();
	},

	getParentObject  :  function(){
        return this._parent;
	},
	_init: function(){ 
		this.onInit();
	},
    onInit : function(){},
    onUpdate : function(){},
    onRemove : function(){}
});



Jasper.Behavior._createBehavior = function(funsObj){
	var newBeh = function(){};
	newBeh.prototype = new Jasper.Behavior();

	Object.extend(newBeh.prototype, funsObj);
	
    return newBeh;


};

///	RENDERABLE BEHAVIOR EXTENDING BEHAVIOR ///

Jasper.RenderableBehavior = function(){

	
}; 

Jasper.RenderableBehavior.prototype = new Jasper.Behavior();

Object.extend(Jasper.RenderableBehavior.prototype, {
	renderBefore : function(ctx){
		ctx.save();
		parent = this.getParentObject();
		pos = parent.getViewportPos();
		ctx.translate( pos[0] , pos[1]  );
		ctx.rotate( parent.getRotationRadian() );
		ctx.translate( -pos[0] , -pos[1]  );
		ctx.globalAlpha = parent.getAlpha();
		
	},

	renderAfter : function(ctx){
		ctx.restore();
	},

	render : function(){},

    setWidth: function(width){
        this.getParentObject().setWidth(width);
        return this;
    },
    setHeight: function(height){
        this.getParentObject().setHeight(height);
        return this;
    },
    setPosX: function(x){
		this.getParentObject().setPosX(x);
		return this;
    },
    setPosY: function(y){
		this.getParentObject().setPosY(y);
		return this;
    },
    setPos: function(x,y){
		this.getParentObject().setPos(x,y);
		return this;
    }

});

Jasper.RenderableBehavior._createRenderBehavior = function(funsObj){
	var temp = new Jasper.RenderableBehavior();
	Object.extend(temp, funsObj);

	var newBeh = function(){};
	newBeh.prototype = temp;

	Object.extend(newBeh.prototype, funsObj);

    return newBeh;


};