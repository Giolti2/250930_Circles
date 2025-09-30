var cnv;

var circles = [];
var number = 8;

var posX = [640, 780, 840, 780, 640, 500, 440, 500];
var posY = [260, 320, 460, 600, 660, 600, 460, 320];

function setup() {
  cnv = createCanvas(1280, 920);
  centerCanvas();

  colorMode(HSB)
  for (let i = 0; i < number; i++){
    circles[i] = new Circle(posX[i], posY[i], color(i*45,100,100,0.8), 190 + getRandom(20), getRandom(180));
  }

  noStroke();
}

function draw() {
  clear();
  
  for (item of circles) {
    item.show();
    item.move();
    item.walls();
  }
}

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function windowResized() {
  centerCanvas();
}

class Circle{

  constructor(x, y, col, size = 150, dir = 45) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.size = size;
    this.dir = dir;
  }

  speed = 0.5;
  range = 5;

  show() {
    fill(this.col);
    circle(this.x, this.y, this.size);
    noFill();
  }

  move() {
    this.dir = this.dir + getRandom(this.range);
    if (this.dir > 180)
      this.dir -= 360;
    if (this.dir < -180)
      this.dir += 360;
    this.x += this.speed * Math.cos(this.dir * Math.PI / 180)
    this.y += this.speed * Math.sin(this.dir * Math.PI / 180)
  }

  walls() {
    if (this.x >= (1280 - this.size/3) && this.dir >= -90 && this.dir <= 90) {
      this.dir = flip(this.dir, 0)
    }
    else if (this.x <= this.size/3 && (this.dir > 90 || this.dir < -90)) {
      this.dir = flip(this.dir, 0)
    }

    if (this.y >= (720 - this.size/3) && this.dir > 0) {
      this.dir = flip(this.dir, 1)
    }
    else if (this.y <= this.size/3 && this.dir < 0) {
      this.dir = flip(this.dir, 1)
    }
  }
}

function getRandom(range) {
  return Math.random() * (range * 2) - range;
}

function flip(angle, axis) {
  console.log('flip')
  if (axis == 0) {
    angle = 180 - angle;
  }
  else {
    angle = -angle;
  }

  return angle;
}