import type p5js from "p5";
import { themeColors } from "@/lib/code-sketches/theme";

type P5 = InstanceType<typeof p5js>;

export function createLineVolume(container: HTMLElement) {
  return (p: P5) => {
    p.setup = () => {
      p.createCanvas(container.offsetWidth, container.offsetHeight).parent(
        container,
      );
      p.frameRate(30);
    };

    p.draw = () => {
      const { bg, red } = themeColors();
      p.background(bg[0], bg[1], bg[2]);

      const mx = p.constrain(p.mouseX, 0, p.width);
      const my = p.constrain(p.mouseY, 0, p.height);
      const gap = p.map(my, 0, p.height, 3, 18);
      const bend = p.map(mx, 0, p.width, -p.height * 0.35, p.height * 0.35);

      p.strokeWeight(1);
      let i = 0;
      for (let y = 0; y < p.height; y += gap) {
        const t = y / p.height;
        const offset =
          Math.sin(t * p.PI * 2 + p.frameCount * 0.01) * bend * 0.15 +
          bend * (t - 0.5);
        const alpha = 40 + Math.abs(t - my / p.height) * 180;
        p.stroke(red[0], red[1], red[2], alpha);
        p.line(offset, y, p.width + offset, y);
        i++;
      }
    };

    p.windowResized = () => {
      p.resizeCanvas(container.offsetWidth, container.offsetHeight);
    };
  };
}
