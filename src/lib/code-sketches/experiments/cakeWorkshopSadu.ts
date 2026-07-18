import type p5js from "p5";

type P5 = InstanceType<typeof p5js>;
type Pixel = { x: number; y: number; c: string };

const COLS = 40;
const ROWS = 40;
const A_COL = "#ff7fff";
const B_COL = "#722218";
const PIXELS_PER_FRAME = 24;
const REGENERATE_PAUSE_MS = 1800;

export function createCakeWorkshopSadu(container: HTMLElement) {
  return (p: P5) => {
    let cell = 16;
    let offsetX = 0;
    let offsetY = 0;
    let pixels: Pixel[] = [];
    let drawIndex = 0;
    let occupied = new Map<string, string>();
    let finishedAt = 0;

    function layout() {
      cell = Math.max(
        1,
        Math.floor(Math.min(p.width / COLS, p.height / ROWS)),
      );
      offsetX = Math.floor((p.width - COLS * cell) / 2);
      offsetY = Math.floor((p.height - ROWS * cell) / 2);
    }

    function addPixel(x: number, y: number, c: string) {
      if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return;
      occupied.set(`${x},${y}`, c);
    }

    function removePixel(x: number, y: number) {
      if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return;
      occupied.delete(`${x},${y}`);
    }

    function commitOccupied() {
      pixels = [];
      for (const [key, c] of occupied.entries()) {
        const [xs, ys] = key.split(",");
        pixels.push({ x: Number(xs), y: Number(ys), c });
      }
    }

    function addRect(x: number, y: number, w: number, h: number, c: string) {
      for (let yy = 0; yy < h; yy += 1) {
        for (let xx = 0; xx < w; xx += 1) {
          addPixel(x + xx, y + yy, c);
        }
      }
    }

    function cutRect(x: number, y: number, w: number, h: number) {
      for (let yy = 0; yy < h; yy += 1) {
        for (let xx = 0; xx < w; xx += 1) {
          removePixel(x + xx, y + yy);
        }
      }
    }

    function addDiamondFilled(cx: number, cy: number, r: number, c: string) {
      for (let yy = -r; yy <= r; yy += 1) {
        const span = r - Math.abs(yy);
        for (let xx = -span; xx <= span; xx += 1) {
          addPixel(cx + xx, cy + yy, c);
        }
      }
    }

    function cutDiamondFilled(cx: number, cy: number, r: number) {
      for (let yy = -r; yy <= r; yy += 1) {
        const span = r - Math.abs(yy);
        for (let xx = -span; xx <= span; xx += 1) {
          removePixel(cx + xx, cy + yy);
        }
      }
    }

    function addDiamondRing(
      cx: number,
      cy: number,
      r: number,
      thickness: number,
      c: string,
    ) {
      for (let t = 0; t < thickness; t += 1) {
        const rr = r - t;
        for (let yy = -rr; yy <= rr; yy += 1) {
          const span = rr - Math.abs(yy);
          addPixel(cx - span, cy + yy, c);
          addPixel(cx + span, cy + yy, c);
        }
      }
    }

    function addSquareFilled(cx: number, cy: number, r: number, c: string) {
      addRect(cx - r, cy - r, r * 2 + 1, r * 2 + 1, c);
    }

    function addSquareRing(
      cx: number,
      cy: number,
      r: number,
      thickness: number,
      c: string,
    ) {
      for (let t = 0; t < thickness; t += 1) {
        const rr = r - t;
        for (let x = cx - rr; x <= cx + rr; x += 1) {
          addPixel(x, cy - rr, c);
          addPixel(x, cy + rr, c);
        }
        for (let y = cy - rr; y <= cy + rr; y += 1) {
          addPixel(cx - rr, y, c);
          addPixel(cx + rr, y, c);
        }
      }
    }

    function addStepDiamond(cx: number, cy: number, r: number, c: string) {
      for (let yy = -r; yy <= r; yy += 1) {
        const span = r - Math.abs(yy);
        addRect(cx - span, cy + yy, span * 2 + 1, 1, c);
      }
    }

    function addMiniCross(cx: number, cy: number, c: string) {
      addPixel(cx, cy - 1, c);
      addPixel(cx - 1, cy, c);
      addPixel(cx, cy, c);
      addPixel(cx + 1, cy, c);
      addPixel(cx, cy + 1, c);
    }

    function cutMiniCross(cx: number, cy: number) {
      removePixel(cx, cy - 1);
      removePixel(cx - 1, cy);
      removePixel(cx, cy);
      removePixel(cx + 1, cy);
      removePixel(cx, cy + 1);
    }

    function cutPlusSquare(cx: number, cy: number) {
      cutRect(cx - 1, cy - 1, 3, 3);
      removePixel(cx, cy - 2);
      removePixel(cx - 2, cy);
      removePixel(cx + 2, cy);
      removePixel(cx, cy + 2);
    }

    function addBlockCross(
      cx: number,
      cy: number,
      arm: number,
      thickness: number,
      c: string,
    ) {
      addRect(cx - Math.floor(thickness / 2), cy - arm, thickness, arm * 2 + 1, c);
      addRect(cx - arm, cy - Math.floor(thickness / 2), arm * 2 + 1, thickness, c);
    }

    function addSteppedArmUp(cx: number, cy: number, len: number, c: string) {
      for (let i = 0; i < len; i += 1) addRect(cx - 1, cy - i * 2, 3, 2, c);
    }

    function addSteppedArmDown(cx: number, cy: number, len: number, c: string) {
      for (let i = 0; i < len; i += 1) addRect(cx - 1, cy + i * 2, 3, 2, c);
    }

    function addSteppedArmLeft(cx: number, cy: number, len: number, c: string) {
      for (let i = 0; i < len; i += 1) addRect(cx - i * 2, cy - 1, 2, 3, c);
    }

    function addSteppedArmRight(cx: number, cy: number, len: number, c: string) {
      for (let i = 0; i < len; i += 1) addRect(cx + i * 2, cy - 1, 2, 3, c);
    }

    function addHookUp(cx: number, cy: number, c: string) {
      addPixel(cx, cy, c);
      addPixel(cx - 1, cy + 1, c);
      addPixel(cx, cy + 1, c);
      addPixel(cx + 1, cy + 1, c);
    }

    function addHookDown(cx: number, cy: number, c: string) {
      addPixel(cx, cy, c);
      addPixel(cx - 1, cy - 1, c);
      addPixel(cx, cy - 1, c);
      addPixel(cx + 1, cy - 1, c);
    }

    function addHookLeft(cx: number, cy: number, c: string) {
      addPixel(cx, cy, c);
      addPixel(cx + 1, cy - 1, c);
      addPixel(cx + 1, cy, c);
      addPixel(cx + 1, cy + 1, c);
    }

    function addHookRight(cx: number, cy: number, c: string) {
      addPixel(cx, cy, c);
      addPixel(cx - 1, cy - 1, c);
      addPixel(cx - 1, cy, c);
      addPixel(cx - 1, cy + 1, c);
    }

    function placeCornerSet(
      cx: number,
      cy: number,
      d: number,
      kind: string,
      col: string,
    ) {
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

    function sortPixelsForAnimation(cx: number, cy: number) {
      commitOccupied();
      pixels.sort((p1, p2) => {
        const d1 = Math.abs(p1.x - cx) + Math.abs(p1.y - cy);
        const d2 = Math.abs(p2.x - cx) + Math.abs(p2.y - cy);
        if (d1 !== d2) return d1 - d2;
        if (p1.y !== p2.y) return p1.y - p2.y;
        return p1.x - p2.x;
      });
    }

    function generateMotif() {
      pixels = [];
      drawIndex = 0;
      finishedAt = 0;
      occupied = new Map();

      const cx = Math.floor(COLS / 2);
      const cy = Math.floor(ROWS / 2);

      const outerType = p.random([
        "diamondRing",
        "diamondFilled",
        "squareRing",
        "stepDiamond",
      ]);
      const middleType = p.random([
        "crossBlock",
        "diamondRing",
        "stepDiamond",
        "none",
      ]);
      const coreType = p.random([
        "miniCrossCut",
        "diamondCut",
        "plusSquareCut",
        "crossDiamond",
      ]);
      const armType = p.random([
        "none",
        "cardinalCrosses",
        "cardinalDiamonds",
        "steppedArms",
        "cornerDiamonds",
        "cornerCrosses",
      ]);
      const satelliteType = p.random([
        "none",
        "fourDots",
        "fourDiamonds",
        "fourCrosses",
        "edgeHooks",
      ]);

      const outerR = Math.floor(p.random(5, 9));
      const middleR = Math.max(2, outerR - Math.floor(p.random(2, 4)));
      const innerR = Math.max(1, middleR - Math.floor(p.random(1, 3)));

      if (outerType === "diamondRing") {
        addDiamondRing(cx, cy, outerR, Math.floor(p.random(1, 3)), B_COL);
      }
      if (outerType === "diamondFilled") addDiamondFilled(cx, cy, outerR, B_COL);
      if (outerType === "squareRing") {
        addSquareRing(cx, cy, outerR, Math.floor(p.random(1, 3)), B_COL);
      }
      if (outerType === "stepDiamond") addStepDiamond(cx, cy, outerR, B_COL);

      if (middleType === "crossBlock") addBlockCross(cx, cy, middleR, 3, A_COL);
      if (middleType === "diamondRing") addDiamondRing(cx, cy, middleR, 1, A_COL);
      if (middleType === "stepDiamond") addStepDiamond(cx, cy, middleR, A_COL);

      if (coreType === "miniCrossCut") cutMiniCross(cx, cy);
      if (coreType === "diamondCut") cutDiamondFilled(cx, cy, 1);
      if (coreType === "plusSquareCut") cutPlusSquare(cx, cy);
      if (coreType === "crossDiamond") {
        cutMiniCross(cx, cy);
        addDiamondFilled(cx, cy, 1, A_COL);
      }

      if (p.random() > 0.45) {
        const fillChoice = p.random(["diamond", "square", "cross"]);
        const fillCol = p.random([A_COL, B_COL]);
        if (fillChoice === "diamond") addDiamondFilled(cx, cy, innerR, fillCol);
        if (fillChoice === "square") addSquareFilled(cx, cy, innerR, fillCol);
        if (fillChoice === "cross") addBlockCross(cx, cy, innerR, 1, fillCol);
      }

      const d = outerR + Math.floor(p.random(2, 5));

      if (armType === "cardinalCrosses") {
        addMiniCross(cx, cy - d, A_COL);
        addMiniCross(cx, cy + d, A_COL);
        addMiniCross(cx - d, cy, A_COL);
        addMiniCross(cx + d, cy, A_COL);
      }

      if (armType === "cardinalDiamonds") {
        addDiamondFilled(cx, cy - d, 1, A_COL);
        addDiamondFilled(cx, cy + d, 1, A_COL);
        addDiamondFilled(cx - d, cy, 1, A_COL);
        addDiamondFilled(cx + d, cy, 1, A_COL);
      }

      if (armType === "steppedArms") {
        const len = Math.floor(p.random(2, 5));
        addSteppedArmUp(cx, cy - outerR - 1, len, A_COL);
        addSteppedArmDown(cx, cy + outerR + 1, len, A_COL);
        addSteppedArmLeft(cx - outerR - 1, cy, len, A_COL);
        addSteppedArmRight(cx + outerR + 1, cy, len, A_COL);
      }

      if (armType === "cornerDiamonds") {
        addDiamondFilled(cx - d, cy - d, 1, A_COL);
        addDiamondFilled(cx + d, cy - d, 1, A_COL);
        addDiamondFilled(cx - d, cy + d, 1, A_COL);
        addDiamondFilled(cx + d, cy + d, 1, A_COL);
      }

      if (armType === "cornerCrosses") {
        addMiniCross(cx - d, cy - d, A_COL);
        addMiniCross(cx + d, cy - d, A_COL);
        addMiniCross(cx - d, cy + d, A_COL);
        addMiniCross(cx + d, cy + d, A_COL);
      }

      const d2 = d + Math.floor(p.random(2, 4));

      if (satelliteType === "fourDots") {
        addPixel(cx, cy - d2, B_COL);
        addPixel(cx, cy + d2, B_COL);
        addPixel(cx - d2, cy, B_COL);
        addPixel(cx + d2, cy, B_COL);
      }

      if (satelliteType === "fourDiamonds") {
        addDiamondFilled(cx, cy - d2, 1, B_COL);
        addDiamondFilled(cx, cy + d2, 1, B_COL);
        addDiamondFilled(cx - d2, cy, 1, B_COL);
        addDiamondFilled(cx + d2, cy, 1, B_COL);
      }

      if (satelliteType === "fourCrosses") {
        addMiniCross(cx, cy - d2, B_COL);
        addMiniCross(cx, cy + d2, B_COL);
        addMiniCross(cx - d2, cy, B_COL);
        addMiniCross(cx + d2, cy, B_COL);
      }

      if (satelliteType === "edgeHooks") {
        addHookUp(cx, cy - d2, B_COL);
        addHookDown(cx, cy + d2, B_COL);
        addHookLeft(cx - d2, cy, B_COL);
        addHookRight(cx + d2, cy, B_COL);
      }

      if (p.random() > 0.55) {
        const c = d2 + Math.floor(p.random(1, 4));
        const kind = p.random(["dot", "diamond", "cross"]);
        const col = p.random([A_COL, B_COL]);
        placeCornerSet(cx, cy, c, kind, col);
      }

      sortPixelsForAnimation(cx, cy);
    }

    p.setup = () => {
      p.pixelDensity(1);
      const canvas = p.createCanvas(
        Math.max(1, container.offsetWidth),
        Math.max(1, container.offsetHeight),
      );
      canvas.parent(container);
      canvas.style("display", "block");
      p.noStroke();
      layout();
      generateMotif();
    };

    p.draw = () => {
      const nextWidth = Math.max(1, container.offsetWidth);
      const nextHeight = Math.max(1, container.offsetHeight);
      if (nextWidth !== p.width || nextHeight !== p.height) {
        p.resizeCanvas(nextWidth, nextHeight);
        layout();
      }

      p.clear();

      const limit = Math.min(drawIndex, pixels.length);
      for (let i = 0; i < limit; i += 1) {
        const pixel = pixels[i]!;
        p.fill(pixel.c);
        p.rect(offsetX + pixel.x * cell, offsetY + pixel.y * cell, cell, cell);
      }

      if (drawIndex < pixels.length) {
        drawIndex += PIXELS_PER_FRAME;
        return;
      }

      if (finishedAt === 0) finishedAt = p.millis();
      if (p.millis() - finishedAt > REGENERATE_PAUSE_MS) {
        generateMotif();
      }
    };

    p.keyPressed = () => {
      if (p.key === "r" || p.key === "R") generateMotif();
      if (p.key === "s" || p.key === "S") {
        p.saveCanvas("sadu-motif", "png");
      }
    };

    p.windowResized = () => {
      p.resizeCanvas(
        Math.max(1, container.offsetWidth),
        Math.max(1, container.offsetHeight),
      );
      layout();
    };
  };
}
