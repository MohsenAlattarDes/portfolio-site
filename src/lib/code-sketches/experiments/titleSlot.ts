import type p5js from "p5";
import { themeColors } from "@/lib/code-sketches/theme";

type P5 = InstanceType<typeof p5js>;

const LEFT = ["Graphic", "Brand", "Type", "Motion", "UX/UI", "Design"] as const;
const RIGHT = ["Designer", "Strategist", "Coder", "Researcher"] as const;

export function createTitleSlot(container: HTMLElement) {
  const state = {
    spinning: false,
    leftOffset: 0,
    rightOffset: 0,
    leftSpeed: 0,
    rightSpeed: 0,
    resultLeft: 0,
    resultRight: 0,
  };

  function spin() {
    state.spinning = true;
    state.leftSpeed = 0.55 + Math.random() * 0.35;
    state.rightSpeed = 0.7 + Math.random() * 0.45;
    state.resultLeft = Math.floor(Math.random() * LEFT.length);
    state.resultRight = Math.floor(Math.random() * RIGHT.length);
  }

  return (p: P5) => {
    p.setup = () => {
      p.createCanvas(container.offsetWidth, container.offsetHeight).parent(
        container,
      );
      p.frameRate(60);
      p.textFont("Tahoma");
      p.textStyle(p.BOLD);
    };

    p.draw = () => {
      const { bg, red } = themeColors();
      p.background(bg[0], bg[1], bg[2]);

      if (state.spinning) {
        state.leftOffset += state.leftSpeed;
        state.rightOffset += state.rightSpeed;
        state.leftSpeed *= 0.965;
        state.rightSpeed *= 0.958;

        if (state.leftSpeed < 0.04 && state.rightSpeed < 0.04) {
          state.spinning = false;
          state.leftOffset = state.resultLeft;
          state.rightOffset = state.resultRight;
        }
      }

      const cx = p.width * 0.5;
      const cy = p.height * 0.5;
      const rowH = 52;

      p.noFill();
      p.stroke(red[0], red[1], red[2], 80);
      p.strokeWeight(2);
      p.rect(cx - 220, cy - rowH * 1.1, 440, rowH * 2.2, 6);

      p.stroke(red[0], red[1], red[2], 30);
      p.line(cx - 200, cy - rowH * 0.15, cx + 200, cy - rowH * 0.15);
      p.line(cx - 200, cy + rowH * 0.85, cx + 200, cy + rowH * 0.85);

      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);

      const leftIdx =
        Math.floor(state.leftOffset) % LEFT.length;
      const rightIdx =
        Math.floor(state.rightOffset) % RIGHT.length;

      p.fill(red[0], red[1], red[2], state.spinning ? 180 : 255);
      p.textSize(34);
      p.text(LEFT[(leftIdx + LEFT.length) % LEFT.length], cx - 72, cy);
      p.textSize(12);
      p.fill(red[0], red[1], red[2], 120);
      p.text("+", cx, cy);
      p.fill(red[0], red[1], red[2], state.spinning ? 180 : 255);
      p.textSize(34);
      p.text(RIGHT[(rightIdx + RIGHT.length) % RIGHT.length], cx + 92, cy);

      if (!state.spinning) {
        p.textSize(13);
        p.fill(red[0], red[1], red[2], 140);
        p.text("CLICK TO SPIN AGAIN", cx, cy + 72);
      } else {
        p.textSize(13);
        p.text("SPINNING…", cx, cy + 72);
      }
    };

    p.mousePressed = () => {
      if (!state.spinning) spin();
    };

    p.windowResized = () => {
      p.resizeCanvas(container.offsetWidth, container.offsetHeight);
    };
  };
}
