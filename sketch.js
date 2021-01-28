var PLAY=1;
var END=0;
var gameState=PLAY;
var trex, trexRun, trexCollide;
var cloudsGroup, cloudImage;
var ground, invisibleGround, groundImage;
var obstaclesGroup, obstacles1, obstacles2, obstacles3, obstacles4, obstacles5;
var score; 
var gameOverImage, restartImage; 
var jumpSound, checkPointSound, dieSound; 

function preload(){
  trexRun=loadAnimation("trex 1.png","trex3-1.png","trex4-1.png");
  trexCollide=loadAnimation("trex_collided-1.png");
  
  groundImage=loadImage("ground2.png");
  cloudImage=loadImage("cloud.png");
  obstacle1=loadImage("obstacle1.png");
  obstacle2=loadImage("obstacle2.png");
  obstacle3=loadImage("obstacle3.png");
  obstacle4=loadImage("obstacle4.png");
  obstacle5=loadImage("obstacle5.png");
  obstacle6=loadImage("obstacle6.png");
  restartImage=loadImage("restart.png");
  gameOverImage=loadImage("gameOver.png");
  
  jumpSound=loadSound("jump.mp3");
  dieSound=loadSound("die.mp3");
  checkPointSound=loadSound("checkPoint.mp3");
}
function setup() {
  createCanvas(windowWidth,windowHeight);
  
  trex=createSprite(50,height-70,20,50);
  trex.addAnimation("running", trexRun);
  trex.addAnimation("collided", trexCollide);
  trex.scale=0.5;
  
  ground=createSprite(width/2,height-10,width,10);
  ground.addImage("ground", groundImage);
  ground.x=ground.width/2;
  
  invisibleGround=createSprite(width/2,height-10,width,10);
  invisibleGround.visible=false;
  
  gameOver=createSprite(300,100);
  gameOver.addImage(gameOverImage);
  gameOver.scale=0.5;
  
  restart=createSprite(300,140);
  restart.addImage(restartImage);
  restart.scale=0.5;
  
  obstaclesGroup= new Group();
  cloudsGroup= new Group();
  
  trex.setCollider("rectangle", 0,0, trex.width, trex.height);

  
score=0;
}

function draw() {
  background("white");
  text("Score:" + score,500,50);
  
  if(gameState===PLAY){
    gameOver.visible=false;
    restart.visible=false;
    
    spawnObstacles();
    spawnClouds();
    
    ground.velocityX=-(2 +3*score/100);
    
    score=score+Math.round(getFrameRate()/60);
    
    if(score>0 && score%100===0){
      checkPointSound.play()
    }
    
    if(ground.x<0){
      ground.x = ground.width/2;
    }
    
    if((touches.length>0||keyDown("space")&& trex.y>=height-80)){
      trex.velocityY=-15;
      jumpSound.play()
      touches=[];
    }
    
    trex.velocityY = trex.velocityY+0.8;
    trex.collide(invisibleGround);
    
    if(obstaclesGroup.isTouching(trex)){
      jumpSound.play()
      gameState=END;
      dieSound.play()
    }
    
  }
  
  else if(gameState===END){
       gameOver.visible = true;
      restart.visible = true;
      trex.changeAnimation("collided", trexCollide);
    
      ground.velocityX = 0;
      trex.velocityY = 0
      
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0); 
      if(mousePressedOver(restart)) {
      reset();
    }
   }
  
  
  
  
  drawSprites()
}

function reset(){
  gameState=PLAY;
  restart.visible=false;
  gameOver.visible=false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trexRun);
  score=0
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width/2,height-35,width,10);
   obstacle.velocityX = -(6 + score/100);
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
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   obstaclesGroup.add(obstacle)
   
   obstacle.depth=trex.depth;
  trex.depth=trex.depth+1;
    
   obstacle.depth=ground.depth;
   ground.depth=ground.depth+1;
 }
}

function spawnClouds() {

  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
    cloud.lifetime = 200;
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
  
    cloudsGroup.add(cloud);
    
  }
}
