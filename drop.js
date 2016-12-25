function Drop() {
  this.x = random(width);
  this.y = random(-500, -50);
  this.z = random(0, 20);
  //this.len = map(this.z, 0, 20, 10, 20);
  this.yspeed = map(this.z, 0, 20, 1, 2);

  this.fall = function() {
    this.y = this.y + this.yspeed;
    var grav = map(this.z, 0, 20, 0, 0.0001);
    this.yspeed = this.yspeed + grav;

    if (this.y > height) {
      this.y = random(-500, -50);
      this.yspeed = map(this.z, 0, 20, 1, 2);
    }
  }

  this.show = function() {
    var thick = map(this.z, 0, 20, 0.5, 3);
    strokeWeight(thick);
    fill(255,255,255)
    stroke(255, 255, 255);
    //line(this.x, this.y, this.x, this.y+this.len);
    ellipse(this.x, this.y, 3,3);
  }
}
