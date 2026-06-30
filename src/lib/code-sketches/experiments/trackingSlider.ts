import type p5js from "p5";
import { drawTypeFrame } from "@/lib/code-sketches/drawTypeFrame";
import { themeColors } from "@/lib/code-sketches/theme";

type P5 = InstanceType<typeof p5js>;

const WORD = "TRACKING";

export function createTrackingSlider(container: HTMLElement) {
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
      const tracking = p.map(mx, 0, p.width, -8, 48);
      const size = p.map(my, 0, p.height, 28, 96);
      const inset = 20;

      p.textSize(size);
      p.textAlign(p.LEFT, p.CENTER);
      p.noStroke();
      p.fill(red[0], red[1], red[2], 220);

      const chars = WORD.split("");
      let x = inset + 24;
      const y = p.height * 0.46;

      for (const ch of chars) {
        p.text(ch, x, y);
        x += p.textWidth(ch) + tracking;
      }

      p.fill(red[0], red[1], red[2], 100);
      p.textSize(11);
      p.textStyle(p.NORMAL);
      p.textAlign(p.LEFT, p.TOP);
      p.text(`tracking ${tracking.toFixed(0)}`, inset + 8, inset + 6);
      p.text(`size ${size.toFixed(0)}`, inset + 8, inset + 22);

      drawTypeFrame(p, red);
    };

    p.windowResized = () => {
      p.resizeCanvas(container.offsetWidth, container.offsetHeight);
    };
  };
}
