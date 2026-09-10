import type Lenis from "lenis";

let instance: Lenis | null = null;
const scrollListeners = new Set<() => void>();

function emitScroll() {
  scrollListeners.forEach((listener) => listener());
}

export function setLenis(next: Lenis | null) {
  instance?.off("scroll", emitScroll);
  instance = next;
  instance?.on("scroll", emitScroll);
}

export function getLenis() {
  return instance;
}

export function onSmoothScroll(listener: () => void) {
  scrollListeners.add(listener);
  if (instance) {
    instance.off("scroll", emitScroll);
    instance.on("scroll", emitScroll);
  }
  return () => {
    scrollListeners.delete(listener);
  };
}

export function stopSmoothScroll() {
  instance?.stop();
}

export function startSmoothScroll() {
  instance?.start();
}

export function resetSmoothScroll() {
  instance?.scrollTo(0, { immediate: true });
}
