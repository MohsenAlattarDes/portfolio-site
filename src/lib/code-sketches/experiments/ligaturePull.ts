import type p5js from "p5";
import { drawTypeFrame } from "@/lib/code-sketches/drawTypeFrame";
import { themeColors } from "@/lib/code-sketches/theme";

type P5 = InstanceType<typeof p5js>;

type Pair = { a: string; b: string; joined: string };

const PAIRS: Pair[] = [
  { a: "f", b: "i", joined: "fi" },
  { a: "f", b: "l", joined: "fl" },
  { a: "T", b: "T", joined: "TT" },
  { a: "ل", b: "ا", joined: "لا" },
  { a: "م", b: "ع", joined: "مع" },
];

export function createLigaturePull(container: HTMLElement) {
  let pairIndex = 0;
  let ax = 0;
  let ay = 0;
  let bx = 0;
  let by = 0;

  function resetPositions(p: P5) {
    ax = p.width * 0.35;
    ay = p.height * 0.5;
    bx = p.width * 0.72;
    by = p.height * 0.5;
  }

  return (p: P5) => {
    p.setup = () => {
      p.createCanvas(container.offsetWidth, container.offsetHeight).parent(
        container,
      );
      p.frameRate(30);
      p.textFont("Tahoma");
      p.textStyle(p.BOLD);
      resetPositions(p);
    };

    p.draw = () => {
      const { bg, red } = themeColors();
      p.background(bg[0], bg[1], bg[2]);

      const mx = p.constrain(p.mouseX, 0, p.width);
      const my = p.constrain(p.mouseY, 0, p.height);
      const pair = PAIRS[pairIndex];
      const snapDist = p.map(my, 0, p.height, 90, 28);
      const size = p.map(mx, 0, p.width, 48, 110);

      const midX = (ax + bx) * 0.5;
      const midY = (ay + by) * 0.5;
      const pull = p.map(
        Math.hypot(mx - midX, my - midY),
        0,
        p.width * 0.45,
        0.22,
        0,
        true,
      );

      ax = p.lerp(ax, p.width * 0.35, pull * 0.08);
      bx = p.lerp(bx, p.width * 0.72, pull * 0.08);
      ax = p.lerp(ax, mx, pull);
      bx = p.lerp(bx, mx, pull);
      ay = p.lerp(ay, my, pull * 0.35);
      by = p.lerp(by, my, pull * 0.35);

      const dist = Math.hypot(ax - bx, ay - by);
      const snapped = dist < snapDist;

      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(size);
      p.fill(red[0], red[1], red[2], 220);

      if (snapped) {
        p.text(pair.joined, (ax + bx) * 0.5, (ay + by) * 0.5);
      } else {
        p.text(pair.a, ax, ay);
        p.text(pair.b, bx, by);
        p.stroke(red[0], red[1], red[2], 40);
        p.strokeWeight(1);
        p.line(ax, ay, bx, by);
        p.noStroke();
      }

      drawTypeFrame(p, red);
    };

    p.mousePressed = () => {
      pairIndex = (pairIndex + 1) % PAIRS.length;
      resetPositions(p);
    };

    p.windowResized = () => {
      p.resizeCanvas(container.offsetWidth, container.offsetHeight);
      resetPositions(p);
    };
  };
}
