import type p5js from "p5";
import { themeColors } from "@/lib/code-sketches/theme";

type P5 = InstanceType<typeof p5js>;

type Bubble = {
  label: string;
  x: number;
  y: number;
  r: number;
  vy: number;
  pop: number;
};

const SKILLS = [
  "Type",
  "Brand",
  "Motion",
  "Figma",
  "Print",
  "Arabic",
  "Logo",
  "UX",
  "Packaging",
  "Code",
] as const;

export function createSkillPop(container: HTMLElement) {
  const bubbles: Bubble[] = [];
  let spawnTimer = 0;

  function spawn(p: P5) {
    const label = SKILLS[p.floor(p.random(SKILLS.length))];
    bubbles.push({
      label,
      x: p.random(40, p.width - 40),
      y: p.height + 30,
      r: p.random(28, 48),
      vy: p.random(-1.2, -0.5),
      pop: 0,
    });
  }

  return (p: P5) => {
    p.setup = () => {
      p.createCanvas(container.offsetWidth, container.offsetHeight).parent(
        container,
      );
      p.frameRate(60);
      p.textFont("Tahoma");
      p.textStyle(p.BOLD);
      for (let i = 0; i < 6; i++) spawn(p);
    };

    p.draw = () => {
      const { bg, red } = themeColors();
      p.background(bg[0], bg[1], bg[2]);

      spawnTimer++;
      if (spawnTimer % 45 === 0 && bubbles.length < 14) spawn(p);

      const mx = p.mouseX;
      const my = p.mouseY;

      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        if (b.pop > 0) {
          b.pop += 0.08;
          if (b.pop >= 1) {
            bubbles.splice(i, 1);
            continue;
          }
        } else {
          b.y += b.vy;
          const dist = Math.hypot(mx - b.x, my - b.y);
          if (dist < b.r + 8) b.pop = 0.01;
          if (b.y < -60) {
            bubbles.splice(i, 1);
            continue;
          }
        }

        const scale = b.pop > 0 ? 1 + b.pop * 0.6 : 1;
        const alpha = b.pop > 0 ? 255 * (1 - b.pop) : 220;

        p.noFill();
        p.stroke(red[0], red[1], red[2], alpha);
        p.strokeWeight(2);
        p.ellipse(b.x, b.y, b.r * 2 * scale, b.r * 2 * scale);

        p.noStroke();
        p.fill(red[0], red[1], red[2], alpha);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(b.r * 0.55);
        p.text(b.label, b.x, b.y);
      }

      p.textSize(13);
      p.fill(red[0], red[1], red[2], 120);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text("HOVER TO POP SKILLS", p.width * 0.5, p.height - 12);
    };

    p.mousePressed = () => {
      for (const b of bubbles) {
        if (Math.hypot(p.mouseX - b.x, p.mouseY - b.y) < b.r + 10) {
          b.pop = 0.01;
        }
      }
    };

    p.windowResized = () => {
      p.resizeCanvas(container.offsetWidth, container.offsetHeight);
    };
  };
}
