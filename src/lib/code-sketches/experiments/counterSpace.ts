import type p5js from "p5";
import { drawTypeFrame } from "@/lib/code-sketches/drawTypeFrame";
import { themeColors } from "@/lib/code-sketches/theme";

type P5 = InstanceType<typeof p5js>;

const SPECIMENS = ["O", "D", "B", "م", "ه"] as const;

export function createCounterSpace(container: HTMLElement) {
  let index = 0;

  return (p: P5) => {
    p.setup = () => {
      p.createCanvas(container.offsetWidth, container.offsetHeight).parent(
        container,
      );
      p.frameRate(30);
      p.textFont("Tahoma");
      p.textStyle(p.BOLD);
    };

    p.draw = () => {
      const { bg, red } = themeColors();
      p.background(bg[0], bg[1], bg[2]);

      const mx = p.constrain(p.mouseX, 0, p.width);
      const my = p.constrain(p.mouseY, 0, p.height);
      const glyph = SPECIMENS[index];
      const cx = p.width * 0.58;
      const cy = p.height * 0.46;
      const outer = p.map(my, 0, p.height, 120, 260);
      const innerScale = p.map(
        Math.hypot(mx - cx, my - cy),
        0,
        p.width * 0.4,
        0.15,
        0.72,
        true,
      );

      p.noStroke();
      p.fill(red[0], red[1], red[2], 220);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(outer);
      p.text(glyph, cx, cy);

      p.fill(bg[0], bg[1], bg[2]);
      p.textSize(outer * innerScale);
      p.text(glyph, cx, cy);

      p.noFill();
      p.stroke(red[0], red[1], red[2], 50);
      p.strokeWeight(1);
      p.ellipse(mx, my, 24, 24);

      p.noStroke();
      p.fill(red[0], red[1], red[2], 140);
      p.textAlign(p.LEFT, p.TOP);
      p.textSize(11);
      p.textStyle(p.NORMAL);
      p.text("counter scale", 28, 28);
      p.text(glyph, 28, 44);

      drawTypeFrame(p, red);
    };

    p.mousePressed = () => {
      index = (index + 1) % SPECIMENS.length;
    };

    p.windowResized = () => {
      p.resizeCanvas(container.offsetWidth, container.offsetHeight);
    };
  };
}
