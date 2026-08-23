/**
 * p5 canvas `textFont()` does not use CSS fallbacks the way the DOM does.
 * Tahoma is a Windows face — iOS does not ship it. A lone "Tahoma" (and even
 * a Tahoma-first stack) becomes Times on iPhone Safari. Probe the canvas
 * and pick the first family that actually measures differently from serif.
 */
const LATIN_CANDIDATES = ["Tahoma", "Verdana", "Geneva", "sans-serif"] as const;

let resolvedLatinFont: string | null = null;

function familyIsAvailable(family: string) {
  if (typeof document === "undefined") return false;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return false;

  const sample = "mmmmmmmmmmlliWi@#%";
  ctx.font = "72px serif";
  const serifWidth = ctx.measureText(sample).width;
  ctx.font = `72px "${family}", serif`;
  return ctx.measureText(sample).width !== serifWidth;
}

export function resolveLatinFont() {
  if (resolvedLatinFont) return resolvedLatinFont;
  if (typeof document === "undefined") return "Verdana";

  for (const family of LATIN_CANDIDATES) {
    if (family === "sans-serif" || familyIsAvailable(family)) {
      resolvedLatinFont = family;
      return family;
    }
  }

  resolvedLatinFont = "sans-serif";
  return resolvedLatinFont;
}

export async function preloadLatinFont() {
  if (typeof document === "undefined" || !document.fonts) {
    return resolveLatinFont();
  }

  await Promise.all(
    LATIN_CANDIDATES.filter((family) => family !== "sans-serif").map((family) =>
      document.fonts.load(`700 48px ${family}`),
    ),
  );

  resolvedLatinFont = null;
  return resolveLatinFont();
}
