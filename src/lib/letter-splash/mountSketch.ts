import { DESKTOP_MQ } from "@/lib/letter-splash/constants";
import { preloadHeroFonts } from "@/lib/letter-splash/fonts";
import { createSketch } from "@/lib/letter-splash/createSketch";

type P5Handle = {
  remove: () => void;
  resizeCanvas: (w: number, h: number) => void;
};

export function mountLetterSplash(container: HTMLElement) {
  let destroyed = false;
  let p5Instance: P5Handle | null = null;

  const boot = async () => {
    if (!window.matchMedia(DESKTOP_MQ).matches) return;

    await preloadHeroFonts();

    const { default: P5 } = await import("p5");
    if (destroyed) return;

    p5Instance = new P5(createSketch(container), container);
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
