/*
    ERROR: init missing from object. workaround temp init function. Need to find out how to extend.

*/



Jasper.RectangleDrawBehavior = function(){
    this.width = 0;
    this.height = 0;
    this.strokeColor = 'black';
    this.strokeWidth = 5;
    this.fillColor = 'black';

    this.fill = true;
    this.stroke = true;

};

Jasper.RectangleDrawBehavior.prototype = new Jasper.RenderableBehavior();

Object.extend(Jasper.RectangleDrawBehavior.prototype, {
        init:function(){

        },
        update: function(dt){},

        render:function(ctx){
            parent = this.getParentObject();

            if(this.fill){
                ctx.fillStyle = this.fillColor;
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

            if(typeof(r) == 'string' && g === undefined && b === undefined && a === undefined){
                this.fillColor = r;
            }
            else if(typeof(r) !== undefined && g !== undefined && b !== undefined && a === undefined){
                this.fillColor="rgba("+r+","+g+","+b+","+this.getParentObject().getAlpha()+")";
            }
            else if(typeof(r) !== undefined && g !== undefined && b !== undefined && a !== undefined){
                this.getParentObject().setAlpha(a);
                this.fillColor="rgba("+r+","+g+","+b+","+a+")";
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