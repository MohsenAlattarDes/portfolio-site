import type p5js from "p5";
import { themeColors } from "@/lib/code-sketches/theme";

type P5 = InstanceType<typeof p5js>;

const PHRASE = "GRAPHIC TYPE DESIGN";

export function createKerningField(container: HTMLElement) {
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
      const spread = p.map(my, 0, p.height, 0.4, 2.2);
      const baseSize = p.map(mx, 0, p.width, 22, 52);

      p.textAlign(p.CENTER, p.CENTER);
      p.noStroke();

      const chars = PHRASE.split("");
      const widths = chars.map((ch) => {
        p.textSize(baseSize);
        return p.textWidth(ch);
      });
      const total =
        widths.reduce((sum, w) => sum + w, 0) +
        (chars.length - 1) * baseSize * 0.08 * spread;

      let x = p.width * 0.5 - total * 0.5;

      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        const cx = x + widths[i] * 0.5;
        const dist = Math.abs(mx - cx);
        const influence = p.map(dist, 0, p.width * 0.35, 1, 0, true);
        const size = baseSize + influence * p.map(my, 0, p.height, 8, 36);
        const y = p.height * 0.5 + (mx - cx) * 0.04 * spread;

        p.textSize(size);
        p.fill(red[0], red[1], red[2], 120 + influence * 135);
        p.text(ch, cx, y);

        x += widths[i] + baseSize * 0.08 * spread;
      }
    };

    p.windowResized = () => {
      p.resizeCanvas(container.offsetWidth, container.offsetHeight);
    };
  };
}
