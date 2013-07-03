/*
    ERROR: init missing from object. workaround temp init function. Need to find out how to extend.

*/



Jasper.TextDrawBehavior = function(){
    this.text = "";
    
    this.color = 'black';

    this.font = "Lucida Console";
    this.size = "18px";
    this.maxWidth = "";

    this._changed = true;

    

};

Jasper.TextDrawBehavior.prototype = new Jasper.RenderableBehavior();

Object.extend(Jasper.TextDrawBehavior.prototype, {
        _attr: function(args){
             if(args.text !== undefined)
                this.setText(args.text);
            if(args.color !== undefined)
                this.setFontColor(args.color);
            if(args.size !== undefined)
                this.setFontSize(args.size);
            if(args.maxWidth !== undefined)
                this.setMaxWidth(args.maxWidth);
            return this;
        },
       
        update: function(dt){},

        render:function(ctx){
            parent = this.getParentObject();
            pos = parent.getViewportPos();
            
            ctx.fillStyle = this.color;
            ctx.font = this.size + " " +this.font;
            ctx.textBaseline = 'top';
            ctx.fillText(this.text, pos[0], pos[1]);

            var metrics = ctx.measureText(this.text);
            if(this._changed === true){
                parent.setWidth(metrics.width);
                parent.setHeight(parseInt(this.size, 10));
                this._changed = false;
            }

        },


        // point is an array having [x,y]
        setText: function(text){
            this.text = text;
            this._changed = true;
            return this;
        },
        getText: function(){
            return this.text;
        },
        setFont: function(fontname){
            this.font = fontname;
            this._changed = true;
            return this;
        },
        getFont: function(){
            return this.font;
        },
        setFontSize: function(size){
            if(typeof(size) === "number"){
                this.size = size+"px";
            }
            else{
                this.size = size;
            }
            this._changed = true;
            return this;
        },
        getFontSize: function(){
            return this.size;
        },
        setMaxWidth: function(maxWidth){
            if(typeof(size) === "number"){
                this.maxWidth = maxWidth+"px";
            }
            else{
                this.maxWidth = maxWidth;
            }
            this._changed = true;
            return this;
        },
        getMaxWidth: function(){
            return this.maxWidth;
        },
        setFontColor: function(r,g,b){

            if(typeof(r) == 'string' && g === undefined && b === undefined ){
                this.fontColor = r;
            }
            else if(typeof(r) !== undefined && g !== undefined && b !== undefined){
                this.fontColor="rgb("+r+","+g+","+b+")";
            }
            else if(typeof(r) !== undefined && g !== undefined && b !== undefined ){
                this.fontColor="rgb("+r+","+g+","+b+")";
            }
            return this;
        }

        
});