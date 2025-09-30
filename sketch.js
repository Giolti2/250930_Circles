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
}

function draw() {
  background(220);


  for (item of circles) {
    item.show();
    item.move();
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

  speed = 0.3;
  range = 5;

  show() {
    fill(this.col);
    circle(this.x, this.y, this.size);
    noFill();
  }

  move() {
    this.dir = this.dir + getRandom(this.range);
    this.x += this.speed * Math.cos(this.dir * Math.PI / 180)
    this.y += this.speed * Math.sin(this.dir * Math.PI / 180)
  }
}

function getRandom(range) {
  return Math.random() * (range * 2) - range;
}