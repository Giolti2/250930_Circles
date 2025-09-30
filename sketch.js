var cnv;

var circles = [];
var number = 8;

var animations = [];

var posX = [640, 780, 840, 780, 640, 500, 440, 500];
var posY = [260, 320, 460, 600, 660, 600, 460, 320];

const MAXTIMER = 300;
var timer = 0;

function setup() {
  cnv = createCanvas(1280, 920);
  centerCanvas();

  colorMode(HSB)
  for (let i = 0; i < number; i++){
    circles[i] = new Circle(posX[i], posY[i], color(i*45,100,100,0.8), 130 + getRandom(30), getRandom(180));
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

  for (let i = 0; i < animations.length; i++) {
    if (animations[i].update()) {
      animations.splice(i, 1);
      i--;
    }
  }

  if (timer > 0) {
    timer -= deltaTime;
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

  click() {
    let d = dist(this.x, this.y, mouseX, mouseY);
    console.log("click")

    if (d < this.size/2) {
      this.grow()
      timer = 300;
    }
  }

  grow() {
    let item = circles[Math.floor(Math.random() * circles.length)]
    if (item.size > 20) {
      animations.push(new LerpAnimation(item, this, 300))
    }
    console.log("grow")
  }
}

function getRandom(range) {
  return Math.random() * (range * 2) - range;
}

function flip(angle, axis) {
  if (axis == 0) {
    angle = 180 - angle;
  }
  else {
    angle = -angle;
  }

  return angle;
}

function mouseClicked() {
  if (timer <= 0) {
    for (item of circles) { 
      item.click();
    }
  }
}

class LerpAnimation {
  constructor(item1, item2, duration) {
    this.item1 = item1;
    this.item2 = item2;
    this.start = millis();
    this.duration = duration;

    this.from1 = item1.size;
    this.from2 = item2.size;
    this.increment = 20;
  }

  update() {
    let t = (millis() - this.start) / this.duration;
    
    this.item1.size = lerp(this.from1, this.from1 - this.increment, t);
    this.item2.size = lerp(this.from2, this.from2 + this.increment, t);

    return ((millis() - this.start) > this.duration);
  }
}