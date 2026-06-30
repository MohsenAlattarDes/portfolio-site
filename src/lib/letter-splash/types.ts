export type GridPoint = {
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export type Burst = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  size: number;
  life: number;
};

export type Ripple = {
  x: number;
  y: number;
  r: number;
  alpha: number;
};

export type SketchState = {
  grid: GridPoint[];
  cols: number;
  rows: number;
  bursts: Burst[];
  ripples: Ripple[];
  mx: number;
  my: number;
  mxNorm: number;
  myNorm: number;
  mouseSpeed: number;
  cursorChar: string;
  reducedMotion: boolean;
  pointerInside: boolean;
  wasPointerInside: boolean;
  prevMx: number;
  prevMy: number;
};
