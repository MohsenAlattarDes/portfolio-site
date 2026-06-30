import type p5js from "p5";

type P5 = InstanceType<typeof p5js>;
export type HeroP5Font = object;

export const LATIN_FONT = "Tahoma";
export const ARABIC_FONT_PATHS = [
  "/fonts/Futura100ARA-Bold.woff2",
  "/fonts/Futura100ARA-Bold.otf",
] as const;

const ARABIC_RE = /[\u0600-\u06FF]/;

const ARABIC_FAMILY_CANDIDATES = [
  { family: "Futura 100 ARA Bold", weight: "400" },
  { family: "Futura 100 ARA Bold", weight: "700" },
  { family: "futura-100-arabic", weight: "700" },
  { family: "Futura 100 Arabic", weight: "700" },
] as const;

let arabicFamily: string = ARABIC_FAMILY_CANDIDATES[0].family;
let arabicP5Font: HeroP5Font | null = null;

export function isArabic(char: string) {
  return ARABIC_RE.test(char);
}

export function setArabicP5Font(font: HeroP5Font | null) {
  arabicP5Font = font;
}

export function loadArabicP5Font(p: P5, onReady: () => void) {
  let pathIndex = 0;

  const tryNext = () => {
    if (pathIndex >= ARABIC_FONT_PATHS.length) {
      onReady();
      return;
    }

    const path = ARABIC_FONT_PATHS[pathIndex++];
    p.loadFont(
      path,
      (font) => {
        arabicP5Font = font;
        onReady();
      },
      () => tryNext(),
    );
  };

  tryNext();
}

async function resolveArabicFamily() {
  for (const candidate of ARABIC_FAMILY_CANDIDATES) {
    const spec = `${candidate.weight} 48px ${candidate.family}`;
    try {
      await document.fonts.load(spec);
      if (document.fonts.check(spec)) {
        arabicFamily = candidate.family;
        return;
      }
    } catch {
      // try next candidate
    }
  }
}

export function applyGlyphFont(p: P5, char: string) {
  if (isArabic(char)) {
    if (arabicP5Font) {
      p.textFont(arabicP5Font);
      return;
    }
    p.textStyle(p.NORMAL);
    p.textFont(arabicFamily);
    return;
  }

  p.textStyle(p.BOLD);
  p.textFont(LATIN_FONT);
}

export async function preloadHeroFonts() {
  await Promise.all([
    document.fonts.load("700 48px Tahoma"),
    resolveArabicFamily(),
  ]);
}
