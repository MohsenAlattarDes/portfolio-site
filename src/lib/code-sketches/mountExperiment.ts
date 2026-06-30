import type p5js from "p5";

type P5 = InstanceType<typeof p5js>;
export type SketchFactory = (container: HTMLElement) => (p: P5) => void;

type P5Handle = {
  remove: () => void;
  resizeCanvas: (w: number, h: number) => void;
};

export function mountExperiment(
  container: HTMLElement,
  createSketch: SketchFactory,
) {
  let destroyed = false;
  let p5Instance: P5Handle | null = null;

  const waitForSize = () =>
    new Promise<void>((resolve) => {
      const check = () => {
        if (destroyed) return;
        if (container.offsetWidth > 0 && container.offsetHeight > 0) {
          resolve();
          return;
        }
        requestAnimationFrame(check);
      };
      check();
    });

  const boot = async () => {
    await waitForSize();
    if (destroyed) return;

    const { default: P5 } = await import("p5");
    if (destroyed) return;
    p5Instance = new P5(createSketch(container), container);
  };

  void boot();

  const resizeObserver = new ResizeObserver(() => {
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    if (w > 0 && h > 0) p5Instance?.resizeCanvas(w, h);
  });

  resizeObserver.observe(container);

  return () => {
    destroyed = true;
    resizeObserver.disconnect();
    p5Instance?.remove();
  };
}
