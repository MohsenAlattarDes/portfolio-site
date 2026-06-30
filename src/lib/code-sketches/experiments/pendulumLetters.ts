import type p5js from "p5";
import { themeColors } from "@/lib/code-sketches/theme";

type P5 = InstanceType<typeof p5js>;

const LETTERS = ["A", "G", "T", "M", "R", "ا", "ب", "ت", "س", "م"] as const;

type Pendulum = {
  anchorX: number;
  len: number;
  angle: number;
  vel: number;
  char: string;
};

export function createPendulumLetters(container: HTMLElement) {
  let pendulums: Pendulum[] = [];

  function build(p: P5) {
    const count = Math.min(LETTERS.length, Math.max(6, p.floor(p.width / 90)));
    pendulums = [];
    const gap = p.width / (count + 1);

    for (let i = 0; i < count; i++) {
      pendulums.push({
        anchorX: gap * (i + 1),
        len: p.map(p.height, 200, 500, 90, 180),
        angle: p.random(-0.25, 0.25),
        vel: 0,
        char: LETTERS[i % LETTERS.length],
      });
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

      const mx = p.constrain(p.mouseX, 0, p.width);
      const my = p.constrain(p.mouseY, 0, p.height);
      const pushStrength = p.map(my, 0, p.height, 0.002, 0.012);

      for (const pend of pendulums) {
        const bobX = pend.anchorX + Math.sin(pend.angle) * pend.len;
        const bobY = 28 + Math.cos(pend.angle) * pend.len;
        const dx = bobX - mx;
        const dy = bobY - my;
        const dist = Math.hypot(dx, dy) || 1;
        const force = pushStrength / (dist * 0.02 + 1);

        pend.vel += Math.sin(pend.angle) * -0.0008;
        pend.vel += (dx / dist) * force;
        pend.vel *= 0.985;
        pend.angle += pend.vel;

        p.stroke(red[0], red[1], red[2], 120);
        p.strokeWeight(1);
        p.line(pend.anchorX, 28, bobX, bobY);

        p.noStroke();
        p.fill(red[0], red[1], red[2], 220);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(p.map(my, 0, p.height, 22, 40));
        p.text(pend.char, bobX, bobY);
      }
    };

    p.windowResized = () => {
      p.resizeCanvas(container.offsetWidth, container.offsetHeight);
      build(p);
    };
  };
}
