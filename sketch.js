// Daniel Shiffman
// http://codingrainbow.com
// http://patreon.com/codingrainbow
// Code for: https://youtu.be/KkyIDI6rQJI

// Purple Rain
// (138, 43, 226)
// (230, 230, 250) // background

var drops = [];

function setup() {
  createCanvas(700, 400);

  for (var i = 0; i < 200; i++) {
    drops[i] = new Drop();
  }
}

function draw() {
  var size = 125

  background(210, 229, 255,200);
  textSize(60);
  textFont("cursive")
  stroke(0,200,0,100)
  fill(0, 200, 0, 100);
  text("Joyeux Noël !", 160, 80);
  stroke(255,255,255)
  fill(255, 255, 255);
  arc(width*0.5, height, 1.1*width, 50, PI, 2*PI);
  stroke(255,255,255)
  ellipse(width*0.75,height-35,size,size)
  ellipse(width*0.75+5,height-size,0.8*size,0.8*size)
  ellipse(width*0.75+8,height-1.65*size,0.6*size,0.6*size)
  fill(102,51,0,200)
  stroke(102,51,0,200)
  quad(100, 380, 130, 380, 125, 350, 105, 350);
  fill(0,102,51,200)
  stroke(0,102,51,200)
  triangle(35, 350, 200, 350, 105, 225);
  triangle(45, 275, 180, 275, 110, 175);
  triangle(65, 200, 160, 200, 115, 100);
  for (var i = 0; i < drops.length; i++) {
    drops[i].fall();
    drops[i].show();
  }
}
