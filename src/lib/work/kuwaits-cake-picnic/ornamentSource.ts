export const CAKE_PICNIC_ORNAMENT_SOURCE = `// ORNAMENT GENERATOR
// KEYS: R = new drawing · S = save PNG

let inkLayer;
let backgroundColor = "#FFFAFC";
let inkBlue = "#095ce7";

let penX, penY;
let directionAngle = 0;
let startTime;
let durationMs = 15000;

let trail = [];
let maxTrail = 14;
let symmetryCopies = 2;

let thinStroke = 2.5;
let thickStroke = 9;
let nibAngle = -Math.PI / 6;
let noiseTime = 0;

let canvasWidth = 1920;
let canvasHeight = 1080;
let drawingMarginX = 260;
let drawingMarginY = 170;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  pixelDensity(2);

  inkLayer = createGraphics(width, height);
  inkLayer.pixelDensity(2);
  inkLayer.clear();

  resetOrnament();
}

function draw() {
  clear();
  image(inkLayer, 0, 0);

  if (millis() - startTime > durationMs) {
    resetOrnament();
    return;
  }

  let slowTurn = map(noise(noiseTime), 0, 1, -0.09, 0.09);
  let wobbleTurn = sin(frameCount * 0.07) * 0.05;
  directionAngle += slowTurn + wobbleTurn;

  let moveSpeed = map(noise(noiseTime + 500), 0, 1, 2.2, 4.4);
  penX += cos(directionAngle) * moveSpeed;
  penY += sin(directionAngle) * moveSpeed;
  noiseTime += 0.01;

  if (penX < drawingMarginX || penX > width - drawingMarginX) {
    directionAngle += random(0.8, 1.6);
  }
  if (penY < drawingMarginY || penY > height - drawingMarginY) {
    directionAngle += random(0.8, 1.6);
  }

  penX = constrain(penX, drawingMarginX, width - drawingMarginX);
  penY = constrain(penY, drawingMarginY, height - drawingMarginY);

  trail.push({ x: penX, y: penY });
  if (trail.length > maxTrail) trail.shift();

  if (frameCount % 3 === 0 && trail.length >= 7) {
    drawSymmetricCurve();
  }
}

function drawSymmetricCurve() {
  let centerX = width / 2;
  let centerY = height / 2;

  inkLayer.push();
  inkLayer.translate(centerX, centerY);
  inkLayer.noFill();
  inkLayer.stroke(inkBlue);
  inkLayer.strokeCap(ROUND);
  inkLayer.strokeJoin(ROUND);

  for (let copyIndex = 0; copyIndex < symmetryCopies; copyIndex++) {
    let rotationAngle = (TWO_PI / symmetryCopies) * copyIndex;

    inkLayer.push();
    inkLayer.rotate(rotationAngle);
    drawCalligraphicTrail(centerX, centerY);
    inkLayer.pop();

    inkLayer.push();
    inkLayer.rotate(rotationAngle);
    inkLayer.scale(-1, 1);
    drawCalligraphicTrail(centerX, centerY);
    inkLayer.pop();
  }

  inkLayer.pop();
}

function drawCalligraphicTrail(centerX, centerY) {
  for (let pointIndex = 1; pointIndex < trail.length - 2; pointIndex++) {
    let previousPoint = trail[pointIndex - 1];
    let currentPoint = trail[pointIndex];
    let nextPoint = trail[pointIndex + 1];
    let nextNextPoint = trail[pointIndex + 2];

    let currentX = currentPoint.x - centerX;
    let currentY = currentPoint.y - centerY;
    let nextX = nextPoint.x - centerX;
    let nextY = nextPoint.y - centerY;

    let segmentAngle = atan2(nextY - currentY, nextX - currentX);
    let thicknessAmount = abs(sin(segmentAngle - nibAngle));
    let segmentStroke = lerp(thinStroke, thickStroke, thicknessAmount);

    inkLayer.strokeWeight(segmentStroke);
    inkLayer.beginShape();
    inkLayer.curveVertex(previousPoint.x - centerX, previousPoint.y - centerY);
    inkLayer.curveVertex(currentX, currentY);
    inkLayer.curveVertex(nextX, nextY);
    inkLayer.curveVertex(nextNextPoint.x - centerX, nextNextPoint.y - centerY);
    inkLayer.endShape();
  }
}

function resetOrnament() {
  randomSeed(floor(random(1000000)));
  noiseSeed(floor(random(1000000)));
  inkLayer.clear();

  penX = random(drawingMarginX + 40, width - drawingMarginX - 40);
  penY = random(drawingMarginY + 40, height - drawingMarginY - 40);
  directionAngle = random(TWO_PI);
  noiseTime = random(1000);

  trail = [];
  for (let pointIndex = 0; pointIndex < 10; pointIndex++) {
    trail.push({ x: penX, y: penY });
  }

  startTime = millis();
  loop();
}

function keyPressed() {
  if (key === "r" || key === "R") resetOrnament();
  if (key === "s" || key === "S") saveCanvas("ornament", "png");
}
`;
