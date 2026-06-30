import type p5js from "p5";
import { drawTypeFrame } from "@/lib/code-sketches/drawTypeFrame";
import { themeColors } from "@/lib/code-sketches/theme";

type P5 = InstanceType<typeof p5js>;

const LINE = "Typography is a craft of rhythm and measure.";

export function createBaselineGrid(container: HTMLElement) {
  return (p: P5) => {
    p.setup = () => {
      p.createCanvas(container.offsetWidth, container.offsetHeight).parent(
        container,
      );
      p.frameRate(30);
      p.textFont("Tahoma");
    };

    p.draw = () => {
      const { bg, red } = themeColors();
      p.background(bg[0], bg[1], bg[2]);

      const mx = p.constrain(p.mouseX, 0, p.width);
      const my = p.constrain(p.mouseY, 0, p.height);
      const leading = p.map(my, 0, p.height, 28, 72);
      const skew = p.map(mx, 0, p.width, -0.35, 0.35);
      const inset = 20;
      const startY = p.height - inset - leading * 2;

      p.stroke(red[0], red[1], red[2], 35);
      p.strokeWeight(1);
      for (let y = startY; y > inset; y -= leading) {
        p.line(inset + 8, y, p.width - 16, y);
      }

      p.stroke(red[0], red[1], red[2], 90);
      p.line(inset + 8, startY, p.width - 16, startY);

      p.noStroke();
      p.fill(red[0], red[1], red[2], 220);
      p.textSize(p.map(mx, 0, p.width, 14, 28));
      p.textStyle(p.NORMAL);
      p.textAlign(p.LEFT, p.BASELINE);

      p.push();
      p.translate(inset + 12, startY);
      p.shearX(skew);
      p.text(LINE, 0, 0);
      p.pop();

      drawTypeFrame(p, red);
    };

    p.windowResized = () => {
      p.resizeCanvas(container.offsetWidth, container.offsetHeight);
    };
  };
}
