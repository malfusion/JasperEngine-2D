/*
    ERROR: init missing from object. workaround temp init function. Need to find out how to extend.

*/



Jasper.CircleDrawBehavior = function(){
    this.rad = 0;
    this.strokeColor = 'black';
    this.strokeWidth = 5;
    this.fillColorR = 0;
    this.fillColorG = 0;
    this.fillColorB = 0;
    this.fillColorA = 1;

    this.fill = true;
    this.stroke = true;

};

Jasper.CircleDrawBehavior.prototype = new Jasper.Behavior();

Object.extend(Jasper.CircleDrawBehavior.prototype, {
    init:function(){

    },

        setRadius:function(radius){
            this.rad=radius;
            return this;
        },
        setFillColor: function(r,g,b,a){
            this.fillColorR=r;
            this.fillColorG=g;
            this.fillColorB=b;

            if(a != undefined){
                this.getParentObject().setAlpha(a);
                this.fillColorA=a;
            }
            return this;
        },
        setFillEnabled: function(boolean){
            this.fill=boolean;
            return this;
        },
        setStrokeEnabled: function(boolean){
            this.stroke=boolean;
            return this;
        },
        setStrokeWidth: function(width){
            this.strokeWidth=width;
            return this;
        },
        update: function(dt){

        },

        render:function(ctx){
            parent = this.getParentObject();
            ctx.beginPath();

            ctx.arc(Math.floor(parent.getPosX()), Math.floor(parent.getPosY()), this.rad, 0, 2 * Math.PI, true);
            if(this.fill){
                ctx.fillStyle = "rgba("+this.fillColorR+","+this.fillColorG+","+this.fillColorB+","+parent.getAlpha()+")";
                ctx.fill();
            }
            if(this.stroke){
                ctx.lineWidth = this.strokeWidth;
                ctx.strokeStyle = this.strokeColor;
                ctx.stroke();
            }


        }
});