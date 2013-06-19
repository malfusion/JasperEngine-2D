Jasper.Behavior = function(){
	this._parent = null;
	
}; 

Jasper.Behavior.prototype.init = function(){};
Jasper.Behavior.prototype.update=function(){};
Jasper.Behavior.prototype.getParentObject = function(){
                        return this._parent;
                    };


Jasper.Behavior._createBehavior = function(varsObj, funsObj){
	var temp = new Jasper.Behavior();
	Object.extend(temp, funsObj);

	var newBeh = function(){};
	newBeh.prototype = temp;

	Object.extend(newBeh.prototype, funsObj);
    return newBeh;


};

///	RENDERABLE BEHAVIOR EXTENDING BEHAVIOR ///

Jasper.RenderableBehavior = function(){

	
}; 

Jasper.RenderableBehavior.prototype = new Jasper.Behavior();

Jasper.RenderableBehavior.prototype.renderBefore = function(ctx){
	ctx.save();
};

Jasper.RenderableBehavior.prototype.renderAfter = function(ctx){
	ctx.restore();
};

Jasper.RenderableBehavior.prototype.render = function(){};


Jasper.RenderableBehavior._createRenderBehavior = function(varsObj, funsObj){
	var temp = new Jasper.RenderableBehavior();
	Object.extend(temp, funsObj);

	var newBeh = function(){};
	newBeh.prototype = temp;

	Object.extend(newBeh.prototype, funsObj);
    return newBeh;


};