/*
    ERROR: init missing from object. workaround temp init function. Need to find out how to extend.

*/



Jasper.RectangleDrawBehavior = function(){
    this.strokeColor = 'black';
    this.strokeWidth = 5;
    this.fillColor = 'black';

    this.fill = true;
    this.stroke = true;

};

Jasper.RectangleDrawBehavior.prototype = new Jasper.RenderableBehavior();

Object.extend(Jasper.RectangleDrawBehavior.prototype, {
        _attr: function(args){
            if(args.width !== undefined)
                this.setWidth(args.width);
            if(args.height !== undefined)
                this.setHeight(args.height);
            if(args.strokeColor !== undefined)
                this.setStrokeColor(args.strokeColor);
            if(args.strokeWidth !== undefined)
                this.setStrokeWidth(args.strokeWidth);
            if(args.fillColor !== undefined)
                this.setFillColor(args.fillColor);
        },
       
        update: function(dt){},

        render:function(ctx){
            parent = this.getParentObject();
            pos = parent.getViewportPos();

            if(this.fill){
                ctx.fillStyle = this.fillColor;
                ctx.fillRect(pos[0], pos[1], parent.getWidth(), parent.getHeight());
            }
            if(this.stroke){
                ctx.lineWidth = this.strokeWidth;
                ctx.strokeStyle = this.strokeColor;
                ctx.strokeRect(pos[0], pos[1], parent.getWidth(), parent.getHeight());
            }


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