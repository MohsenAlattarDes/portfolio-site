"""Bake Anora Black glyphs on a shared baseline, centered horizontally."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FONT_PATH = ROOT / "public" / "fonts" / "anora" / "Anora-Black.otf"
OUT_DIR = ROOT / "public" / "work" / "anora" / "glyphs"

EXCLUDE = {"H", "Y", "J", "h", "y", "j"}
FONT_SIZE = 900
PAD_X = 80
PAD_Y = 48
RED = (255, 0, 0, 255)


def glyph_name(glyph: str) -> str:
    if glyph.isupper():
        return f"uc-{glyph}"
    return f"lc-{glyph}"


def glyph_pool() -> list[str]:
    pool: list[str] = []
    for code in range(65, 91):
        glyph = chr(code)
        if glyph not in EXCLUDE:
            pool.append(glyph)
    for code in range(97, 123):
        glyph = chr(code)
        if glyph not in EXCLUDE:
            pool.append(glyph)
    return pool


def main() -> None:
    font = ImageFont.truetype(str(FONT_PATH), FONT_SIZE)
    pool = glyph_pool()
    boxes = {glyph: font.getbbox(glyph) for glyph in pool}

    min_y = min(box[1] for box in boxes.values())
    max_y = max(box[3] for box in boxes.values())
    max_w = max(box[2] - box[0] for box in boxes.values())

    width = max_w + PAD_X * 2
    height = (max_y - min_y) + PAD_Y * 2
    origin_y = -min_y + PAD_Y

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for glyph in pool:
        left, _top, right, _bottom = boxes[glyph]
        canvas = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(canvas)
        ink_w = right - left
        x = (width - ink_w) // 2 - left
        draw.text((x, origin_y), glyph, font=font, fill=RED)
        dest = OUT_DIR / f"{glyph_name(glyph)}.webp"
        canvas.save(dest, "WEBP", quality=90, method=4)
        print(dest.name, dest.stat().st_size)

    print(f"baked {len(pool)} glyphs at {width}x{height}")


if __name__ == "__main__":
    main()
