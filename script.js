window.onload = function (){

    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var contex;
    var delay = 100;
    var snakee;

    init();

    function init(){
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "1px solid";
        document.body.appendChild(canvas);
        contex = canvas.getContext('2d');
        snakee = new Snake( [[6,3],[5,3],[4,3]] )
        refreshCanvas();
    
    }

    function refreshCanvas(){
        
        contex.clearRect(0,0, canvasWidth, canvasHeight)
        snakee.advance();
        snakee.draw();
        setTimeout(refreshCanvas, delay);
    }
   
    function drawBlock(contex, position)
    {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        contex.fillRect(x,y,blockSize,blockSize)
    }

    function Snake(body)
    {
        this.body = body;
        this.draw = function()
        {
            contex.save();
            contex.fillStyle = "red";
           for(var i =0 ; i < this.body.length; i++)
           {
            drawBlock(contex, this.body[i])
           }
           contex.restore(); 
        };
        this.advance = function()
        {
            var nextPosition = this.body[0].slice();
            nextPosition[0] += 1;
            this.body.unshift(nextPosition);
            this.body.pop();
        }
    }
}