// 0 = calm, 1 = bubbles, 2 = hiding
let mood = 0;
let moodTimer = 0;

// Happiness and hiding
let happiness = 0;
let nearbyTime = 0;
let hideAmount = 0;

// Count quick clicks
let clickCount = 0;
let clickStart = 0;

// Bubble starting point
let bubbleY = 250;

// Small differences each time
let breathSpeed;
let glowRed;


// SETUP

function setup() {
  createCanvas(800, 500);

  breathSpeed = random(0.03, 0.045);
  glowRed = random(195, 235);
}

// MAIN LOOP

function draw() {
  updateMood();
  drawOcean();

  // Darkness follows the creature's retreat
  push();
  noStroke();
  fill(3, 12, 30, hideAmount * 200);
  rect(0, 0, width, height);
  pop();

  drawCreature();

  if (mood === 1) {
    drawBubbles();
  }

  // A short hint
  push();
  noStroke();
  textAlign(CENTER);
  textSize(12);
  fill(230, 250, 245, 190);

  if (mood === 2) {
    text("Give it some quiet time...", 400, 28);
  } else {
    text("Stay nearby. Touch gently.", 400, 28);
  }

  pop();
}

// MOOD

function updateMood() {
  if (mood !== 0) {
    moodTimer = moodTimer + 1;
  }

  if (mood === 2) {
    nearbyTime = 0;
    happiness = max(0, happiness - 0.04);

    if (moodTimer < 90) {
      // Swim away
      hideAmount = min(1, hideAmount + 0.018);
    } else if (moodTimer > 210) {
      // Slowly come back
      hideAmount = max(0, hideAmount - 0.01);

      if (hideAmount === 0) {
        mood = 0;
        moodTimer = 0;
        clickCount = 0;
      }
    }
  } else {
    // Finish the bubble animation
    if (mood === 1 && moodTimer >= 160) {
      mood = 0;
      moodTimer = 0;
    }

    let bodyY =
      250 + sin(frameCount * 0.025) * 10 - 12;

    let mouseDistance =
      dist(mouseX, mouseY, 400, bodyY);

    // Wait near the creature to gain its attention
    if (
      mouseDistance < 150 &&
      mouseX >= 0 && mouseX <= width &&
      mouseY >= 0 && mouseY <= height
    ) {
      nearbyTime = nearbyTime + 1;

      if (nearbyTime > 30) {
        happiness = min(1, happiness + 0.02);
      }
    } else {
      nearbyTime = 0;
      happiness = max(0, happiness - 0.02);
    }
  }
}

function mousePressed() {
  // Let the hiding animation finish
  if (mood !== 2) {
    let bodyY =
      250 + sin(frameCount * 0.025) * 10 - 12;

    let clickDistance =
      dist(mouseX, mouseY, 400, bodyY);

    if (clickDistance < 70) {
      let now = millis();

      // Count clicks in a one-second window
      if (clickCount === 0 || now - clickStart > 1000) {
        clickCount = 1;
        clickStart = now;
      } else {
        clickCount = clickCount + 1;
      }

      if (clickCount >= 3) {
        // Too much touching makes it escape
        mood = 2;
        moodTimer = 0;
        nearbyTime = 0;
      } else if (mood === 0) {
        // One gentle touch makes bubbles
        mood = 1;
        moodTimer = 0;
        bubbleY = 250 + sin(frameCount * 0.025) * 10;
      }
    }
  }
}

// CREATURE

function drawCreature() {
  push();

  // Move off the right side when hiding
  translate(
    400 + hideAmount * 540,
    250 + sin(frameCount * 0.025) * 10
      + hideAmount * 35
  );

  rotate(sin(frameCount * 0.02) * 0.04);

  // A short frightened shake
  if (mood === 2 && moodTimer < 30) {
    rotate(sin(moodTimer * 0.8) * 0.12);
  }

  scale(1 - hideAmount * 0.2);
  noStroke();

  drawTentacle(-54, 28, 0.25, 0);
  drawTentacle(-20, 40, 0.08, 1);
  drawTentacle(20, 40, -0.08, 2);
  drawTentacle(54, 28, -0.25, 3);

  drawFin(-77, -8, -0.3, 0);
  drawFin(77, -8, 0.3, PI);

  drawBody();
  drawFace();

  pop();
}

function drawBody() {
  let breath = sin(frameCount * breathSpeed) * 5;
  let light = 1 - hideAmount * 0.8;

  // Outer glow
  fill(110, 255, 220, (15 + happiness * 45) * light);
  ellipse(
    0, -12,
    205 + breath + happiness * 35,
    175 + breath + happiness * 30
  );

  fill(160, 255, 230, (25 + happiness * 50) * light);
  ellipse(0, -12, 185 + breath, 155 + breath);

  // Blue body changes to bright mint
  fill(
    123 + happiness * 50 - hideAmount * 40,
    222 + happiness * 33 - hideAmount * 60,
    238 - happiness * 28 - hideAmount * 40,
    200
  );
  ellipse(0, -12, 164 + breath, 136 + breath);

  fill(200, 255, 235, 95 + happiness * 50);
  ellipse(0, -24, 136 + breath, 100 + breath);

  // Inner light
  fill(glowRed, 255, 210, (90 + happiness * 145) * light);
  ellipse(
    0, 8,
    64 + breath + happiness * 30,
    43 + breath + happiness * 20
  );

  // Highlight
  fill(245, 255, 255, 170);
  ellipse(-35, -48, 29, 13);
}

function drawFace() {
  push();
  noStroke();
  fill(17, 58, 77);

  if (mood === 2) {
    // Scared face
    ellipse(-26, -15, 11, 5);
    ellipse(26, -15, 11, 5);
    ellipse(0, 0, 5, 8);
  } else {
    if (happiness > 0.6) {
      // Happy eyes
      noFill();
      stroke(17, 58, 77);
      strokeWeight(3);
      arc(-26, -12, 14, 12, PI, TWO_PI);
      arc(26, -12, 14, 12, PI, TWO_PI);
      noStroke();
    } else {
      ellipse(-26, -15, 9, 13);
      ellipse(26, -15, 9, 13);
    }

    if (mood === 1) {
      fill(17, 58, 77);
      ellipse(0, 0, 12, 15);
    } else if (happiness > 0.6) {
      noFill();
      stroke(17, 58, 77);
      strokeWeight(2.5);
      arc(0, -1, 15, 12, 0, PI);
    } else {
      fill(17, 58, 77);
      ellipse(0, 0, 7, 5);
    }
  }

  // Pink cheeks
  noStroke();
  fill(255, 160, 190, 120 + happiness * 60);
  ellipse(-40, -1, 19 + happiness * 5, 9);
  ellipse(40, -1, 19 + happiness * 5, 9);

  pop();
}

function drawTentacle(xPos, yPos, angle, phase) {
  push();
  translate(xPos, yPos);
  rotate(angle + sin(frameCount * 0.035 + phase) * 0.16);

  fill(128, 223, 242, 170);
  ellipse(0, 18, 18, 48);

  translate(0, 37);
  rotate(sin(frameCount * 0.035 + phase + 0.6) * 0.22);
  fill(145, 230, 248, 155);
  ellipse(0, 17, 13, 44);

  translate(0, 34);
  rotate(sin(frameCount * 0.035 + phase + 1.2) * 0.25);
  fill(169, 240, 252, 150);
  ellipse(0, 13, 9, 34);

  fill(155, 242, 255, 28 + happiness * 25);
  circle(0, 28, 30);
  fill(224, 255, 245, 220);
  circle(0, 28, 10);

  pop();
}

function drawFin(xPos, yPos, angle, phase) {
  push();
  translate(xPos, yPos);
  rotate(angle + sin(frameCount * 0.04 + phase) * 0.15);

  fill(147, 228, 247, 140);
  beginShape();
  vertex(0, -24);
  vertex(-22, -8);
  vertex(-27, 8);
  vertex(-12, 30);
  vertex(0, 20);
  vertex(12, 30);
  vertex(27, 8);
  vertex(22, -8);
  endShape(CLOSE);

  pop();
}

// BUBBLES

function drawBubbles() {
  drawBubble(0, 18, -0.3);
  drawBubble(15, 25, 0.35);
  drawBubble(30, 14, -0.45);
  drawBubble(45, 22, 0.2);
}

function drawBubble(delay, bubbleSize, drift) {
  let age = moodTimer - delay;

  if (age >= 0 && age < 100) {
    push();

    let x = 400 + age * drift;
    let y = bubbleY - age * 1.8;
    let opacity = 1 - age / 100;
    let currentSize = bubbleSize;

    if (age < 10) {
      currentSize = bubbleSize * (0.3 + age * 0.07);
    }

    stroke(220, 255, 255, 200 * opacity);
    strokeWeight(1.5);
    fill(160, 235, 255, 40 * opacity);
    circle(x, y, currentSize);

    noStroke();
    fill(255, 255, 255, 200 * opacity);
    circle(x - currentSize * 0.2, y - currentSize * 0.2, 4);

    pop();
  }
}

// SUNNY OCEAN

function drawOcean() {
  background(23, 112, 145);

  push();
  noStroke();

  // Layers of deeper water
  fill(18, 96, 131);
  rect(0, 130, 800, 370);
  fill(15, 80, 116);
  rect(0, 270, 800, 230);

  // Warm light near the surface
  fill(210, 245, 190, 22);
  ellipse(180, -40, 760, 390);
  fill(255, 245, 175, 30);
  ellipse(160, -55, 470, 250);

  // Sunlight enters the water
  drawSunbeam(20, 45, 120, 300, 0);
  drawSunbeam(140, 35, 300, 470, 1);
  drawSunbeam(285, 55, 520, 740, 2);
  drawSunbeam(470, 30, 700, 850, 3);

  // Distant seabed
  fill(30, 112, 117);
  ellipse(100, 490, 620, 160);
  ellipse(700, 495, 650, 170);

  // Warm sand
  fill(182, 181, 129);
  ellipse(400, 570, 1150, 270);
  fill(210, 202, 147);
  ellipse(210, 570, 760, 230);

  // Seaweed at the sides
  drawSeaweed(25, 465, 1.2, 0);
  drawSeaweed(80, 465, 0.85, 1);
  drawSeaweed(185, 470, 0.65, 2);
  drawSeaweed(610, 470, 0.7, 3);
  drawSeaweed(720, 465, 1.1, 4);
  drawSeaweed(785, 465, 1.35, 5);

  // Colorful coral
  drawCoral(80, 465, 1.15, 242, 139, 159);
  drawCoral(150, 475, 0.75, 183, 143, 222);
  drawCoral(215, 480, 0.45, 245, 185, 110);
  drawCoral(605, 480, 0.5, 241, 166, 120);
  drawCoral(670, 475, 0.8, 214, 138, 190);
  drawCoral(750, 470, 1.05, 178, 152, 230);

  // Rounded coral clusters
  drawCoralCluster(40, 475, 239, 176, 111);
  drawCoralCluster(175, 485, 231, 148, 164);
  drawCoralCluster(640, 485, 164, 184, 225);
  drawCoralCluster(785, 480, 239, 185, 125);

  // Small stones
  fill(126, 151, 142);
  ellipse(270, 475, 22, 10);
  ellipse(480, 486, 17, 8);
  ellipse(540, 465, 25, 11);

  // Light floating in the water
  drawWaterLight(85, 110, 0);
  drawWaterLight(205, 205, 1);
  drawWaterLight(315, 75, 2);
  drawWaterLight(530, 115, 3);
  drawWaterLight(635, 240, 4);
  drawWaterLight(735, 90, 5);

  pop();
}

function drawSunbeam(topX, beamWidth, bottomLeft, bottomRight, phase) {
  push();
  noStroke();

  let shimmer = 15 + sin(frameCount * 0.012 + phase) * 5;
  fill(255, 248, 185, shimmer);

  beginShape();
  vertex(topX, 0);
  vertex(topX + beamWidth, 0);
  vertex(bottomRight, 450);
  vertex(bottomLeft, 450);
  endShape(CLOSE);

  pop();
}

function drawSeaweed(xPos, yPos, plantSize, phase) {
  push();
  translate(xPos, yPos);
  scale(plantSize);
  rotate(sin(frameCount * 0.018 + phase) * 0.08);
  noStroke();

  push();
  rotate(-0.3);
  fill(45, 158, 130);
  ellipse(0, -58, 18, 125);
  pop();

  push();
  rotate(0.35);
  fill(76, 181, 137);
  ellipse(0, -48, 20, 106);
  pop();

  fill(62, 188, 151);
  ellipse(0, -83, 22, 174);

  fill(174, 230, 164, 100);
  ellipse(-3, -88, 5, 135);

  pop();
}

function drawCoral(xPos, yPos, coralSize, r, g, b) {
  push();
  translate(xPos, yPos);
  scale(coralSize);

  // Simple branching lines
  stroke(r, g, b);
  strokeWeight(9);

  line(0, 0, 0, -95);
  line(0, -28, -35, -60);
  line(-35, -60, -38, -85);
  line(0, -48, 32, -78);
  line(32, -78, 35, -103);
  line(0, -72, -18, -106);

  strokeWeight(5);
  line(-24, -50, -48, -55);
  line(21, -68, 45, -70);
  line(0, -87, 14, -111);

  // Rounded tips
  noStroke();
  fill(r, g, b);
  circle(0, -95, 9);
  circle(-38, -85, 9);
  circle(35, -103, 9);
  circle(-18, -106, 9);

  pop();
}

function drawCoralCluster(xPos, yPos, r, g, b) {
  push();
  translate(xPos, yPos);
  noStroke();

  fill(r, g, b);
  ellipse(-18, -10, 29, 35);
  ellipse(0, -18, 33, 48);
  ellipse(20, -8, 28, 32);

  fill(255, 245, 215, 65);
  ellipse(-4, -29, 12, 16);

  pop();
}

function drawWaterLight(xPos, yPos, phase) {
  push();
  noStroke();

  let floatY = sin(frameCount * 0.02 + phase) * 8;

  fill(235, 255, 210, 18);
  circle(xPos, yPos + floatY, 12);

  fill(245, 255, 220, 120);
  circle(xPos, yPos + floatY, 3);

  pop();
}