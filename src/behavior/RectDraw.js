/*
    ERROR: init missing from object. workaround temp init function. Need to find out how to extend.

*/



Jasper.RectangleDrawBehavior = function(){
    this.width = 0;
    this.height = 0;
    this.strokeColor = 'black';
    this.strokeWidth = 5;
    this.fillColorR = 0;
    this.fillColorG = 0;
    this.fillColorB = 0;
    this.fillColorA = 1;

    this.fill = true;
    this.stroke = true;

};

Jasper.RectangleDrawBehavior.prototype = new Jasper.RendererBehavior();

Object.extend(Jasper.RectangleDrawBehavior.prototype, {
        init:function(){

        },
        update: function(dt){},

        render:function(ctx){
            parent = this.getParentObject();

            if(this.fill){
                ctx.fillStyle = "rgba("+this.fillColorR+","+this.fillColorG+","+this.fillColorB+","+parent.getAlpha()+")";
                ctx.fillRect(parent.posX, parent.posY, this.width, this.height);
            }
            if(this.stroke){
                ctx.lineWidth = this.strokeWidth;
                ctx.strokeStyle = this.strokeColor;
                ctx.strokeRect(parent.posX, parent.posY, this.width, this.height);
            }


        },

        setWidth: function(width){
            this.width=width;
            return this;
        },
        setHeight: function(height){
            this.height=height;
            return this;
        },
        setFillColor: function(r,g,b,a){
            this.fillColorR=r;
            this.fillColorG=g;
            this.fillColorB=b;

            if(a !== undefined){
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
        }
        
});