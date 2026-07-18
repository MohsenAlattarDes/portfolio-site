"""
Anora — Process Stop-Motion Generator
======================================
Composites ordered process scans into a growing vertical stack, renders PNG
frames, then stitches them into an MP4 with ffmpeg.

Usage:
    python3 scripts/generate_anora_stopmotion.py
"""

from __future__ import annotations

import random
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = Path(
    "/Users/EPICMOHSEN/Desktop/ArtCenter MGX/Fall25:Spring26/"
    "Portfolio Lab/site/anora/scanned proccess/Anora-Scans"
)
FRAMES_DIR = ROOT / "scripts" / "anora-stopmotion" / "frames"
PREPARED_DIR = ROOT / "public" / "work" / "anora" / "scans"
OUT_DIR = ROOT / "public" / "work" / "anora"
OUT_NAME = "anora_stopmotion.mp4"

# US Letter portrait (8.5 × 11 in)
CANVAS_W, CANVAS_H = 1350, 1750
BG_COLOR = (17, 17, 17)
TARGET_W, TARGET_H = 960, 1240
PAGE_SCALE = 0.94

ROTATION_MIN_DEG = -6
ROTATION_MAX_DEG = 6

SECONDS_PER_FRAME = 0.75
END_HOLD_SECONDS = 2.0
OUTPUT_FPS = 30
RANDOM_SEED = 42

# Manual rotation overrides (degrees). Only add files that still look wrong
# after auto preprocessing.
ORIENTATION_FIX: dict[str, int] = {}

ORDER = [
    "Anora-Scans_-2.jpeg",
    "Anora-Scans_-1.jpg",
    "Anora-Scans_0.jpg",
    "Anora-Scans.jpg",
    "Anora-Scans_1.jpg",
    "Anora-Scans_2.jpg",
    "Anora-Scans_3.jpg",
    "Anora-Scans_4.jpg",
    "Anora-Scans_5.jpg",
    "Anora-Scans_6.jpg",
    "Anora-Scans_7.jpg",
    "Anora-Scans_8.jpg",
    "Anora-Scans_9.jpg",
    "Anora-Scans_10.jpg",
    "Anora-Scans_11.jpg",
    "Anora-Scans_12.jpg",
    "Anora-Scans_13.jpg",
    "Anora-Scans_14.jpg",
    "Anora-Scans_15.jpg",
    "Anora-Scans_16.jpg",
    "Anora-Scans_17.jpg",
    "Anora-Scans_18.jpg",
    "Anora-Scans_19.jpg",
]


SCAN_HALO_INSET = 6
MAX_OUTER_MARGIN_FRACTION = 0.02


def _is_scanner_margin(values: np.ndarray) -> bool:
    return values.std() < 8 and values.mean() > 251


def _trim_outer_scanner_margin(arr: np.ndarray) -> np.ndarray:
    g = arr.mean(axis=2)
    ch, cw = g.shape
    top, bottom, left, right = 0, ch - 1, 0, cw - 1

    top_limit = max(1, int(ch * MAX_OUTER_MARGIN_FRACTION * 0.5))
    bottom_limit = min(ch - 2, int(ch * (1 - MAX_OUTER_MARGIN_FRACTION * 0.5)))
    left_limit = max(1, int(cw * MAX_OUTER_MARGIN_FRACTION))
    right_limit = min(cw - 2, int(cw * (1 - MAX_OUTER_MARGIN_FRACTION)))

    while top < top_limit and _is_scanner_margin(g[top, :]):
        top += 1
    while bottom > bottom_limit and _is_scanner_margin(g[bottom, :]):
        bottom -= 1
    while left < left_limit and _is_scanner_margin(g[:, left]):
        left += 1
    while right > right_limit and _is_scanner_margin(g[:, right]):
        right -= 1

    if bottom <= top or right <= left:
        return arr
    return arr[top : bottom + 1, left : right + 1]


def _crop_scanner_bed(arr: np.ndarray) -> np.ndarray:
    gray = arr.mean(axis=2)
    mask = gray > 42
    ys, xs = np.where(mask)
    if len(xs) == 0:
        return arr

    pad = 1
    y0, y1 = max(0, ys.min() - pad), min(arr.shape[0] - 1, ys.max() + pad)
    x0, x1 = max(0, xs.min() - pad), min(arr.shape[1] - 1, xs.max() + pad)
    return arr[y0 : y1 + 1, x0 : x1 + 1]


def prepare_scan(path: Path) -> Image.Image:
    img = ImageOps.exif_transpose(Image.open(path))
    fname = path.name

    if fname in ORIENTATION_FIX:
        img = img.rotate(ORIENTATION_FIX[fname], expand=True)

    arr = np.array(img.convert("RGB"))
    arr = _crop_scanner_bed(arr)
    arr = _trim_outer_scanner_margin(arr)

    inset = SCAN_HALO_INSET
    h, w = arr.shape[:2]
    if h > inset * 2 + 20 and w > inset * 2 + 20:
        arr = arr[inset : h - inset, inset : w - inset]

    if arr.shape[1] > arr.shape[0]:
        img = Image.fromarray(arr).rotate(-90, expand=True)
    else:
        img = Image.fromarray(arr)

    return img


def fit_letter(img: Image.Image) -> Image.Image:
    ratio = min(TARGET_W / img.width, TARGET_H / img.height)
    new_w = max(1, int(img.width * ratio))
    new_h = max(1, int(img.height * ratio))
    return img.resize((new_w, new_h), Image.Resampling.LANCZOS)


def random_rotation() -> float:
    magnitude = random.uniform(ROTATION_MIN_DEG, ROTATION_MAX_DEG)
    sign = random.choice([-1, 1])
    return sign * magnitude


def export_prepared_scans() -> None:
    PREPARED_DIR.mkdir(parents=True, exist_ok=True)
    for i, fname in enumerate(ORDER):
        path = SRC_DIR / fname
        if not path.exists():
            raise FileNotFoundError(f"Missing scan: {path}")
        paper = prepare_scan(path)
        paper.save(
            PREPARED_DIR / f"{i:02d}.jpg",
            quality=96,
            optimize=True,
            subsampling=0,
        )
    print(f"Exported {len(ORDER)} prepared scans -> {PREPARED_DIR}/")


def render_frames() -> int:
    FRAMES_DIR.mkdir(parents=True, exist_ok=True)
    random.seed(RANDOM_SEED)

    rotations = [random_rotation() for _ in ORDER]
    canvas = Image.new("RGB", (CANVAS_W, CANVAS_H), BG_COLOR)

    for i, fname in enumerate(ORDER):
        path = SRC_DIR / fname
        if not path.exists():
            raise FileNotFoundError(f"Missing scan: {path}")

        paper = fit_letter(prepare_scan(path))
        if PAGE_SCALE != 1:
            paper = paper.resize(
                (
                    max(1, int(paper.width * PAGE_SCALE)),
                    max(1, int(paper.height * PAGE_SCALE)),
                ),
                Image.Resampling.LANCZOS,
            )
        paper_rgba = paper.convert("RGBA")
        rotated = paper_rgba.rotate(
            rotations[i], expand=True, resample=Image.Resampling.BICUBIC
        )

        px = (CANVAS_W - rotated.width) // 2
        py = (CANVAS_H - rotated.height) // 2
        canvas.paste(rotated, (px, py), rotated)
        canvas.save(FRAMES_DIR / f"frame_{i:03d}.png")

    print(f"Rendered {len(ORDER)} stacked frames -> {FRAMES_DIR}/")
    return len(ORDER)


def encode_video() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUT_DIR / OUT_NAME

    input_framerate = 1 / SECONDS_PER_FRAME
    vf = (
        f"tpad=stop_mode=clone:stop_duration={END_HOLD_SECONDS},"
        f"fps={OUTPUT_FPS},format=yuv420p"
    )

    cmd = [
        "ffmpeg",
        "-y",
        "-framerate",
        str(input_framerate),
        "-i",
        str(FRAMES_DIR / "frame_%03d.png"),
        "-vf",
        vf,
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-crf",
        "18",
        str(out_path),
    ]

    subprocess.run(cmd, check=True)
    print(f"Video written to {out_path}")


if __name__ == "__main__":
    export_prepared_scans()
    render_frames()
    encode_video()
