import type p5js from "p5";
import { createCursorSketch } from "@/lib/cursor/createCursorSketch";

type P5 = InstanceType<typeof p5js>;
type P5Handle = {
  remove: () => void;
  resizeCanvas: (w: number, h: number) => void;
};

export function mountCursorSketch(container: HTMLElement) {
  let destroyed = false;
  let p5Instance: P5Handle | null = null;

  const boot = async () => {
    const { default: P5 } = await import("p5");
    if (destroyed) return;
    p5Instance = new P5(createCursorSketch(container), container);
  };

  void boot();

  const onResize = () => {
    p5Instance?.resizeCanvas(window.innerWidth, window.innerHeight);
  };

  window.addEventListener("resize", onResize);

  return () => {
    destroyed = true;
    window.removeEventListener("resize", onResize);
    p5Instance?.remove();
    p5Instance = null;
  };
}
