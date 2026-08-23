import { MOBILE_MQ } from "@/lib/mobile-float-words/constants";
import { createMobileFloatWords } from "@/lib/mobile-float-words/createMobileFloatWords";
import { preloadLatinFont } from "@/lib/sketch-font";

type P5Handle = {
  remove: () => void;
  resizeCanvas: (w: number, h: number) => void;
};

export function mountMobileFloatWords(container: HTMLElement) {
  let destroyed = false;
  let p5Instance: P5Handle | null = null;

  const resizeCanvas = () => {
    if (!p5Instance) return;
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    if (w > 0 && h > 0) p5Instance.resizeCanvas(w, h);
  };

  const boot = async () => {
    if (!window.matchMedia(MOBILE_MQ).matches) return;

    await preloadLatinFont();
    const { default: P5 } = await import("p5");
    if (destroyed) return;

    p5Instance = new P5(createMobileFloatWords(container), container);
    resizeCanvas();
  };

  void boot();

  const mobileMq = window.matchMedia(MOBILE_MQ);

  const onBreakpoint = () => {
    if (!mobileMq.matches) {
      p5Instance?.remove();
      p5Instance = null;
      return;
    }

    if (!p5Instance) void boot();
  };

  const onResize = () => resizeCanvas();

  mobileMq.addEventListener("change", onBreakpoint);
  window.addEventListener("resize", onResize);

  return () => {
    destroyed = true;
    mobileMq.removeEventListener("change", onBreakpoint);
    window.removeEventListener("resize", onResize);
    p5Instance?.remove();
  };
}
