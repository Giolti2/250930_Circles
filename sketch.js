var cnv;

var circles = [];
var number = 6;

var posX = [690, 740, 690, 590, 540, 590];
var posY = [274, 360, 446, 446, 360, 274];

function setup() {
  cnv = createCanvas(1280, 720);
  centerCanvas();

  for (let i = 0; i < number; i++){
    circles[i] = new Circle(posX[i], posY[i], color('rgb(30,50,50)'), 70, 60*i-60);
  }

  noStroke();
}

function draw() {
  background(220);


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

  constructor(x, y, col, size = 70, dir = 45) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.size = size;
    this.dir = dir;
  }

  speed = 2;
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
    if (this.x >= 1280 && this.dir >= -90 && this.dir <= 90) {
      this.dir = flip(this.dir, 0)
    }
    else if (this.x <= 0 && (this.dir > 90 || this.dir < -90)) {
      this.dir = flip(this.dir, 0)
    }

    if (this.y >= 720 && this.dir > 0) {
      this.dir = flip(this.dir, 1)
    }
    else if (this.y <= 0 && this.dir < 0) {
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