import type p5js from "p5";
import { themeColors } from "@/lib/code-sketches/theme";

type P5 = InstanceType<typeof p5js>;

type Brick = { ch: string; x: number; y: number; alive: boolean };

const WORD = "HIRE ME";

export function createHireMeBreakout(container: HTMLElement) {
  const state = {
    bricks: [] as Brick[],
    ballX: 0,
    ballY: 0,
    ballVX: 0,
    ballVY: 0,
    paddleX: 0,
    launched: false,
    won: false,
  };

  function buildBricks(p: P5) {
    state.bricks = [];
    const chars = WORD.split("");
    const gap = 8;
    const brickW = (p.width - gap * (chars.length + 1)) / chars.length;
    const brickH = 36;
    const y = 56;

    chars.forEach((ch, i) => {
      state.bricks.push({
        ch,
        x: gap + i * (brickW + gap),
        y,
        alive: true,
      });
    });
  }

  function reset(p: P5) {
    buildBricks(p);
    state.paddleX = p.width * 0.5;
    state.ballX = p.width * 0.5;
    state.ballY = p.height - 48;
    state.ballVX = p.random(-3, 3);
    state.ballVY = -5;
    state.launched = false;
    state.won = false;
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

      const mx = p.constrain(p.mouseX, 50, p.width - 50);
      state.paddleX = p.lerp(state.paddleX, mx, 0.4);

      if (!state.launched && !state.won) {
        state.ballX = state.paddleX;
        state.ballY = p.height - 52;
      } else if (!state.won) {
        state.ballX += state.ballVX;
        state.ballY += state.ballVY;

        if (state.ballX < 10 || state.ballX > p.width - 10) state.ballVX *= -1;
        if (state.ballY < 10) state.ballVY *= -1;

        if (state.ballY > p.height - 36) {
          if (Math.abs(state.ballX - state.paddleX) < 52) {
            state.ballVY = -Math.abs(state.ballVY);
            state.ballVX += (state.ballX - state.paddleX) * 0.08;
          } else {
            state.launched = false;
          }
        }

        for (const brick of state.bricks) {
          if (!brick.alive) continue;
          const chars = WORD.split("");
          const gap = 8;
          const brickW = (p.width - gap * (chars.length + 1)) / chars.length;
          if (
            state.ballX > brick.x &&
            state.ballX < brick.x + brickW &&
            state.ballY > brick.y &&
            state.ballY < brick.y + 36
          ) {
            brick.alive = false;
            state.ballVY *= -1;
          }
        }

        if (state.bricks.every((b) => !b.alive)) state.won = true;
      }

      const gap = 8;
      const chars = WORD.split("");
      const brickW = (p.width - gap * (chars.length + 1)) / chars.length;

      for (const brick of state.bricks) {
        if (!brick.alive) continue;
        p.noFill();
        p.stroke(red[0], red[1], red[2], 200);
        p.strokeWeight(2);
        p.rect(brick.x, brick.y, brickW, 36, 4);
        p.noStroke();
        p.fill(red[0], red[1], red[2], 220);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(20);
        p.text(brick.ch, brick.x + brickW * 0.5, brick.y + 18);
      }

      p.fill(red[0], red[1], red[2], 230);
      p.rect(state.paddleX - 50, p.height - 28, 100, 10, 4);

      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(18);
      p.text("•", state.ballX, state.ballY);

      if (!state.launched && !state.won) {
        p.textSize(14);
        p.fill(red[0], red[1], red[2], 150);
        p.text("CLICK TO LAUNCH", p.width * 0.5, p.height * 0.62);
      }
      if (state.won) {
        p.textSize(28);
        p.fill(red[0], red[1], red[2]);
        p.text("YOU HIRED ME!", p.width * 0.5, p.height * 0.55);
        p.textSize(13);
        p.text("click to play again", p.width * 0.5, p.height * 0.62);
      }
    };

    p.mousePressed = () => {
      if (state.won) {
        reset(p);
        return;
      }
      if (!state.launched) state.launched = true;
    };

    p.windowResized = () => {
      p.resizeCanvas(container.offsetWidth, container.offsetHeight);
      reset(p);
    };
  };
}
