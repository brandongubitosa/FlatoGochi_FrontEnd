function speedGame(imgSRC){

    const row = document.querySelector(".row")
    row.innerHTML = '<canvas id ="myCanvas" width="800" height="600"></canvas>'
    const canvas = document.getElementById("myCanvas")
    canvas.style = "border: solid thick black"
    const ctx = canvas.getContext("2d");
    
    //pipeWidth determine the width of the pipe
    let pipeWidth = 100,
    //height goes from tells the pipe height rom top to bottom
    pipeHeight = 200,
    //x determines where the pipe is initially  drawn, from start to finish
    x = canvas.width,
    //y determines the starting position of the pipe from top to bottom
    y = 0,
    dx = -5,
    health = 100,

    spriteWidth = 125,
    spriteHeight = 125,
    birdX = 0 + spriteWidth,
    birdY = canvas.height/2
    let upPressed = false;
    let downPressed = false;
    let img =  document.createElement("img"),
    background = document.createElement("img"),
    pipe = document.createElement("img");
    img.src = imgSRC
    background.src = "https://i.ytimg.com/vi/jJQ5DWSGRw4/maxresdefault.jpg"
    pipe.src = "https://cdnb.artstation.com/p/assets/images/images/011/210/507/large/kim-shein-wall-sprite.jpg?1528384411"
    


    const gameStart = setInterval(draw,10)
    // setTimeout(gameOver,5000)

    document.addEventListener("keydown", keyDownHandler)
    document.addEventListener("keyup", keyUpHandler)





    function keyDownHandler(button){
        if (button.key === "ArrowUp"){
            upPressed = true;
        } else 
        if(button.key === "ArrowDown"){
            downPressed = true;
        }
        
    }

    function keyUpHandler(button){
        if (button.key === "ArrowUp"){
            upPressed = false;
        } else 
        if(button.key === "ArrowDown"){
            downPressed = false;
        }
        
    }












function drawPipe(){
    

    ctx.beginPath();
   let pipe1 = ctx.rect(x, 0, pipeWidth, pipeHeight-y);
   ctx.drawImage(pipe,x, 0, pipeWidth, pipeHeight-y);
  
    ctx.closePath()
    let pipe2 =ctx.beginPath();
    ctx.drawImage(pipe,x, canvas.height-y-pipeHeight, pipeWidth, canvas.height-y);
    ctx.closePath()
  
    
}


function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(background,0,0,window.innerWidth,window.innerHeight)
 //this is the variable we are using for the rate of change on x and y axis
    let dy = -6;
    drawPipe();
    drawBird();
    drawScore();
    if (birdY < canvas.height-spriteHeight){ birdY += 1} 


    if ((birdY >= 0 && birdY <= pipeHeight-y && birdX === x) || (( birdY >= canvas.height-y-pipeHeight-spriteHeight) && birdY <= canvas.height-spriteHeight && birdX === x)){
        health -=50
    } else  if  (birdX === x)
    { health += 50
    console.log(birdY,canvas.height-spriteHeight)}
   




    if (x+dx > canvas.width-pipeWidth || x+dx < 0){
        x = canvas.width-pipeWidth
        // dx =  -Math.floor((Math.random() * 4) + 3)
        y= Math.floor((Math.random() * 300) - 150)
        
    
    }
    

    x += dx
  
    if(upPressed){
        birdY += dy
        if (birdY <0){
            birdY = 0} 
    } else 
    if (downPressed){
        birdY -= dy
        if( birdY  > canvas.height-spriteHeight)
            {
                birdY = canvas.height -spriteHeight
            }
    }



    //collision test
}

function drawBird() {


    ctx.beginPath();
    ctx.drawImage(img,birdX,birdY,spriteWidth,spriteHeight);
    ctx.closePath();
}

function drawScore() {
    ctx.font = "20px Arial bold";
    ctx.fillStyle = "white";
    ctx.fillText("Health:" + health, canvas.width-125, 20);
}


function gameOver(){
 clearInterval(gameStart)
 console.log("game over. final score is", health)
}

//end of function
}








