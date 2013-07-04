Jasper.RandomMoveBehavior = function(){
    this.finalx = Math.floor((Math.random()*500)+1);
    this.finaly = Math.floor((Math.random()*500)+1);
    this.initx = 0;
    this.inity = 0;
    this.elapsed=0;
} ;

Jasper.RandomMoveBehavior.prototype = new Jasper.Behavior();

Object.extend(Jasper.RandomMoveBehavior.prototype , {
        update: function(dt){
            parent = this.getParentObject();
            this.elapsed+=dt;
            if(this.elapsed<20000){
                parent.setPosX(Math.floor((this.finalx-this.initx)/20000.0*this.elapsed));
                parent.setPosY(Math.floor((this.finaly-this.inity)/20000.0*this.elapsed));
            }
        }
        
});