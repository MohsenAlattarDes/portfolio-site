import type p5js from "p5";
import { themeColors } from "@/lib/code-sketches/theme";

type P5 = InstanceType<typeof p5js>;

type Filing = { x: number; y: number };

export function createMagneticFilings(container: HTMLElement) {
  let filings: Filing[] = [];

  function buildFilings(p: P5) {
    filings = [];
    const step = 18;
    for (let y = step * 0.5; y < p.height; y += step) {
      for (let x = step * 0.5; x < p.width; x += step) {
        filings.push({ x, y });
      }
    }
  }

  return (p: P5) => {
    p.setup = () => {
      p.createCanvas(container.offsetWidth, container.offsetHeight).parent(
        container,
      );
      p.frameRate(30);
      buildFilings(p);
    };

    p.draw = () => {
      const { bg, red } = themeColors();
      p.background(bg[0], bg[1], bg[2]);

      const mx = p.constrain(p.mouseX, 0, p.width);
      const my = p.constrain(p.mouseY, 0, p.height);
      const field = p.map(my, 0, p.height, 0.35, 1);
      const jitter = p.map(p.mouseX, 0, p.width, 0, 0.35);
      const length = p.map(my, 0, p.height, 7, 14);

      p.stroke(red[0], red[1], red[2], 170);
      p.strokeWeight(1.2);

      for (const f of filings) {
        const dx = mx - f.x;
        const dy = my - f.y;
        const angle =
          p.atan2(dy, dx) + p.random(-jitter, jitter) * (1 - field * 0.5);
        const x2 = f.x + Math.cos(angle) * length * field;
        const y2 = f.y + Math.sin(angle) * length * field;
        p.line(f.x, f.y, x2, y2);
      }
    };

    p.windowResized = () => {
      p.resizeCanvas(container.offsetWidth, container.offsetHeight);
      buildFilings(p);
    };
  };
}
