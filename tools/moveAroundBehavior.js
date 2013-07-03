Jasper.moveAroundBehavior = function(){
this.dir =  getRandomDirection();
this.turn = true;
this.oldpos  = undefined;
}
; 
 
 Jasper.moveAroundBehavior.prototype = new Jasper.Behavior(); 
 
 Object.extend(Jasper.moveAroundBehavior.prototype, {
    init: function(){
        this.oldpos = this.getParentObject().getPos();
        this.getParentObject().addBehavior("collision").setOnCollide(function(other){
            this.getParentObject().getBehavior("moveAround").turn = true;
            old = this.getParentObject().getBehavior("moveAround").oldpos
            this.getParentObject().setPos(old[0],old[1]);
        });
    },
    update: function(){
        parent = this.getParentObject();
        y=0;x=0;

        if(this.turn){
            //console.log(this);
            this.dir = getRandomDirection();
            parent.getBehavior("spritesheet").runAction(this.dir);
        
            this.turn = false;
        }

        if(this.dir == "up"){
            y-=1;
        }
        else if(this.dir == "down"){
            y+=1;
        }
        else if(this.dir == "left"){
            x-=1;
        }
        else if(this.dir == "right"){
            x+=1;
        }
        if(parent.getPosX()+x > 0 && parent.getPosX()+parent.getWidth()+x< parent.getLayer().getWorldSize()[0] 
            && parent.getPosY()+y > 0 && parent.getPosY()+parent.getHeight()+y< parent.getLayer().getWorldSize()[1]){
            this.oldpos = parent.getPos();
            parent.setPos(parent.getPosX()+x, parent.getPosY()+y)
        }
        else{
            this.turn = true;
        }

    },
    setRandomDir: function(){
        this.turn = true;
    }
});