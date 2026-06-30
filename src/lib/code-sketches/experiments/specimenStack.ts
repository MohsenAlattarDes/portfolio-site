import type p5js from "p5";
import { drawTypeFrame } from "@/lib/code-sketches/drawTypeFrame";
import { themeColors } from "@/lib/code-sketches/theme";

type P5 = InstanceType<typeof p5js>;

const ROWS = [
  { label: "Aa", size: 18, weight: "Book" },
  { label: "Aa", size: 28, weight: "Regular" },
  { label: "Aa", size: 40, weight: "Medium" },
  { label: "Aa", size: 56, weight: "Demi" },
  { label: "Aa", size: 72, weight: "Bold" },
] as const;

export function createSpecimenStack(container: HTMLElement) {
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
      const inset = 20;
      const rowHeight = (p.height - inset - 40) / ROWS.length;

      for (let i = 0; i < ROWS.length; i++) {
        const row = ROWS[i];
        const y = inset + 36 + i * rowHeight + rowHeight * 0.5;
        const dist = Math.abs(my - y);
        const active = dist < rowHeight * 0.45;
        const slide = active ? p.map(mx, 0, p.width, 0, 28) : 0;

        p.noStroke();
        p.textAlign(p.LEFT, p.CENTER);
        p.textStyle(active ? p.BOLD : p.NORMAL);
        p.textSize(10);
        p.fill(red[0], red[1], red[2], active ? 180 : 70);
        p.text(row.weight, inset + 10, y);

        p.textSize(row.size * (active ? 1.08 : 1));
        p.fill(red[0], red[1], red[2], active ? 240 : 110);
        p.text(row.label, inset + 88 + slide, y);

        if (active) {
          p.stroke(red[0], red[1], red[2], 50);
          p.strokeWeight(1);
          p.line(inset + 8, y + rowHeight * 0.38, p.width - 16, y + rowHeight * 0.38);
          p.noStroke();
        }
      }

      drawTypeFrame(p, red);
    };

    p.windowResized = () => {
      p.resizeCanvas(container.offsetWidth, container.offsetHeight);
    };
  };
}
