import type p5js from "p5";
import { GLYPHS } from "@/lib/letter-splash/constants";
import { themeColors } from "@/lib/code-sketches/theme";

type P5 = InstanceType<typeof p5js>;

type TrailPoint = {
  x: number;
  y: number;
  char: string;
  life: number;
  rot: number;
};

export function createTypographicTrail(container: HTMLElement) {
  const state = {
    trail: [] as TrailPoint[],
    cursorChar: GLYPHS[0] as string,
    prevMx: 0,
    prevMy: 0,
  };

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
      p.fill(bg[0], bg[1], bg[2], 48);
      p.noStroke();
      p.rect(0, 0, p.width, p.height);

      const mx = p.constrain(p.mouseX, 0, p.width);
      const my = p.constrain(p.mouseY, 0, p.height);
      const speed = Math.hypot(mx - state.prevMx, my - state.prevMy);

      if (speed > 1.5 && p.frameCount % 2 === 0) {
        if (p.frameCount % 12 === 0) {
          state.cursorChar = GLYPHS[p.floor(p.random(GLYPHS.length))];
        }
        state.trail.push({
          x: mx,
          y: my,
          char: state.cursorChar,
          life: 1,
          rot: p.map(mx, 0, p.width, -0.6, 0.6),
        });
        if (state.trail.length > 48) state.trail.shift();
      }

      state.prevMx = mx;
      state.prevMy = my;

      for (let i = state.trail.length - 1; i >= 0; i--) {
        const pt = state.trail[i];
        pt.life -= 0.02;
        if (pt.life <= 0) {
          state.trail.splice(i, 1);
          continue;
        }

        p.push();
        p.translate(pt.x, pt.y);
        p.rotate(pt.rot + (1 - pt.life) * p.PI * 0.25);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(p.map(my, 0, p.height, 16, 36) * pt.life);
        p.noStroke();
        p.fill(red[0], red[1], red[2], 220 * pt.life);
        p.text(pt.char, 0, 0);
        p.pop();
      }

      p.push();
      p.translate(mx, my);
      p.rotate(p.map(mx, 0, p.width, -0.2, 0.2));
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(p.map(my, 0, p.height, 28, 48));
      p.fill(red[0], red[1], red[2]);
      p.text(state.cursorChar, 0, 0);
      p.pop();
    };

    p.windowResized = () => {
      p.resizeCanvas(container.offsetWidth, container.offsetHeight);
    };
  };
}
