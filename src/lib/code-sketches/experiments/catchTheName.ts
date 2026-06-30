import type p5js from "p5";
import { themeColors } from "@/lib/code-sketches/theme";

type P5 = InstanceType<typeof p5js>;

type Letter = {
  ch: string;
  x: number;
  y: number;
  vy: number;
  caught: boolean;
};

const NAME = "MOHSEN";

export function createCatchTheName(container: HTMLElement) {
  const state = {
    letters: [] as Letter[],
    caught: 0,
    spawnTimer: 0,
    basketX: 0,
    combo: 0,
    done: false,
  };

  function spawnLetter(p: P5) {
    const ch = NAME[p.floor(p.random(NAME.length))];
    state.letters.push({
      ch,
      x: p.random(30, p.width - 30),
      y: -20,
      vy: p.random(2, 4.5),
      caught: false,
    });
  }

  function reset(p: P5) {
    state.letters = [];
    state.caught = 0;
    state.combo = 0;
    state.done = false;
    state.basketX = p.width * 0.5;
    spawnLetter(p);
  }

  return (p: P5) => {
    p.setup = () => {
      p.createCanvas(container.offsetWidth, container.offsetHeight).parent(
        container,
      );
      p.frameRate(60);
      p.textFont("Tahoma");
      p.textStyle(p.BOLD);
      reset(p);
    };

    p.draw = () => {
      const { bg, red } = themeColors();
      p.background(bg[0], bg[1], bg[2]);

      if (!state.done) {
        state.spawnTimer++;
        if (state.spawnTimer % 38 === 0) spawnLetter(p);

        const mx = p.constrain(p.mouseX, 40, p.width - 40);
        state.basketX = p.lerp(state.basketX, mx, 0.45);

        const target = NAME[state.caught % NAME.length];

        for (let i = state.letters.length - 1; i >= 0; i--) {
          const L = state.letters[i];
          L.y += L.vy;

          if (
            !L.caught &&
            L.y > p.height - 56 &&
            Math.abs(L.x - state.basketX) < 44 &&
            L.ch === target
          ) {
            L.caught = true;
            state.caught++;
            state.combo++;
            state.letters.splice(i, 1);
            if (state.caught >= NAME.length) state.done = true;
            continue;
          }

          if (L.y > p.height + 30) {
            state.combo = 0;
            state.letters.splice(i, 1);
          }
        }
      }

      p.noStroke();
      p.fill(red[0], red[1], red[2], 200);
      p.rect(state.basketX - 46, p.height - 36, 92, 14, 6);

      for (const L of state.letters) {
        p.fill(red[0], red[1], red[2], 230);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(28);
        p.text(L.ch, L.x, L.y);
      }

      p.textAlign(p.CENTER, p.TOP);
      p.textSize(14);
      p.fill(red[0], red[1], red[2], 150);
      p.text(
        state.done
          ? "NICE CATCH — MOHSEN COMPLETE"
          : `CATCH: ${NAME.slice(0, state.caught)}_  ·  combo ${state.combo}`,
        p.width * 0.5,
        16,
      );

      if (state.done) {
        p.textSize(12);
        p.text("click to replay", p.width * 0.5, 38);
      }
    };

    p.mousePressed = () => {
      if (state.done) reset(p);
    };

    p.windowResized = () => {
      p.resizeCanvas(container.offsetWidth, container.offsetHeight);
      reset(p);
    };
  };
}
