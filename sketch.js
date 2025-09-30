const INCREMENT = 60;

var cnv;

var circles = [];
var number = 8;

var AI;

var animations = [];

var posX = [640, 780, 840, 780, 640, 500, 440, 500];
var posY = [260, 320, 460, 600, 660, 600, 460, 320];

var colorList = []

const MAXTIMER = 300;
var timer = 0;

function setup() {
  cnv = createCanvas(1280, 920);
  centerCanvas();

  colorMode(HSB)

  AI = new AIcircle(0, 0, 0, color(150, 100, 100, 0.8))
  
  colorList = [
    color('#B45E53'),
    color('#7B2D26'),
    color('#5C7A98'),
    color('#008799'),
    color('#5A7D54'),
    color('#FFD885'),
    color('#57423E'),
    color('#9D6E1E')
  ]

  for (item of colorList) {
    item.setAlpha(0.7);
  }

  for (let i = 0; i < number; i++){
    circles[i] = new Circle(posX[i], posY[i], colorList[i], 100 + getRandom(60), getRandom(180), i);
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

  AI.update();

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

  constructor(x, y, col, size = 150, dir = 45, tag) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.col = col;
    this.size = size;
    this.dir = dir;
    this.tag = tag;
    this.reached = false;
  }

  speed = 0.5;
  range = 5;

  show() {
    fill(this.col);
    circle(this.x, this.y, this.size);
    noFill();
  }

  move() {
    if (!AI.reached) {
      this.dir = this.dir + getRandom(this.range);
      if (this.dir > 180)
        this.dir -= 360;
      if (this.dir < -180)
        this.dir += 360;
      this.x += this.speed * Math.cos(this.dir * Math.PI / 180)
      this.y += this.speed * Math.sin(this.dir * Math.PI / 180)
    }
    else if(!this.reached && dist(this.x, this.y, this.targetX, this.targetY) > 1){
      this.dir = Math.atan2(this.y - this.targetY, this.x - this.targetX)
      this.x -= this.speed * Math.cos(this.dir)
      this.y -= this.speed * Math.sin(this.dir)

      if (dist(this.x, this.y, this.targetX, this.targetY) < 1)
        this.reached = true;
    }
    
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
    if (AI.dropped)
      return

    let d = dist(this.x, this.y, mouseX, mouseY);

    if (d < this.size/2) {
      this.grow()
      timer = 300;
    }
  }

  grow() {
    if (checkSizes(this.tag)) {

      let item;
      do {
        item = circles[Math.floor(Math.random() * circles.length)]
      }
      while (this.tag == item.tag || item.size < INCREMENT + 20)
    
      animations.push(new LerpAnimation(item, this, 300))

    }
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

function mousePressed() {
    if (mouseX < 50 && !AI.active) {
      AI.active = true;
      console.log("wakeup")
      animations.push(new AIAnimation(0, 130))
    }
}

function mouseReleased() {
  if (mouseX < 50 && AI.active && !AI.dropped) {
    animations.push(new AIAnimation(130, 0, true))
  }
  else if (AI.active && !AI.dropped) {
    animations.push(new AIAnimation(130, 100))
    AI.dropped = true;
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
  }

  update() {
    let t = (millis() - this.start) / this.duration;
    
    this.item1.size = lerp(this.from1, this.from1 - INCREMENT, t);
    this.item2.size = lerp(this.from2, this.from2 + INCREMENT, t);

    return ((millis() - this.start) > this.duration);
  }
}

class EndAnimation {
  constructor(tag, duration) {
    this.tag = tag;
    this.item = circles[tag];
    this.duration = duration

    this.start = millis();
    this.from = this.item.size;
  }

  update() {
    let t = (millis() - this.start) / this.duration;
    
    this.item.size = lerp(this.from, 100, t);

    return ((millis() - this.start) > this.duration);
  }
}

class AIAnimation {
  constructor(from, to, turnoff = false) {
    this.start = millis();
    this.duration = MAXTIMER;

    this.from = from;
    this.to = to;
    this.turnoff = turnoff;
  }

  update() {
    let t = (millis() - this.start) / this.duration;

    AI.size = lerp(this.from, this.to, t);

    if (this.turnoff && (millis() - this.start) > this.duration) {
      AI.active = false;
    }

    return ((millis() - this.start) > this.duration);
  }
}

function checkSizes(tag) {
  for (item of circles) {
    if ((item.tag != tag) && (item.size > INCREMENT + 20)) {
      console.log("true "+item.tag+" "+tag)
      return true;
    }
  }

  console.log("false")
  return false;
}

class AIcircle {
  constructor(x, y, size, col) {
    this.x = x;
    this.y = y;
    this.targetX = 640;
    this.targetY = 460;
    this.speed = 1;
    this.dir = 0;
    this.size = size;
    this.active = false;
    this.dropped = false;
    this.reached = false;
    this.col = col;
  }

  update() {
    if (this.active) {
      if (mouseIsPressed && !this.dropped) {
        this.x = mouseX;
        this.y = mouseY;
      }
      
      fill(this.col);
      circle(this.x, this.y, this.size);
      noFill();
    }

    if (this.dropped && dist(this.x, this.y, this.targetX, this.targetY) > 1) {
      this.dir = Math.atan2(this.y - this.targetY, this.x - this.targetX)
      this.x -= this.speed * Math.cos(this.dir)
      this.y -= this.speed * Math.sin(this.dir)

      if (dist(this.x, this.y, this.targetX, this.targetY) < 1) {
        this.reached = true;

        console.log('start animation')
        for (let i = 0; i < circles.length; i++) {
          animations.push(new EndAnimation(i, 5000))
        }
      }
    } 
  }
}

