window.onload = function (){

    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var contex;
    var delay = 100;
    var snakee;
    var applee;
    var widthInBlocks = canvasWidth/blockSize;
    var heightInBlocks = canvasHeight/blockSize;
    var score;
    var timeout;
    init();

    function init(){
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "10px solid black";
        canvas.style.margin = "100px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#6b7dce"
        document.body.appendChild(canvas);
        contex = canvas.getContext('2d');
        snakee = new Snake( [[6,4],[5,4],[4,4],[3,4]],'right');
        applee = new Apple([10,10]);
        score = 0 ;
        refreshCanvas();
    
    }

    function refreshCanvas(){
        snakee.advance();
        if(snakee.checkCollision())
        {
            gameOver();
        }
         else 
        {
            if(snakee.isEatingApple(applee))
            {
                score++
                snakee.ateApple = true;
                do 
                {
                    applee.setNewPosition()
                } while (applee.isOnSnake(snakee))
               
            }
            contex.clearRect(0,0, canvasWidth, canvasHeight);
            drawScorce();
            snakee.draw();
            applee.draw();
            
           timeout = setTimeout(refreshCanvas, delay);  
        }
           
        
    }

    function gameOver()
    {
        contex.save();
        contex.font =" bold 70px Arial";
        contex.fillStyle ="black";
        contex.textAlign = "center";
        contex.textBaseline = "middle";
        contex.strokeStyle = "white";
        contex.lineWidht = 5;
        let centreY = canvasHeight /2;
        let centreX  = canvasWidth / 2;
        contex.strokeText("Game Over", centreX, centreY - 180);
        contex.fillText("Game Over", centreX, centreY - 180);
        contex.font = "bold 30px Arial";
        contex.strokeText("Appuyer sur la touche Espace pour pouvoir rejouer",centreX, centreY - 120);
        contex.fillText("Appuyer sur la touche Espace pour pouvoir rejouer",centreX, centreY -120);
        contex.restore();
       
    }

    function restart(){ 
        snakee = new Snake( [[6,4],[5,4],[4,4],[3,4 ]],'right');
        applee = new Apple([10,10]);
        score = 0 ;
        clearTimeout(timeout);
        refreshCanvas();
    }
    
    function drawScorce(){

        contex.save();
        contex.font = "160px Arial";
        contex.fillStyle ="#222";
        contex.textAlign = "center";
        contex.textBaseline = "middle";
        let centreY = canvasHeight /2;
        let centreX  = canvasWidth / 2;
        contex.fillText(score.toString(),centreX,centreY)
        
        contex.restore();
    }

    function drawBlock(contex, position){
            var x = position[0] * blockSize;
            var y = position[1] * blockSize;
            contex.fillRect(x,y,blockSize,blockSize)
        }

    function Snake(body, direction) {
            this.body = body;
            this.direction = direction;
            this.ateApple = false;
            this.draw = function()
            {
                contex.save();
                contex.fillStyle = "red";
            for(var i = 0 ; i < this.body.length; i++)
            {
                drawBlock(contex, this.body[i])
            }
            contex.restore(); 
            };
        this.advance = function(){
            var nextPosition = this.body[0].slice();
            switch(this.direction)
            {
                case "left":
                    nextPosition[0]--
                    break;
                case "right":
                    nextPosition[0]++
                    break;
                case "down":
                    nextPosition[1]++
                    break;
                case "up":
                    nextPosition[1]--
                    break;
                    default:
                        throw("Direction Invalide");
            }
            this.body.unshift(nextPosition);
            if(!this.ateApple)
                this.body.pop();
            else
                this.ateApple = false
        };
        this.setDirection = function(newDirection){
            var allowedDirections;
            switch(this.direction)
            {
                case "left":
                case "right":
                    allowedDirections = ["up", "down"];
                    break;
                case "up":
                case "down":
                    allowedDirections = ["left", "right"];
                    break;
                default:
                    throw("Direction Invalide");
            }
            if(allowedDirections.indexOf(newDirection) > -1)
            {
                this.direction = newDirection;
            }
        };
        this.checkCollision = function(){
                var wallCollision = false; // vérifie si le serpent touche les murs 
                var snakeCollision = false; // vérifie si le serpent touche sont propre corp
                var head =  this.body[0];
                var reste = this.body.slice(1);
                var snakeX = head[0];
                var snakeY = head[1];
                var minX = 0;
                var minY = 0;
                var maxX = widthInBlocks - 1; // maximum de la taille du canva
                var maxY = heightInBlocks - 1;
                var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX; // la tête du serpent n'est pas entre les murs horizontaux
                var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

                if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
                {
                    wallCollision = true;
                }

                for(var i = 0 ; i < reste.length; i++)
                {
                    if(snakeX === reste[i][0] && snakeY === reste[i][1] ) {
                        snakeCollision = True 
                    }
                }

            return wallCollision || snakeCollision;

        };
        this.isEatingApple = function(appleToEat)
        {
            var head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1] )
            {
                return true;
            } else { return false }
        }
    }


    function  Apple(position)
    {
        this.position = position;
        this.draw = function()
        {
            contex.save();
            contex.fillStyle= "#33cc33"
            contex.beginPath();
            var radius = blockSize/2;
            var x = this.position[0]*blockSize + radius;
            var y = this.position[1]*blockSize + radius;
            contex.arc(x, y, radius, 0, Math.PI*2, true); // dessine un cercle
            contex.fill(); // rempli le cercle
            contex.restore();
        };
        this.setNewPosition = function()
        {
            var newX = Math.round(Math.random() * (widthInBlocks - 1) );
            var newY = Math.round(Math.random() * (heightInBlocks - 1) );
            this.position = [newX, newY]
        };

        this.isOnSnake = function (snakeToCheck) 
        { 
            var isOnSnake = false;
            
            for(var i = 0 ; i < snakeToCheck.body.length;i++)
            {
               if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][0])
               {
                isOnSnake = true;
               }
            }
            return isOnSnake;
        }
    }

document.onkeydown = function handleKeyDown(e)
{
    var key = e.keyCode;
    var newDirection;
    switch(key)
    {
        case 37:
            newDirection = "left";
            break;
        case 38:
            newDirection = "up";
            break;
        case 39:
            newDirection = "right";
            break;
        case 40:
            newDirection = "down";
            break;
        case 32:
            restart();
            return
            default:
                return
    }

    snakee.setDirection(newDirection);
}

}