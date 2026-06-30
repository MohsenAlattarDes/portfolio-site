import type p5js from "p5";
import { themeColors } from "@/lib/code-sketches/theme";

type P5 = InstanceType<typeof p5js>;

export function createTypePong(container: HTMLElement) {
  const state = {
    ballX: 0,
    ballY: 0,
    ballVX: 0,
    ballVY: 0,
    playerY: 0,
    aiY: 0,
    playerScore: 0,
    aiScore: 0,
    serving: true,
    serveTowardPlayer: true,
  };

  const paddleH = 88;
  const ballSize = 22;

  function resetBall(p: P5, towardPlayer: boolean) {
    state.ballX = p.width * 0.5;
    state.ballY = p.height * 0.5;
    const dir = towardPlayer ? -1 : 1;
    state.ballVX = dir * p.random(4.2, 5.4);
    state.ballVY = p.random(-2.8, 2.8);
    state.serving = false;
  }

  function resetMatch(p: P5) {
    state.playerScore = 0;
    state.aiScore = 0;
    state.playerY = p.height * 0.5;
    state.aiY = p.height * 0.5;
    state.serving = true;
    state.ballX = p.width * 0.5;
    state.ballY = p.height * 0.5;
  }

  return (p: P5) => {
    p.setup = () => {
      p.createCanvas(container.offsetWidth, container.offsetHeight).parent(
        container,
      );
      p.frameRate(60);
      p.textFont("Tahoma");
      p.textStyle(p.BOLD);
      resetMatch(p);
    };

    p.draw = () => {
      const { bg, red } = themeColors();
      p.background(bg[0], bg[1], bg[2]);

      const mx = p.constrain(p.mouseY, paddleH * 0.5, p.height - paddleH * 0.5);
      state.playerY = p.lerp(state.playerY, mx, 0.35);

      const playerX = 44;
      const aiX = p.width - 44;

      if (!state.serving) {
        state.aiY = p.lerp(
          state.aiY,
          p.constrain(state.ballY, paddleH * 0.5, p.height - paddleH * 0.5),
          0.14,
        );

        state.ballX += state.ballVX;
        state.ballY += state.ballVY;

        if (state.ballY < ballSize || state.ballY > p.height - ballSize) {
          state.ballVY *= -1;
          state.ballY = p.constrain(state.ballY, ballSize, p.height - ballSize);
        }

        const hitPlayer =
          state.ballX < playerX + 18 &&
          Math.abs(state.ballY - state.playerY) < paddleH * 0.5;
        const hitAi =
          state.ballX > aiX - 18 &&
          Math.abs(state.ballY - state.aiY) < paddleH * 0.5;

        if (hitPlayer) {
          state.ballVX = Math.abs(state.ballVX) * 1.04;
          state.ballVY += (state.ballY - state.playerY) * 0.06;
        }
        if (hitAi) {
          state.ballVX = -Math.abs(state.ballVX) * 1.04;
          state.ballVY += (state.ballY - state.aiY) * 0.06;
        }

        if (state.ballX < 0) {
          state.aiScore++;
          state.serving = true;
          state.serveTowardPlayer = true;
        }
        if (state.ballX > p.width) {
          state.playerScore++;
          state.serving = true;
          state.serveTowardPlayer = false;
        }
      }

      p.stroke(red[0], red[1], red[2], 35);
      p.strokeWeight(1);
      for (let y = 0; y < p.height; y += 14) {
        p.line(p.width * 0.5, y, p.width * 0.5, y + 7);
      }

      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.fill(red[0], red[1], red[2], 220);
      p.textSize(72);
      p.text("I", playerX, state.playerY);
      p.textSize(68);
      p.text("O", aiX, state.aiY);

      if (state.serving) {
        p.textSize(16);
        p.fill(red[0], red[1], red[2], 160);
        p.text("CLICK TO SERVE", p.width * 0.5, p.height * 0.5 + 48);
      } else {
        p.textSize(ballSize);
        p.text("•", state.ballX, state.ballY);
      }

      p.textSize(42);
      p.textAlign(p.CENTER, p.TOP);
      p.fill(red[0], red[1], red[2]);
      p.text(
        `${state.playerScore} : ${state.aiScore}`,
        p.width * 0.5,
        18,
      );
    };

    p.mousePressed = () => {
      if (state.serving) resetBall(p, state.serveTowardPlayer);
    };

    p.doubleClicked = () => resetMatch(p);

    p.windowResized = () => {
      p.resizeCanvas(container.offsetWidth, container.offsetHeight);
      resetMatch(p);
    };
  };
}
