import {
  PROCESS_STACK_SPEED_PRESETS,
  PROCESS_STACK_SPEEDS,
  type ProcessStackDefinition,
  type ProcessStackSpeed,
} from "@/lib/work/processStackShared";

export type AnoraStackSpeed = ProcessStackSpeed;

export const ANORA_STACK_SPEEDS = PROCESS_STACK_SPEEDS;
export const ANORA_STACK_SPEED_PRESETS = PROCESS_STACK_SPEED_PRESETS;

export {
  PROCESS_STACK_IMAGE_FILTER as ANORA_PROCESS_IMAGE_FILTER,
  PROCESS_STACK_LIGHT_SHADOW as ANORA_PROCESS_LIGHT_SHADOW,
  isLightTheme,
  pageDrawSize,
  readProcessStackSpeed as readAnoraStackSpeed,
} from "@/lib/work/processStackShared";

export const ANORA_PROCESS_STACK: ProcessStackDefinition = {
  canvasWidth: 1350,
  canvasHeight: 1750,
  fps: 30,
  pageScale: 0.94,
  scans: Array.from({ length: 23 }, (_, index) =>
    `/work/anora/scans-web/${String(index).padStart(2, "0")}.webp`,
  ),
  rotations: [
    -1.6731, 3.3215, -2.1204, -2.8986, -1.0859, 5.6424, 3.2081, 0.7349,
    -3.3547, -3.7132, -3.1057, 2.3777, 2.6655, 5.4866, -4.7735, -4.8394,
    -1.2447, -2.7568, 5.6774, -5.0544, 3.9529, -0.9282, 5.4501,
  ],
};
