import type p5js from "p5";
import {
  PROCESS_STACK_IMAGE_FILTER,
  PROCESS_STACK_LIGHT_SHADOW,
  PROCESS_STACK_SPEED_PRESETS,
  isLightTheme,
  pageDrawSize,
  readProcessStackSpeed,
  type ProcessStackDefinition,
  type ProcessStackSpeed,
} from "@/lib/work/processStackShared";
import { ANORA_PROCESS_STACK } from "@/lib/work/anora/processStackConfig";
import { LAG_PROCESS_STACK } from "@/lib/work/los-angeles-gothic/processStackConfig";

type P5 = InstanceType<typeof p5js>;
type StackPage = Awaited<ReturnType<typeof loadImages>>[number];

function isMobileViewport() {
  return typeof window !== "undefined" && window.innerWidth <= 992;
}

function targetPixelDensity() {
  if (typeof window === "undefined") return 1;
  const dpr = window.devicePixelRatio || 1;
  // Keep retina sharpness on phones; prefer 2x over forcing 1 (looks soft).
  if (isMobileViewport()) return Math.min(2, dpr);
  return Math.min(1.5, dpr);
}

function stackRenderScale() {
  return 1;
}

function shouldDownsampleSources(scanCount: number) {
  // Only downsample when holding many bitmaps (Anora-scale stacks).
  return isMobileViewport() && scanCount > 12;
}

function stageSize(
  stack: ProcessStackDefinition,
  renderScale: number,
) {
  return {
    stageWidth: stack.canvasWidth * renderScale,
    stageHeight: stack.canvasHeight * renderScale,
  };
}

function fitStageScale(
  p: P5,
  stageWidth: number,
  stageHeight: number,
) {
  return Math.min(p.width / stageWidth, p.height / stageHeight);
}

async function loadImages(
  p: P5,
  sources: readonly string[],
  downsample: boolean,
) {
  const images = await Promise.all(sources.map((src) => p.loadImage(src)));
  if (!downsample) return images;

  for (const image of images) {
    image.resize(
      Math.max(1, Math.floor(image.width * 0.5)),
      Math.max(1, Math.floor(image.height * 0.5)),
    );
  }

  return images;
}

function setHighQualitySmoothing(ctx: CanvasRenderingContext2D) {
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
}

function resetCanvasEffects(ctx: CanvasRenderingContext2D) {
  ctx.filter = "none";
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";
}

function drawStackPage(
  p: P5,
  stack: ProcessStackDefinition,
  page: StackPage,
  step: number,
  lightMode: boolean,
  renderScale: number,
) {
  const { rotations, pageScale } = stack;
  const { stageWidth, stageHeight } = stageSize(stack, renderScale);
  const { width: drawW, height: drawH } = pageDrawSize(
    page.width,
    page.height,
    pageScale * renderScale,
  );
  const ctx = p.drawingContext as CanvasRenderingContext2D;

  p.push();
  p.translate(p.width / 2, p.height / 2);
  p.scale(fitStageScale(p, stageWidth, stageHeight));
  p.rotate(p.radians(rotations[step] ?? 0));
  p.imageMode(p.CENTER);
  setHighQualitySmoothing(ctx);

  ctx.filter = PROCESS_STACK_IMAGE_FILTER;
  if (lightMode) {
    ctx.shadowOffsetX = PROCESS_STACK_LIGHT_SHADOW.offsetX;
    ctx.shadowOffsetY = PROCESS_STACK_LIGHT_SHADOW.offsetY;
    ctx.shadowBlur = PROCESS_STACK_LIGHT_SHADOW.blur;
    ctx.shadowColor = PROCESS_STACK_LIGHT_SHADOW.color;
  }

  p.image(page, 0, 0, drawW, drawH);
  resetCanvasEffects(ctx);
  p.pop();
}

export function createProcessStack(stack: ProcessStackDefinition) {
  return (container: HTMLElement) => {
    return (p: P5) => {
      const { fps, scans } = stack;

      const pages: StackPage[] = [];
      let ready = false;
      let playbackFrame = 0;
      let activeSpeed: ProcessStackSpeed = readProcessStackSpeed(container);
      let activeLightMode = isLightTheme();
      let renderScale = stackRenderScale();

      p.setup = () => {
        p.pixelDensity(targetPixelDensity());
        p.createCanvas(container.offsetWidth, container.offsetHeight).parent(
          container,
        );
        setHighQualitySmoothing(p.drawingContext as CanvasRenderingContext2D);
        p.frameRate(fps);
        p.noLoop();
        p.clear();

        void (async () => {
          const downsample = shouldDownsampleSources(scans.length);
          activeLightMode = isLightTheme();
          renderScale = stackRenderScale();

          // Show the stack as soon as the first scans arrive, then keep
          // appending so the animation grows while the rest download.
          for (const src of scans) {
            const [page] = await loadImages(p, [src], downsample);
            if (!page) continue;
            pages.push(page);
            if (!ready) {
              ready = true;
              p.loop();
            }
          }
        })().catch(() => {
          if (!ready) p.noLoop();
        });
      };

      p.draw = () => {
        if (!ready || pages.length === 0) return;

        const speed = readProcessStackSpeed(container);
        if (speed !== activeSpeed) {
          activeSpeed = speed;
          playbackFrame = 0;
        }

        const lightMode = isLightTheme();
        if (lightMode !== activeLightMode) {
          activeLightMode = lightMode;
          playbackFrame = 0;
        }

        const { secondsPerPage, endHoldSeconds } =
          PROCESS_STACK_SPEED_PRESETS[speed];
        const framesPerPage = Math.max(1, Math.round(secondsPerPage * fps));
        const endHoldFrames = Math.max(1, Math.round(endHoldSeconds * fps));
        const animLength = pages.length * framesPerPage + endHoldFrames;
        const frame = playbackFrame % animLength;
        const step = Math.min(
          pages.length - 1,
          Math.floor(frame / framesPerPage),
        );

        p.clear();
        drawStackPage(
          p,
          stack,
          pages[step]!,
          step,
          activeLightMode,
          renderScale,
        );

        playbackFrame += 1;
      };

      p.windowResized = () => {
        const nextRenderScale = stackRenderScale();

        if (nextRenderScale !== renderScale) {
          renderScale = nextRenderScale;
          playbackFrame = 0;
        }

        p.pixelDensity(targetPixelDensity());
        p.resizeCanvas(container.offsetWidth, container.offsetHeight);
        setHighQualitySmoothing(p.drawingContext as CanvasRenderingContext2D);
      };
    };
  };
}

export const createAnoraProcessStack = createProcessStack(ANORA_PROCESS_STACK);
export const createLagProcessStack = createProcessStack(LAG_PROCESS_STACK);
