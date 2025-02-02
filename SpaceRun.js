

//board
let board;
let boardWidth = 1200;
let boardHeight = 850;
let context;



//player
let playerWidth = 100; 
let playerHeight = 80; //keep ratio 8 to 10
let playerX = boardWidth/8;
let playerY = boardHeight/2;
let playerImg;
let playerXMoveStep = 0;


let player = {
    x : playerX + playerXMoveStep,
    y : playerY,
    width : playerWidth,
    height : playerHeight
}

//sabers
let saberArray = [];
let saberWidth = 50; //width/height ratio = 384/3072 = 1/8
let saberHeight = 450;
let saberX = boardWidth;
let saberY = 0;

//physics
let velocityX = -2; //sabers moving left speed
let velocityY = 0; //player default jump speed (not jumping/changing Y position)
let gravity = 0.010; //making sure that there is a Y axis force pulling the player down


let gameOver = false;
let score = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board


    //load images
    playerImg = new Image();
    playerImg.src = "./spaceship.png";
    playerImg.onload = function() {
        context.drawImage(playerImg, player.x, player.y, player.width, player.height);
    }

    topsaberImg = new Image();
    topsaberImg.src = "./topSaber.png";

    bottomsaberImg = new Image();
    bottomsaberImg.src = "./bottomSaber.png";

    

    requestAnimationFrame(update);
    setInterval(placesabers, 1500);
    document.addEventListener("keydown",movePlayer);
    document.addEventListener("keyup",stopPlayer);

}



//delta time multiplier
lastFrameTime = performance.now();
targetDeltaTime = 1000 / 60;

//updating the canvas frames (this is the main game loop)
function update() {
    requestAnimationFrame(update);
        //defining delta time 
    const currentTime = performance.now();
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;
    const deltaTimeMultiplier = deltaTime / targetDeltaTime;

    //applying for the player's movement
    const playerXMoveStepAdjusted = playerXMoveStep * deltaTimeMultiplier;
    player.x += playerXMoveStepAdjusted;
    
    

    //stop the game if there is a collision between the player and one of the sabers
    if(gameOver) {
        return;
    }
    //first i clear the canvas
    context.clearRect(0, 0, board.width, board.height);

    //player update
    velocityY += gravity;
    player.y = Math.max(player.y + velocityY, 0); //making sure the player dosent go up from the canvas top
    context.drawImage(playerImg, player.x, player.y, player.width, player.height);

    //stop the game if the player falls off screen
    if(player.y>board.height) {
        gameOver = true;
    }

    //sabers update 
    for (let i = 0; i < saberArray.length; i++) {
        let saber = saberArray[i];
        saber.x += velocityX;
        context.drawImage(saber.img,saber.x,saber.y,saber.width,saber.height)

//update the score if player passed sabers succusfully
if (!saber.passed && player.x>saber.x+saber.width){
score+=0.5; //because there are 2 sabers, and i want only 1 point each sucuessful passing
saber.passed = true;}

        if (detectCollision(player, saber)) {
            gameOver = true;
        }
    }
    
//clearing sabers 

while (saberArray.length>0 && saberArray[0].x<-saberWidth) {
saberArray.shift();
}

    //draw the score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score,5,45);

    if(gameOver)
        context.fillText("GAME OVER",5,90);
}





function placesabers() {

    //stop making sabers if there is a collision between the player and one of the sabers
    if(gameOver) {
        return;
    }

    let randomsaberY = saberY - saberHeight/4 - Math.random()*(saberHeight/2); //creating a varible that makes the sabers appear at random position across the screen, to make the game more interesting `
    //this number here will range between -100 and -300
   
    openingSpace = board.height/6; // a sufficiant space for the player to move through
   
    let topsaber = {
        img: topsaberImg,
        x: saberX,
        y: randomsaberY,
        width: saberWidth,
        height: saberHeight,
        passed: false
    }

    saberArray.push(topsaber) // creating topsaber objects and pushing them into the saberArray

    let bottomsaber = {  
        img: bottomsaberImg,
        x: saberX,
        y: boardHeight-saberHeight+randomsaberY + openingSpace*2, // i'm creating the bottom saber at such a position that will leave an "opening"  between it and the top saber, so that the player can move through
        width: saberWidth,
        height: saberHeight,
        passed: false

    }
    saberArray.push(bottomsaber); // creating bottomsaber objects and pushing them into the saberArray
}


function movePlayer(e) {
    
        if (e.code == `Space`) velocityY = -3;
        if (e.code == `KeyA`) playerXMoveStep = -10;
        if (e.code == `KeyD`) playerXMoveStep = 10;
        if (e.code == `KeyS`) velocityY = 3
        

       
        //i am reseting all the positions and values to their starting position

        if (gameOver) { 
         player.y = playerY; //reseting the position
         saberArray=[]; //clearing all the sabers
         score = 0; //deleting the points
         gameOver = false;   //raturning this to false so that the game can go on again 
        }    
    }

    function stopPlayer(e) {
    
        if (e.code == `Space`) velocityY = 0;;
        if (e.code == `KeyA`) playerXMoveStep = 0;
        if (e.code == `KeyD`) playerXMoveStep = 0;
    }




function detectCollision(a, b) {
    return a.x < b.x + b.width+30 &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x+30 &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height-30 &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height-50 > b.y-30;    //a's bottom left corner passes b's top left corner ; boxes were a bit large so i have shrunken it down
}






