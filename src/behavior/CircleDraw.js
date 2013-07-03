/*
    ERROR: init missing from object. workaround temp init function. Need to find out how to extend.

*/



Jasper.CircleDrawBehavior = function(){
    this.radius = 0;
    this.strokeColor = 'black';
    this.strokeWidth = 5;
    this.fillColor = 'black';

    this.fill = true;
    this.stroke = true;

};

Jasper.CircleDrawBehavior.prototype = new Jasper.RenderableBehavior();

Object.extend(Jasper.CircleDrawBehavior.prototype, {
        _attr: function(args){
            if(args.radius !== undefined)
                this.setRadius(args.radius);
            if(args.strokeColor !== undefined)
                this.setStrokeColor(args.strokeColor);
            if(args.strokeWidth !== undefined)
                this.setStrokeWidth(args.strokeWidth);
            if(args.fillColor !== undefined)
                this.setFillColor(args.fillColor);
            return this;
        },

        update: function(dt){},

        render:function(ctx){
            parent = this.getParentObject();
            pos = parent.getViewportPos();
            ctx.beginPath();

            ctx.arc(Math.floor(pos[0]), Math.floor(pos[1]), this.radius, 0, 2 * Math.PI, true);
            if(this.fill){
                ctx.fillStyle = this.fillColor;
                ctx.fill();
            }
            if(this.stroke){
                ctx.lineWidth = this.strokeWidth;
                ctx.strokeStyle = this.strokeColor;
                ctx.stroke();
            }


        },


        setRadius:function(radius){
            this.radius=radius;
            return this;
        },
        getRadius: function(){
            return this.radius;
        },

        setFillColor: function(r,g,b,a){

            if(typeof(r) == 'string' && g === undefined && b === undefined){
                this.fillColor = r;
            }
            else if(typeof(r) !== undefined && g !== undefined && b !== undefined){
                this.fillColor="rgb("+r+","+g+","+b+")";
            }
            else if(typeof(r) !== undefined && g !== undefined && b !== undefined){
                this.fillColor="rgb("+r+","+g+","+b+")";
            }
            return this;
        },
        setStrokeColor: function(r,g,b,a){

            if(typeof(r) == 'string' && g === undefined && b === undefined){
                this.strokeColor = r;
            }
            else if(typeof(r) !== undefined && g !== undefined && b !== undefined){
                this.strokeColor="rgb("+r+","+g+","+b+")";
            }
            else if(typeof(r) !== undefined && g !== undefined && b !== undefined){
                this.strokeColor="rgb("+r+","+g+","+b+")";
            }
            return this;
        },
        getFillColor: function(){
            return this.fillColor;
        },
        getStrokeColor: function(){
            return this.strokeColor;
        },
        setStrokeWidth: function(width){
            this.strokeWidth=width;
            return this;
        },
        getStrokeWidth: function(){
            return this.getStrokeWidth;
        },
        setFillEnabled: function(boolean){
            this.fill=boolean;
            return this;
        },
        setStrokeEnabled: function(boolean){
            this.stroke=boolean;
            return this;
        }
        
});