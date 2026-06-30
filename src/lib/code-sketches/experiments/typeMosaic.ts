import type p5js from "p5";
import { wrapIndex } from "@/lib/code-sketches/utils";
import { themeColors } from "@/lib/code-sketches/theme";

type P5 = InstanceType<typeof p5js>;

const WORDS = [
  "MOHSEN",
  "TYPE",
  "BRAND",
  "DESIGN",
  "GRAPHIC",
  "FORM",
  "SYSTEM",
] as const;

export function createTypeMosaic(container: HTMLElement) {
  function resizeToContainer(p: P5) {
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    if (w === 0 || h === 0) return false;
    p.resizeCanvas(w, h);
    return true;
  }

  return (p: P5) => {
    p.setup = () => {
      const canvas = p.createCanvas(1, 1);
      canvas.parent(container);
      p.frameRate(30);
      p.textFont("Tahoma");
      p.textStyle(p.BOLD);
      resizeToContainer(p);
    };

    p.draw = () => {
      if (p.width < 2 || p.height < 2) return;

      const { bg, red } = themeColors();
      p.background(bg[0], bg[1], bg[2]);

      const mx = p.mouseX / p.width - 0.5;
      const my = p.mouseY / p.height - 0.5;
      const stepX = 96;
      const stepY = 42;
      const cols = Math.ceil((p.width + stepX * 2) / stepX);
      const rows = Math.ceil((p.height + stepY * 2) / stepY);

      p.textAlign(p.CENTER, p.CENTER);
      p.noStroke();

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * stepX - stepX * 0.5;
          const y = row * stepY - stepY * 0.5;
          const word = WORDS[wrapIndex(col + row, WORDS.length)];
          const depth = p.noise(col * 0.15, row * 0.15, p.frameCount * 0.008);
          const px = x + mx * depth * 60;
          const py = y + my * depth * 40;
          const size = 11 + depth * 28;
          const rot = (depth - 0.5) * 0.35 + mx * 0.4;

          p.push();
          p.translate(px, py);
          p.rotate(rot);
          p.textSize(size);
          p.fill(red[0], red[1], red[2], 30 + depth * 170);
          p.text(word, 0, 0);
          p.pop();
        }
      }
    };

    p.windowResized = () => resizeToContainer(p);
  };
}
