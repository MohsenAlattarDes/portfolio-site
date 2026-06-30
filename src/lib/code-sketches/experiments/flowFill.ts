import type p5js from "p5";
import { themeColors } from "@/lib/code-sketches/theme";

type P5 = InstanceType<typeof p5js>;

type Mote = { x: number; y: number };

export function createFlowFill(container: HTMLElement) {
  const motes: Mote[] = [];
  const count = 2800;

  function seed(p: P5) {
    motes.length = 0;
    for (let i = 0; i < count; i++) {
      motes.push({ x: p.random(p.width), y: p.random(p.height) });
    }
  }

  function angleAt(p: P5, x: number, y: number) {
    const mx = p.mouseX;
    const my = p.mouseY;
    const n =
      p.noise(x * 0.004, y * 0.004, p.frameCount * 0.003) * p.TWO_PI * 2;
    const dx = mx - x;
    const dy = my - y;
    const dist = Math.hypot(dx, dy) || 1;
    const pull = p.atan2(dy, dx) * p.map(dist, 0, p.width * 0.5, 0.65, 0, true);
    return n + pull;
  }

  return (p: P5) => {
    p.setup = () => {
      p.createCanvas(container.offsetWidth, container.offsetHeight).parent(
        container,
      );
      p.frameRate(30);
      p.noiseDetail(3);
      seed(p);
    };

    p.draw = () => {
      const { bg, red } = themeColors();
      p.fill(bg[0], bg[1], bg[2], 28);
      p.noStroke();
      p.rect(0, 0, p.width, p.height);

      const step = p.map(p.mouseY, 0, p.height, 2.5, 6);
      p.stroke(red[0], red[1], red[2], 95);
      p.strokeWeight(1);

      for (const m of motes) {
        const a = angleAt(p, m.x, m.y);
        const nx = m.x + Math.cos(a) * step;
        const ny = m.y + Math.sin(a) * step;
        p.line(m.x, m.y, nx, ny);
        m.x = nx;
        m.y = ny;

        if (m.x < 0) m.x = p.width;
        if (m.x > p.width) m.x = 0;
        if (m.y < 0) m.y = p.height;
        if (m.y > p.height) m.y = 0;
      }
    };

    p.windowResized = () => {
      p.resizeCanvas(container.offsetWidth, container.offsetHeight);
      seed(p);
    };
  };
}
