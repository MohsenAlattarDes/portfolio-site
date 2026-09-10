"use client";

import { useEffect, useMemo, useState } from "react";

const DEFAULT_EXCLUDE = ["H", "Y", "J", "h", "y", "j"];

function buildGlyphPool(exclude: string[]) {
  const excluded = new Set(exclude);
  const pool: string[] = [];

  for (let code = 65; code <= 90; code++) {
    const glyph = String.fromCharCode(code);
    if (!excluded.has(glyph)) pool.push(glyph);
  }

  for (let code = 97; code <= 122; code++) {
    const glyph = String.fromCharCode(code);
    if (!excluded.has(glyph)) pool.push(glyph);
  }

  return pool;
}

function glyphSrc(glyph: string) {
  const name = glyph === glyph.toUpperCase() ? `uc-${glyph}` : `lc-${glyph}`;
  return `/work/anora/glyphs/${name}.webp`;
}

function pickRandomGlyph(pool: string[], current?: string) {
  if (pool.length === 0) return "";
  if (pool.length === 1) return pool[0];

  let next = pool[Math.floor(Math.random() * pool.length)];
  while (next === current) {
    next = pool[Math.floor(Math.random() * pool.length)];
  }

  return next;
}

export default function AnoraGlyphCycle({
  glyphs,
  excludeGlyphs = DEFAULT_EXCLUDE,
  intervalMs = 1800,
}: {
  glyphs?: string[];
  excludeGlyphs?: string[];
  intervalMs?: number;
}) {
  const excludeKey = excludeGlyphs.join("");
  const pool = useMemo(
    () => glyphs ?? buildGlyphPool(excludeGlyphs),
    [glyphs, excludeGlyphs, excludeKey],
  );

  const [glyph, setGlyph] = useState(() => pool[0] ?? "A");
  const [active, setActive] = useState(false);

  useEffect(() => {
    pool.forEach((item) => {
      const image = new window.Image();
      image.src = glyphSrc(item);
    });
  }, [pool]);

  useEffect(() => {
    setActive(true);
    setGlyph(pickRandomGlyph(pool));
  }, [pool]);

  useEffect(() => {
    if (!active || pool.length <= 1) return;

    const id = window.setInterval(() => {
      setGlyph((current) => pickRandomGlyph(pool, current));
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [active, pool, intervalMs]);

  return (
    <div className="anora-glyph-cycle" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={glyphSrc(glyph)}
        alt=""
        className="anora-glyph-cycle__glyph"
        width={1131}
        height={1150}
        decoding="async"
        draggable={false}
      />
    </div>
  );
}
