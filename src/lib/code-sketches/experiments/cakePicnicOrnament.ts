import type p5js from "p5";

type P5 = InstanceType<typeof p5js>;
type InkLayer = ReturnType<P5["createGraphics"]> & {
  elt: HTMLCanvasElement;
  drawingContext: CanvasRenderingContext2D;
};
type TrailPoint = { x: number; y: number };

// Centralized sketch settings
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;
const DURATION_MS = 15_000;
const INK_BLUE = "#095ce7";
const MAX_TRAIL = 14;
const SYMMETRY_COPIES = 2;
const THIN_STROKE = 2.5;
const THICK_STROKE = 9;
const NIB_ANGLE = -Math.PI / 6;
const DRAWING_MARGIN_X = 260;
const DRAWING_MARGIN_Y = 170;

export function createCakePicnicOrnament(container: HTMLElement) {
  return (p: P5) => {
    let inkLayer: InkLayer;
    let penX = 0;
    let penY = 0;
    let directionAngle = 0;
    let startTime = 0;
    let noiseTime = 0;
    let trail: TrailPoint[] = [];

    const scaleX = () => p.width / DESIGN_WIDTH;
    const scaleY = () => p.height / DESIGN_HEIGHT;
    const drawingScale = () => Math.max(0.55, Math.min(scaleX(), scaleY()));
    const marginX = () => DRAWING_MARGIN_X * scaleX();
    const marginY = () => DRAWING_MARGIN_Y * scaleY();

    function hideOffscreenCanvas(layer: InkLayer) {
      layer.elt.style.display = "none";
      layer.elt.setAttribute("aria-hidden", "true");
    }

    function createInkLayer() {
      if (inkLayer) inkLayer.remove();
      inkLayer = p.createGraphics(p.width, p.height) as InkLayer;
      inkLayer.pixelDensity(1);
      hideOffscreenCanvas(inkLayer);
      inkLayer.clear();
    }

    function resetOrnament() {
      const seed = Math.floor(p.random(1_000_000));
      p.randomSeed(seed);
      p.noiseSeed(seed);
      inkLayer.clear();

      penX = p.random(
        marginX() + 40 * scaleX(),
        p.width - marginX() - 40 * scaleX(),
      );
      penY = p.random(
        marginY() + 40 * scaleY(),
        p.height - marginY() - 40 * scaleY(),
      );
      directionAngle = p.random(p.TWO_PI);
      noiseTime = p.random(1000);

      trail = Array.from({ length: 10 }, () => ({ x: penX, y: penY }));
      startTime = p.millis();
      p.loop();
    }

    const host = container as HTMLElement & {
      __caseStudyRegenerate?: () => void;
    };
    host.__caseStudyRegenerate = resetOrnament;

    function strokeCalligraphicSegment(
      ctx: CanvasRenderingContext2D,
      previous: TrailPoint,
      current: TrailPoint,
      next: TrailPoint,
      nextNext: TrailPoint,
      centerX: number,
      centerY: number,
    ) {
      const currentX = current.x - centerX;
      const currentY = current.y - centerY;
      const nextX = next.x - centerX;
      const nextY = next.y - centerY;
      const previousX = previous.x - centerX;
      const previousY = previous.y - centerY;
      const nextNextX = nextNext.x - centerX;
      const nextNextY = nextNext.y - centerY;

      const segmentAngle = Math.atan2(nextY - currentY, nextX - currentX);
      const thicknessAmount = Math.abs(Math.sin(segmentAngle - NIB_ANGLE));
      const segmentStroke = Math.max(
        1.25,
        p.lerp(THIN_STROKE, THICK_STROKE, thicknessAmount) * drawingScale(),
      );

      // Catmull-Rom to cubic Bezier conversion for smooth calligraphy
      const cp1x = currentX + (nextX - previousX) / 6;
      const cp1y = currentY + (nextY - previousY) / 6;
      const cp2x = nextX - (nextNextX - currentX) / 6;
      const cp2y = nextY - (nextNextY - currentY) / 6;

      ctx.lineWidth = segmentStroke;
      ctx.beginPath();
      ctx.moveTo(currentX, currentY);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, nextX, nextY);
      ctx.stroke();
    }

    function drawCalligraphicTrail(
      ctx: CanvasRenderingContext2D,
      centerX: number,
      centerY: number,
    ) {
      for (let pointIndex = 1; pointIndex < trail.length - 2; pointIndex += 1) {
        strokeCalligraphicSegment(
          ctx,
          trail[pointIndex - 1]!,
          trail[pointIndex]!,
          trail[pointIndex + 1]!,
          trail[pointIndex + 2]!,
          centerX,
          centerY,
        );
      }
    }

    function drawSymmetricCurve() {
      const centerX = p.width / 2;
      const centerY = p.height / 2;
      const ctx = inkLayer.drawingContext;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.strokeStyle = INK_BLUE;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let copyIndex = 0; copyIndex < SYMMETRY_COPIES; copyIndex += 1) {
        const rotationAngle = (Math.PI * 2 * copyIndex) / SYMMETRY_COPIES;

        ctx.save();
        ctx.rotate(rotationAngle);
        drawCalligraphicTrail(ctx, centerX, centerY);
        ctx.restore();

        ctx.save();
        ctx.rotate(rotationAngle);
        ctx.scale(-1, 1);
        drawCalligraphicTrail(ctx, centerX, centerY);
        ctx.restore();
      }

      ctx.restore();
    }

    p.setup = () => {
      p.pixelDensity(1);
      const canvas = p.createCanvas(
        Math.max(1, container.offsetWidth),
        Math.max(1, container.offsetHeight),
      );
      canvas.parent(container);
      canvas.style("display", "block");
      p.frameRate(30);
      p.noiseDetail(4, 0.5);
      createInkLayer();
      resetOrnament();
    };

    p.draw = () => {
      const nextWidth = Math.max(1, container.offsetWidth);
      const nextHeight = Math.max(1, container.offsetHeight);
      if (nextWidth !== p.width || nextHeight !== p.height) {
        p.resizeCanvas(nextWidth, nextHeight);
        createInkLayer();
        resetOrnament();
        return;
      }

      p.clear();
      p.image(inkLayer, 0, 0);

      if (p.millis() - startTime > DURATION_MS) {
        resetOrnament();
        return;
      }

      const slowTurn = p.map(p.noise(noiseTime), 0, 1, -0.09, 0.09);
      const wobbleTurn = p.sin(p.frameCount * 0.07) * 0.05;
      directionAngle += slowTurn + wobbleTurn;

      const moveSpeed =
        p.map(p.noise(noiseTime + 500), 0, 1, 2.2, 4.4) * drawingScale();
      penX += p.cos(directionAngle) * moveSpeed;
      penY += p.sin(directionAngle) * moveSpeed;
      noiseTime += 0.01;

      if (penX < marginX() || penX > p.width - marginX()) {
        directionAngle += p.random(0.8, 1.6);
      }
      if (penY < marginY() || penY > p.height - marginY()) {
        directionAngle += p.random(0.8, 1.6);
      }

      penX = p.constrain(penX, marginX(), p.width - marginX());
      penY = p.constrain(penY, marginY(), p.height - marginY());

      trail.push({ x: penX, y: penY });
      if (trail.length > MAX_TRAIL) trail.shift();

      if (p.frameCount % 3 === 0 && trail.length >= 7) {
        drawSymmetricCurve();
      }
    };

    p.keyPressed = () => {
      if (p.key === "r" || p.key === "R") resetOrnament();
      if (p.key === "s" || p.key === "S") {
        p.saveCanvas("cake-picnic-ornament", "png");
      }
    };

    p.windowResized = () => {
      p.resizeCanvas(
        Math.max(1, container.offsetWidth),
        Math.max(1, container.offsetHeight),
      );
      createInkLayer();
      resetOrnament();
    };
  };
}
