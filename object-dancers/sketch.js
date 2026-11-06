/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/

let dancer;

function setup() {
  // no adjustments in the setup function needed...
  createCanvas(windowWidth, windowHeight);

  // ...except to adjust the dancer's name on the next line:
  dancer = new CarlosDancer(width / 2, height / 2);
}

function draw() {
  // you don't need to make any adjustments inside the draw loop
  background(0);
  drawFloor(); // for reference only

  dancer.update();
  dancer.display();
}

// You only code inside this class.
// Start by giving the dancer your name, e.g. LeonDancer.
class CarlosDancer {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    // add properties for your dancer here:
    // Store the animation time.
    this.t = 0;
    //..
    //..
  }
  update() {
    // update properties here to achieve
    // your dancer's desired moves and behaviour
    // Increase the time on every frame.
    this.t += 0.08;
  }
  display() {
    // the push and pop, along with the translate 
    // places your whole dancer object at this.x and this.y.
    // you may change its position on line 19 to see the effect.
    push();
    translate(this.x, this.y);

    // ******** //
    // ⬇️ draw your dancer from here ⬇️
    noStroke();

    // Soft glow
    fill(255, 110, 20, 15);
    ellipse(0, 0, 150, 160);
    fill(255, 140, 30, 18);
    ellipse(0, 5, 125, 135);

    // Bounce upward and sway from side to side.
    let bounce = Math.abs(Math.sin(this.t)) * 14;
    let sway = Math.sin(this.t) * 8;
    translate(sway, -bounce);

    // Use a rotation matrix to keep the sway in radians.
    let tilt = Math.sin(this.t) * 0.18;
    applyMatrix(
      Math.cos(tilt), Math.sin(tilt),
      -Math.sin(tilt), Math.cos(tilt),
      0, 0
    );

    // Outer flame
    fill(255, 105, 35);
    beginShape();
    vertex(8, -65);
    vertex(5, -46);
    vertex(15, -30);
    vertex(30, -14);
    vertex(40, 3);
    vertex(45, 20);
    vertex(43, 35);
    vertex(36, 47);
    vertex(23, 56);
    vertex(7, 60);
    vertex(-10, 59);
    vertex(-26, 53);
    vertex(-38, 43);
    vertex(-44, 29);
    vertex(-44, 14);
    vertex(-39, 0);
    vertex(-30, -14);
    vertex(-16, -29);
    vertex(-2, -46);
    endShape(CLOSE);

    // Golden inner flame
    fill(255, 195, 55);
    beginShape();
    vertex(3, -27);
    vertex(9, -9);
    vertex(22, 7);
    vertex(29, 23);
    vertex(29, 36);
    vertex(22, 47);
    vertex(10, 52);
    vertex(-4, 53);
    vertex(-18, 49);
    vertex(-28, 40);
    vertex(-31, 28);
    vertex(-27, 15);
    vertex(-17, 2);
    vertex(-7, -10);
    endShape(CLOSE);

    // Warm highlight
    fill(255, 230, 130);
    ellipse(-3, 43, 27, 14);

    // Rosy cheeks
    fill(255, 130, 95);
    ellipse(-23, 28, 12, 7);
    ellipse(23, 28, 12, 7);

    // Eyes
    fill(65, 35, 30);
    ellipse(-13, 17, 8, 12);
    ellipse(13, 17, 8, 12);

    // Eye highlights
    fill(255, 250, 225);
    ellipse(-14, 15, 3, 4);
    ellipse(12, 15, 3, 4);

    // Smile
    noFill();
    stroke(65, 35, 30);
    strokeWeight(2.5);
    beginShape();
    vertex(-6, 30);
    vertex(-3, 33);
    vertex(0, 34);
    vertex(3, 33);
    vertex(6, 30);
    endShape();

    // ⬆️ draw your dancer above ⬆️
    // ******** //

    // the next function draws a SQUARE and CROSS
    // to indicate the approximate size and the center point
    // of your dancer.
    // it is using "this" because this function, too, 
    // is a part if your Dancer object.
    // comment it out or delete it eventually.
    // this.drawReferenceShapes()

    pop();
  }
  drawReferenceShapes() {
    noFill();
    stroke(255, 0, 0);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);
    stroke(255);
    rect(-100, -100, 200, 200);
    fill(255);
    stroke(0);
  }
}



/*
GOAL:
The goal is for you to write a class that produces a dancing being/creature/object/thing. In the next class, your dancer along with your peers' dancers will all dance in the same sketch that your instructor will put together. 

RULES:
For this to work you need to follow one rule: 
  - Only put relevant code into your dancer class; your dancer cannot depend on code outside of itself (like global variables or functions defined outside)
  - Your dancer must perform by means of the two essential methods: update and display. Don't add more methods that require to be called from outside (e.g. in the draw loop).
  - Your dancer will always be initialized receiving two arguments: 
    - startX (currently the horizontal center of the canvas)
    - startY (currently the vertical center of the canvas)
  beside these, please don't add more parameters into the constructor function 
  - lastly, to make sure our dancers will harmonize once on the same canvas, please don't make your dancer bigger than 200x200 pixels. 
*/