"use client";

import { useEffect, useMemo, useState } from "react";

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
  excludeGlyphs = ["H", "Y", "J", "h", "y", "j"],
  intervalMs = 1800,
}: {
  glyphs?: string[];
  excludeGlyphs?: string[];
  intervalMs?: number;
}) {
  const pool = useMemo(
    () => glyphs ?? buildGlyphPool(excludeGlyphs),
    [glyphs, excludeGlyphs],
  );

  const [glyph, setGlyph] = useState(() => pool[0] ?? "A");
  const [active, setActive] = useState(false);

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
      <span className="anora-glyph-cycle__glyph">{glyph}</span>
    </div>
  );
}
