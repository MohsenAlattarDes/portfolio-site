import type p5js from "p5";

type P5 = InstanceType<typeof p5js>;

export function drawTypeFrame(
  p: P5,
  color: readonly [number, number, number],
  alpha = 130,
) {
  const inset = 20;

  p.noFill();
  p.stroke(color[0], color[1], color[2], alpha);
  p.strokeWeight(1);
  p.line(inset, 0, inset, p.height - inset);
  p.line(0, p.height - inset, p.width, p.height - inset);

  const tick = 6;
  p.line(inset - tick, p.height - inset, inset + tick, p.height - inset);
  p.line(inset, p.height - inset - tick, inset, p.height - inset + tick);
}
