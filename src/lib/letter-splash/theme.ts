function parseRgb(cssColor: string): [number, number, number] | null {
  const match = cssColor.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i,
  );
  if (!match) return null;
  return [
    Math.round(Number(match[1])),
    Math.round(Number(match[2])),
    Math.round(Number(match[3])),
  ];
}

function fallbackBg(): readonly [number, number, number] {
  const light = document.documentElement.dataset.theme === "light";
  return light ? [255, 255, 255] : [0, 0, 0];
}

export function themeColors() {
  if (typeof document !== "undefined") {
    const parsed = parseRgb(getComputedStyle(document.body).backgroundColor);
    if (parsed) {
      return {
        bg: parsed,
        red: [255, 0, 0] as const,
      };
    }
  }

  return {
    bg: fallbackBg(),
    red: [255, 0, 0] as const,
  };
}
