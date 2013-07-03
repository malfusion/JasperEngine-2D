/*
    ERROR: init missing from object. workaround temp init function. Need to find out how to extend.

*/



Jasper.PolygonDrawBehavior = function(){
    this._points = [];
    this._numPoints = 0;

    this.strokeColor = 'black';
    this.strokeWidth = 5;
    this.fillColor = 'black';


    this.fill = true;
    this.stroke = true;

};

Jasper.PolygonDrawBehavior.prototype = new Jasper.RenderableBehavior();

Object.extend(Jasper.PolygonDrawBehavior.prototype, {
        
        update: function(dt){},

        render:function(ctx){
            parent = this.getParentObject();
            pos = parent.getViewportPos();
            ctx.beginPath();
            ctx.moveTo(pos[0], pos[1]);
            for (var i=0; i<this._numPoints; i++){
                ctx.lineTo(pos[0] + this._points[i][0], pos[1]+ this._points[i][1]);
            }
            ctx.closePath();

            
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


        // point is an array having [x,y]
        addPoint:function(point){
            parent = this.getParentObject();
            if(this._numPoints === 0){
                parent.posX = point[0];
                parent.posY = point[1];
                parent.width = 0;
                parent.height = 0;
            }
            else{
                if( point[0] < parent.posX )
                    parent.posX = point[0];
                if( point[1] < parent.posY )
                    parent.posY = point[1];
                if( point[0] > (parent.posX+parent.width) )
                    parent.width = point[0] - parent.posX;
                if( point[1] > (parent.posY+parent.height) )
                    parent.height = point[1] - parent.posY;
            }
            this._points.push(point);
            this._numPoints++;
            return this;
        },

        addPoints: function(points){
            var len = points.length;
            for(var i=0; i<len ; i++){
                this.addPoint(points[i]);
            }
        },

        clearPoints: function(){
            this._points.length = 0;
            this._numPoints = 0;
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