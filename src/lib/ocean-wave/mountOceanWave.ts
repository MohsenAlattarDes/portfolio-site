import { DESKTOP_MQ } from "@/lib/ocean-wave/constants";
import { createOceanWave } from "@/lib/ocean-wave/createOceanWave";

type P5Handle = {
  remove: () => void;
  resizeCanvas: (w: number, h: number) => void;
};

export function mountOceanWave(container: HTMLElement) {
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
    if (!window.matchMedia(DESKTOP_MQ).matches) return;

    await waitForSize();
    if (destroyed) return;

    const { default: P5 } = await import("p5");
    if (destroyed) return;

    p5Instance = new P5(createOceanWave(container), container);
  };

  void boot();

  const desktopMq = window.matchMedia(DESKTOP_MQ);

  const resizeObserver = new ResizeObserver(() => {
    if (!desktopMq.matches) {
      p5Instance?.remove();
      p5Instance = null;
      return;
    }

    if (!p5Instance) {
      void boot();
      return;
    }

    const w = container.offsetWidth;
    const h = container.offsetHeight;
    if (w > 0 && h > 0) p5Instance.resizeCanvas(w, h);
  });

  const onBreakpoint = () => {
    if (!desktopMq.matches) {
      p5Instance?.remove();
      p5Instance = null;
      return;
    }

    if (!p5Instance) void boot();
  };

  desktopMq.addEventListener("change", onBreakpoint);
  resizeObserver.observe(container);

  return () => {
    destroyed = true;
    desktopMq.removeEventListener("change", onBreakpoint);
    resizeObserver.disconnect();
    p5Instance?.remove();
  };
}
