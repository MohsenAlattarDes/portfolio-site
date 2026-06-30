import type p5js from "p5";
import { GLYPHS } from "@/lib/letter-splash/constants";
import { themeColors } from "@/lib/code-sketches/theme";

type P5 = InstanceType<typeof p5js>;

type Cell = {
  gx: number;
  gy: number;
  char: string;
  phase: number;
};

export function createGlyphField(container: HTMLElement) {
  let cells: Cell[] = [];

  function build(p: P5) {
    cells = [];
    const step = 22;
    const cols = Math.ceil(p.width / step) + 1;
    const rows = Math.ceil(p.height / step) + 1;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        cells.push({
          gx: x * step,
          gy: y * step,
          char: GLYPHS[p.floor(p.random(GLYPHS.length))],
          phase: p.random(p.TWO_PI),
        });
      }
    }
  }

  return (p: P5) => {
    p.setup = () => {
      p.createCanvas(container.offsetWidth, container.offsetHeight).parent(
        container,
      );
      p.frameRate(30);
      p.textFont("Tahoma");
      p.textStyle(p.BOLD);
      build(p);
    };

    p.draw = () => {
      const { bg, red } = themeColors();
      p.background(bg[0], bg[1], bg[2]);

      const mx = p.mouseX;
      const my = p.mouseY;
      const t = p.frameCount * 0.02;

      p.textAlign(p.CENTER, p.CENTER);
      p.noStroke();

      for (const cell of cells) {
        const dx = cell.gx - mx;
        const dy = cell.gy - my;
        const dist = Math.hypot(dx, dy) || 1;
        const pull = p.map(dist, 0, p.width * 0.55, 1, 0, true);
        const x = cell.gx + (dx / dist) * pull * 18;
        const y = cell.gy + (dy / dist) * pull * 18;
        const size = 10 + pull * 20;
        const rot = pull * 0.8 + Math.sin(t + cell.phase) * 0.08;

        p.push();
        p.translate(x, y);
        p.rotate(rot);
        p.textSize(size);
        p.fill(red[0], red[1], red[2], 35 + pull * 180);
        p.text(cell.char, 0, 0);
        p.pop();
      }
    };

    p.windowResized = () => {
      p.resizeCanvas(container.offsetWidth, container.offsetHeight);
      build(p);
    };
  };
}
