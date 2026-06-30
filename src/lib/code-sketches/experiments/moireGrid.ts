import type p5js from "p5";
import { themeColors } from "@/lib/code-sketches/theme";

type P5 = InstanceType<typeof p5js>;

export function createMoireGrid(container: HTMLElement) {
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
      const spacing = p.map(my, 0, p.height, 6, 22);
      const shiftA = p.map(mx, 0, p.width, -spacing, spacing);
      const shiftB = -shiftA * 1.35;
      const angleA = p.map(my, 0, p.height, -0.06, 0.06);

      p.push();
      p.translate(p.width * 0.5, p.height * 0.5);
      p.rotate(angleA);

      p.stroke(red[0], red[1], red[2], 90);
      p.strokeWeight(1);
      for (let x = -p.width; x < p.width; x += spacing) {
        p.line(x + shiftA, -p.height, x + shiftA, p.height);
      }

      p.stroke(red[0], red[1], red[2], 55);
      for (let x = -p.width; x < p.width; x += spacing) {
        p.line(x + shiftB, -p.height, x + shiftB, p.height);
      }
      p.pop();

      p.noFill();
      p.stroke(red[0], red[1], red[2], 40);
      p.ellipse(mx, my, spacing * 3, spacing * 3);
    };

    p.windowResized = () => {
      p.resizeCanvas(container.offsetWidth, container.offsetHeight);
    };
  };
}
