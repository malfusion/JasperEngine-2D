Jasper.MouseBehavior = function(){};

Jasper.MouseBehavior.prototype = new Jasper.Behavior();



Object.extend(Jasper.MouseBehavior.prototype,{

        init: function(object){
            Jasper._behaviorManager._addNonUpdateBehavior('mouse');
            Jasper._mouseManager.registerCallbackObject(object);
        },
        onClick: function(){},
        onMove: function(){},
        onDown: function(){},
        onUp: function(){},
        onDblClick: function(){}

});