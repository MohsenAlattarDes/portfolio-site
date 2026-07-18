export const CAKE_WORKSHOP_SADU_SOURCE = `// SADU MOTIF GENERATOR
// KEYS: R = new motif · S = save PNG · G = save GIF

let cell = 16;
let cols = 40;
let rows = 40;

let aCol = "#ff7fff";
let bCol = "#722218";

let pixels = [];
let drawIndex = 0;
let pixelsPerFrame = 24;
let occupied;

function setup() {
  pixelDensity(1);
  createCanvas(cols * cell, rows * cell);
  noStroke();
  clear();
  generateMotif();
}

function draw() {
  clear();

  let limit = min(drawIndex, pixels.length);
  for (let i = 0; i < limit; i++) {
    let p = pixels[i];
    fill(p.c);
    rect(p.x * cell, p.y * cell, cell, cell);
  }

  if (drawIndex < pixels.length) {
    drawIndex += pixelsPerFrame;
  }
}

function keyPressed() {
  if (key === "r" || key === "R") {
    generateMotif();
  }

  if (key === "s" || key === "S") {
    saveCanvas("sadu-motif", "png");
  }

  if (key === "g" || key === "G") {
    // restart animation before recording
    drawIndex = 0;

    // works in p5 builds that support saveGif()
    if (typeof saveGif === "function") {
      let seconds = max(1, ceil(pixels.length / pixelsPerFrame / 60) + 1);
      saveGif("sadu-motif", seconds);
    } else {
      console.log("saveGif() is not available in this p5.js build.");
    }
  }
}

function generateMotif() {
  pixels = [];
  drawIndex = 0;
  occupied = new Map();

  let cx = floor(cols / 2);
  let cy = floor(rows / 2);

  let outerType = random(["diamondRing", "diamondFilled", "squareRing", "stepDiamond"]);
  let middleType = random(["crossBlock", "diamondRing", "stepDiamond", "none"]);
  let coreType = random(["miniCrossCut", "diamondCut", "plusSquareCut", "crossDiamond"]);
  let armType = random(["none", "cardinalCrosses", "cardinalDiamonds", "steppedArms", "cornerDiamonds", "cornerCrosses"]);
  let satelliteType = random(["none", "fourDots", "fourDiamonds", "fourCrosses", "edgeHooks"]);

  let outerR = floor(random(5, 9));
  let middleR = max(2, outerR - floor(random(2, 4)));
  let innerR = max(1, middleR - floor(random(1, 3)));

  if (outerType === "diamondRing") addDiamondRing(cx, cy, outerR, floor(random(1, 3)), bCol);
  if (outerType === "diamondFilled") addDiamondFilled(cx, cy, outerR, bCol);
  if (outerType === "squareRing") addSquareRing(cx, cy, outerR, floor(random(1, 3)), bCol);
  if (outerType === "stepDiamond") addStepDiamond(cx, cy, outerR, bCol);

  if (middleType === "crossBlock") addBlockCross(cx, cy, middleR, 3, aCol);
  if (middleType === "diamondRing") addDiamondRing(cx, cy, middleR, 1, aCol);
  if (middleType === "stepDiamond") addStepDiamond(cx, cy, middleR, aCol);

  if (coreType === "miniCrossCut") cutMiniCross(cx, cy);
  if (coreType === "diamondCut") cutDiamondFilled(cx, cy, 1);
  if (coreType === "plusSquareCut") cutPlusSquare(cx, cy);
  if (coreType === "crossDiamond") {
    cutMiniCross(cx, cy);
    addDiamondFilled(cx, cy, 1, aCol);
  }

  if (random() > 0.45) {
    let fillChoice = random(["diamond", "square", "cross"]);
    let fillCol = random([aCol, bCol]);

    if (fillChoice === "diamond") addDiamondFilled(cx, cy, innerR, fillCol);
    if (fillChoice === "square") addSquareFilled(cx, cy, innerR, fillCol);
    if (fillChoice === "cross") addBlockCross(cx, cy, innerR, 1, fillCol);
  }

  let d = outerR + floor(random(2, 5));

  if (armType === "cardinalCrosses") {
    addMiniCross(cx, cy - d, aCol);
    addMiniCross(cx, cy + d, aCol);
    addMiniCross(cx - d, cy, aCol);
    addMiniCross(cx + d, cy, aCol);
  }

  if (armType === "cardinalDiamonds") {
    addDiamondFilled(cx, cy - d, 1, aCol);
    addDiamondFilled(cx, cy + d, 1, aCol);
    addDiamondFilled(cx - d, cy, 1, aCol);
    addDiamondFilled(cx + d, cy, 1, aCol);
  }

  if (armType === "steppedArms") {
    let len = floor(random(2, 5));
    addSteppedArmUp(cx, cy - outerR - 1, len, aCol);
    addSteppedArmDown(cx, cy + outerR + 1, len, aCol);
    addSteppedArmLeft(cx - outerR - 1, cy, len, aCol);
    addSteppedArmRight(cx + outerR + 1, cy, len, aCol);
  }

  if (armType === "cornerDiamonds") {
    addDiamondFilled(cx - d, cy - d, 1, aCol);
    addDiamondFilled(cx + d, cy - d, 1, aCol);
    addDiamondFilled(cx - d, cy + d, 1, aCol);
    addDiamondFilled(cx + d, cy + d, 1, aCol);
  }

  if (armType === "cornerCrosses") {
    addMiniCross(cx - d, cy - d, aCol);
    addMiniCross(cx + d, cy - d, aCol);
    addMiniCross(cx - d, cy + d, aCol);
    addMiniCross(cx + d, cy + d, aCol);
  }

  let d2 = d + floor(random(2, 4));

  if (satelliteType === "fourDots") {
    addPixel(cx, cy - d2, bCol);
    addPixel(cx, cy + d2, bCol);
    addPixel(cx - d2, cy, bCol);
    addPixel(cx + d2, cy, bCol);
  }

  if (satelliteType === "fourDiamonds") {
    addDiamondFilled(cx, cy - d2, 1, bCol);
    addDiamondFilled(cx, cy + d2, 1, bCol);
    addDiamondFilled(cx - d2, cy, 1, bCol);
    addDiamondFilled(cx + d2, cy, 1, bCol);
  }

  if (satelliteType === "fourCrosses") {
    addMiniCross(cx, cy - d2, bCol);
    addMiniCross(cx, cy + d2, bCol);
    addMiniCross(cx - d2, cy, bCol);
    addMiniCross(cx + d2, cy, bCol);
  }

  if (satelliteType === "edgeHooks") {
    addHookUp(cx, cy - d2, bCol);
    addHookDown(cx, cy + d2, bCol);
    addHookLeft(cx - d2, cy, bCol);
    addHookRight(cx + d2, cy, bCol);
  }

  if (random() > 0.55) {
    let c = d2 + floor(random(1, 4));
    let kind = random(["dot", "diamond", "cross"]);
    let col = random([aCol, bCol]);
    placeCornerSet(cx, cy, c, kind, col);
  }

  sortPixelsForAnimation(cx, cy);
}

function addPixel(x, y, c) {
  if (x < 0 || y < 0 || x >= cols || y >= rows) return;
  occupied.set(x + "," + y, c);
}

function removePixel(x, y) {
  if (x < 0 || y < 0 || x >= cols || y >= rows) return;
  occupied.delete(x + "," + y);
}

function commitOccupied() {
  pixels = [];
  for (let [key, c] of occupied.entries()) {
    let parts = key.split(",");
    pixels.push({ x: int(parts[0]), y: int(parts[1]), c });
  }
}

function addRect(x, y, w, h, c) {
  for (let yy = 0; yy < h; yy++) {
    for (let xx = 0; xx < w; xx++) {
      addPixel(x + xx, y + yy, c);
    }
  }
}

function cutRect(x, y, w, h) {
  for (let yy = 0; yy < h; yy++) {
    for (let xx = 0; xx < w; xx++) {
      removePixel(x + xx, y + yy);
    }
  }
}

function addDiamondFilled(cx, cy, r, c) {
  for (let yy = -r; yy <= r; yy++) {
    let span = r - abs(yy);
    for (let xx = -span; xx <= span; xx++) {
      addPixel(cx + xx, cy + yy, c);
    }
  }
}

function cutDiamondFilled(cx, cy, r) {
  for (let yy = -r; yy <= r; yy++) {
    let span = r - abs(yy);
    for (let xx = -span; xx <= span; xx++) {
      removePixel(cx + xx, cy + yy);
    }
  }
}

function addDiamondRing(cx, cy, r, thickness, c) {
  for (let t = 0; t < thickness; t++) {
    let rr = r - t;
    for (let yy = -rr; yy <= rr; yy++) {
      let span = rr - abs(yy);
      addPixel(cx - span, cy + yy, c);
      addPixel(cx + span, cy + yy, c);
    }
  }
}

function addSquareFilled(cx, cy, r, c) {
  addRect(cx - r, cy - r, r * 2 + 1, r * 2 + 1, c);
}

function addSquareRing(cx, cy, r, thickness, c) {
  for (let t = 0; t < thickness; t++) {
    let rr = r - t;
    for (let x = cx - rr; x <= cx + rr; x++) {
      addPixel(x, cy - rr, c);
      addPixel(x, cy + rr, c);
    }
    for (let y = cy - rr; y <= cy + rr; y++) {
      addPixel(cx - rr, y, c);
      addPixel(cx + rr, y, c);
    }
  }
}

function addStepDiamond(cx, cy, r, c) {
  for (let yy = -r; yy <= r; yy++) {
    let span = r - abs(yy);
    addRect(cx - span, cy + yy, span * 2 + 1, 1, c);
  }
}

function addMiniCross(cx, cy, c) {
  addPixel(cx, cy - 1, c);
  addPixel(cx - 1, cy, c);
  addPixel(cx, cy, c);
  addPixel(cx + 1, cy, c);
  addPixel(cx, cy + 1, c);
}

function cutMiniCross(cx, cy) {
  removePixel(cx, cy - 1);
  removePixel(cx - 1, cy);
  removePixel(cx, cy);
  removePixel(cx + 1, cy);
  removePixel(cx, cy + 1);
}

function addPlusSquare(cx, cy, c) {
  addRect(cx - 1, cy - 1, 3, 3, c);
  addPixel(cx, cy - 2, c);
  addPixel(cx - 2, cy, c);
  addPixel(cx + 2, cy, c);
  addPixel(cx, cy + 2, c);
}

function cutPlusSquare(cx, cy) {
  cutRect(cx - 1, cy - 1, 3, 3);
  removePixel(cx, cy - 2);
  removePixel(cx - 2, cy);
  removePixel(cx + 2, cy);
  removePixel(cx, cy + 2);
}

function addBlockCross(cx, cy, arm, thickness, c) {
  addRect(cx - floor(thickness / 2), cy - arm, thickness, arm * 2 + 1, c);
  addRect(cx - arm, cy - floor(thickness / 2), arm * 2 + 1, thickness, c);
}

function addSteppedArmUp(cx, cy, len, c) {
  for (let i = 0; i < len; i++) addRect(cx - 1, cy - i * 2, 3, 2, c);
}

function addSteppedArmDown(cx, cy, len, c) {
  for (let i = 0; i < len; i++) addRect(cx - 1, cy + i * 2, 3, 2, c);
}

function addSteppedArmLeft(cx, cy, len, c) {
  for (let i = 0; i < len; i++) addRect(cx - i * 2, cy - 1, 2, 3, c);
}

function addSteppedArmRight(cx, cy, len, c) {
  for (let i = 0; i < len; i++) addRect(cx + i * 2, cy - 1, 2, 3, c);
}

function addHookUp(cx, cy, c) {
  addPixel(cx, cy, c);
  addPixel(cx - 1, cy + 1, c);
  addPixel(cx, cy + 1, c);
  addPixel(cx + 1, cy + 1, c);
}

function addHookDown(cx, cy, c) {
  addPixel(cx, cy, c);
  addPixel(cx - 1, cy - 1, c);
  addPixel(cx, cy - 1, c);
  addPixel(cx + 1, cy - 1, c);
}

function addHookLeft(cx, cy, c) {
  addPixel(cx, cy, c);
  addPixel(cx + 1, cy - 1, c);
  addPixel(cx + 1, cy, c);
  addPixel(cx + 1, cy + 1, c);
}

function addHookRight(cx, cy, c) {
  addPixel(cx, cy, c);
  addPixel(cx - 1, cy - 1, c);
  addPixel(cx - 1, cy, c);
  addPixel(cx - 1, cy + 1, c);
}

function placeCornerSet(cx, cy, d, kind, col) {
  if (kind === "dot") {
    addPixel(cx - d, cy - d, col);
    addPixel(cx + d, cy - d, col);
    addPixel(cx - d, cy + d, col);
    addPixel(cx + d, cy + d, col);
  }

  if (kind === "diamond") {
    addDiamondFilled(cx - d, cy - d, 1, col);
    addDiamondFilled(cx + d, cy - d, 1, col);
    addDiamondFilled(cx - d, cy + d, 1, col);
    addDiamondFilled(cx + d, cy + d, 1, col);
  }

  if (kind === "cross") {
    addMiniCross(cx - d, cy - d, col);
    addMiniCross(cx + d, cy - d, col);
    addMiniCross(cx - d, cy + d, col);
    addMiniCross(cx + d, cy + d, col);
  }
}

function sortPixelsForAnimation(cx, cy) {
  commitOccupied();

  pixels.sort((p1, p2) => {
    let d1 = abs(p1.x - cx) + abs(p1.y - cy);
    let d2 = abs(p2.x - cx) + abs(p2.y - cy);

    if (d1 !== d2) return d1 - d2;
    if (p1.y !== p2.y) return p1.y - p2.y;
    return p1.x - p2.x;
  });
}
`;
