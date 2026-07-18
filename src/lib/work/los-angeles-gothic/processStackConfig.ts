import type { ProcessStackDefinition } from "@/lib/work/processStackShared";

export const LAG_PROCESS_STACK: ProcessStackDefinition = {
  canvasWidth: 1350,
  canvasHeight: 1750,
  fps: 30,
  pageScale: 0.94,
  scans: Array.from({ length: 10 }, (_, index) =>
    `/work/los-angeles-gothic/scans/${String(index).padStart(2, "0")}.jpg`,
  ),
  rotations: [
    -2.184, 3.912, -1.447, 4.653, -3.821, 2.145, -4.276, 1.738, 5.102, -0.864,
  ],
};
