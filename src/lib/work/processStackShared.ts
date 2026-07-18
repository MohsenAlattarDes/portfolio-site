export type ProcessStackSpeed = "slow" | "medium" | "fast";

export type ProcessStackDefinition = {
  canvasWidth: number;
  canvasHeight: number;
  fps: number;
  pageScale: number;
  scans: readonly string[];
  rotations: readonly number[];
};

export const PROCESS_STACK_SPEEDS: ProcessStackSpeed[] = [
  "slow",
  "medium",
  "fast",
];

export const PROCESS_STACK_SPEED_PRESETS: Record<
  ProcessStackSpeed,
  { secondsPerPage: number; endHoldSeconds: number; label: string }
> = {
  slow: { secondsPerPage: 1.6, endHoldSeconds: 3, label: "Slow" },
  medium: { secondsPerPage: 0.75, endHoldSeconds: 2, label: "Medium" },
  fast: { secondsPerPage: 0.35, endHoldSeconds: 1, label: "Fast" },
};

export const PROCESS_STACK_IMAGE_FILTER = "saturate(1.05) contrast(1.1)";

export const PROCESS_STACK_LIGHT_SHADOW = {
  offsetX: 0,
  offsetY: 10,
  blur: 22,
  color: "rgba(0, 0, 0, 0.16)",
} as const;

export function pageDrawSize(
  pageWidth: number,
  pageHeight: number,
  pageScale: number,
) {
  const targetWidth = 960;
  const targetHeight = 1240;
  const fitRatio =
    Math.min(targetWidth / pageWidth, targetHeight / pageHeight) || 1;

  return {
    width: pageWidth * fitRatio * pageScale,
    height: pageHeight * fitRatio * pageScale,
  };
}

export function readProcessStackSpeed(
  container: HTMLElement,
): ProcessStackSpeed {
  const value = container.dataset.speed;
  if (value === "slow" || value === "medium" || value === "fast") return value;
  return "medium";
}

export function isLightTheme() {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("data-theme") === "light";
}
