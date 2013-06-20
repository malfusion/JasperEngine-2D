Jasper.CollisionBehavior = function(){
    this._collided = false;
};

Jasper.CollisionBehavior.prototype = new Jasper.Behavior();



Object.extend(Jasper.CollisionBehavior.prototype,{

        init: function(object){
            Jasper._behaviorManager._addNonUpdateBehavior('collision');
            Jasper._collisionManager._registerCollidableObject(this.getParentObject());
            //Jasper._mouseManager.registerCallbackObject(object);
        },

        setOnCollide: function(collideFunc){
            this.onCollide = collideFunc;
        },

        onCollide: function(collidedObj){}

        


});