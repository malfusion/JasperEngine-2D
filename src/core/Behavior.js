Jasper.Behavior = function(){

	
}; 

Jasper.Behavior.prototype.init = function(){};


Jasper.Behavior._createBehavior = function(varsObj, funsObj){
	var temp = new Jasper.Behavior();
	Object.extend(temp, funsObj);

	var newBeh = function(){};
	newBeh.prototype = temp;

	Object.extend(newBeh.prototype, funsObj);
    return newBeh;


};