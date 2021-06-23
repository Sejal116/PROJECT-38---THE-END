var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  bgImage = loadImage("bg.png");
  trex_running =   loadAnimation("mario1.png");
  trex_collided = loadAnimation("mario_end.png");
  
  //groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("enemy1.png");
  obstacle2 = loadImage("enemy2.png");
  obstacle3 = loadImage("enemy3.png");
  obstacle4 = loadImage("enemy4.png");
  obstacle5 = loadImage("enemy5.png");
  obstacle6 = loadImage("enemy6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  
  bg = createSprite(windowWidth/2, windowHeight/2,windowWidth,windowHeight);
  bg.scale = 5;
  bg.addImage(bgImage);

  trex = createSprite(470,height-650 ,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 10;
  trex.debug = false;
  trex.setCollider("circle",0,0,5);
  
  ground = createSprite(width/2,height-650,windowWidth,20);
  ground.visible = false;
  ground.velocityX = -6;
  ground.x = ground.width/2;
  //ground.addAnimation("ground",groundImage);
  ground.scale = 3;
  bg.x = bg.width /2;
  bg.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(windowWidth/2,windowHeight-850/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(windowWidth/2,windowHeight-600/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 6;
  restart.scale = 3;

  gameOver.visible = false;
  restart.visible = false;

  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(0);
  drawSprites();

  textSize(70);
  fill("black");
  text("Score: "+ score, windowWidth-500,670);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -6;
    bg.velocityX = -(6+3*score/100);
    
  
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (bg.x < 0){
      bg.x = bg.width/2;
    }
  
    if(ground.x < 0){
      ground.x = ground.width/2;
    }

    trex.collide(ground);
    //spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    bg.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 200 === 0) {
    var obstacle = createSprite(windowWidth-600,windowHeight-700,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 8;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false; 
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}