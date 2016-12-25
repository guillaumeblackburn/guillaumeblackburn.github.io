var drops = [];

function setup() {
  createCanvas(700, 400);
  //Creating of the snowflakes
  for (var i = 0; i < 300; i++) {
    drops[i] = new Drop();
  }
}

function draw() {
  var size = 125;
  background(210, 229, 255,200);
  //Creation of the text
  textSize(40);
  textFont("cursive")
  stroke(200,200,200);
  fill(0, 200, 0, 200);
  text("Joyeux Noël et Bonne Année!", 100, 60);
  textSize(25);
  stroke(200,0,0);
  fill(200, 0, 0);
  text("De",205,200);
  text("Guillaume et Maude",200,230);
  //Drawing of the ground
  stroke(255,255,255);
  fill(255, 255, 255);
  arc(width*0.5, height, 1.1*width, 50, PI, 2*PI);
  //Drawing of the snowman
  stroke(240,240,240);
  ellipse(width*0.75,height-35,size,size);
  ellipse(width*0.75+5,height-size,0.8*size,0.8*size);
  ellipse(width*0.75+8,height-1.65*size,0.6*size,0.6*size);
  //Drawing of the hat
  fill(0,0,0);
  ellipse(530,160,100,10);
  quad(505, 160, 555, 160, 555, 115, 505, 115);
  fill(255,0,0,200);
  stroke(255,0,0,200);
  quad(505, 155, 555, 155, 555, 140, 505, 140);
  //Drawing of the carrot
  fill(255,128,0,200);
  stroke(255,128,0,200);
  triangle(530, 200, 530, 190, 480, 205);
  //Drawing of the eyes and smiles
  fill(0,0,0);
  stroke(0,0,0);
  ellipse(520,180,6,5);
  ellipse(540,180,6,5);
  ellipse(512,211,4,4);
  ellipse(522,213,4,4);
  ellipse(532,213,4,4);
  ellipse(542,211,4,4);
  //Drawing of the buttons
  fill(255,0,0);
  stroke(255,0,0);
  ellipse(520,245,5,5)
  ellipse(518,265,5,5)
  ellipse(518,285,5,5)
  ellipse(520,305,5,5)
  //Drawing of the tree
  fill(102,51,0,200);
  stroke(102,51,0,200);
  quad(100, 380, 130, 380, 125, 350, 105, 350);
  fill(0,102,51,230);
  stroke(0,102,51,200);
  triangle(35, 350, 200, 350, 105, 225);
  triangle(45, 275, 180, 275, 110, 175);
  triangle(65, 200, 160, 200, 115, 100);
  //Darw the snowflakes
  for (var i = 0; i < drops.length; i++) {
    drops[i].fall();
    drops[i].show();
  }
}
