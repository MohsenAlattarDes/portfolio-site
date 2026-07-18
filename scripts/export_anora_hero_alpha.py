#!/usr/bin/env python3
"""Export Anora hero video with transparent matte (edge-connected black removed)."""

from __future__ import annotations

import argparse
import subprocess
import sys
from collections import deque
from pathlib import Path


def remove_edge_black_matte(frame_rgb: bytes, width: int, height: int) -> bytes:
    pixel_count = width * height
    visited = bytearray(pixel_count)
    queue: deque[int] = deque()

    def is_black(index: int) -> bool:
        offset = index * 3
        return (
            frame_rgb[offset] == 0
            and frame_rgb[offset + 1] == 0
            and frame_rgb[offset + 2] == 0
        )

    for x in range(width):
        for y in (0, height - 1):
            index = y * width + x
            if is_black(index):
                visited[index] = 1
                queue.append(index)

    for y in range(height):
        for x in (0, width - 1):
            index = y * width + x
            if not visited[index] and is_black(index):
                visited[index] = 1
                queue.append(index)

    while queue:
        index = queue.popleft()
        x = index % width
        y = index // width
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < width and 0 <= ny < height:
                next_index = ny * width + nx
                if not visited[next_index] and is_black(next_index):
                    visited[next_index] = 1
                    queue.append(next_index)

    rgba = bytearray(pixel_count * 4)
    for index in range(pixel_count):
        rgb_offset = index * 3
        rgba_offset = index * 4
        rgba[rgba_offset : rgba_offset + 3] = frame_rgb[rgb_offset : rgb_offset + 3]
        rgba[rgba_offset + 3] = 0 if visited[index] else 255

    return bytes(rgba)


def probe_video(input_path: Path) -> tuple[int, int, float]:
    stream_result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=width,height",
            "-of",
            "csv=p=0",
            str(input_path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    duration_result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(input_path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    width, height = stream_result.stdout.strip().split(",")
    return int(width), int(height), float(duration_result.stdout.strip())


def export_alpha_webm(
    input_path: Path,
    output_path: Path,
    *,
    max_width: int,
    crf: int,
) -> None:
    source_width, source_height, duration = probe_video(input_path)
    if source_width > max_width:
        target_width = max_width
        target_height = round(source_height * (max_width / source_width))
        target_width -= target_width % 2
        target_height -= target_height % 2
        scale_filter = f"scale={target_width}:{target_height}"
    else:
        target_width = source_width - source_width % 2
        target_height = source_height - source_height % 2
        scale_filter = None

    frame_bytes = target_width * target_height * 3
    decode_cmd = [
        "ffmpeg",
        "-v",
        "error",
        "-i",
        str(input_path),
    ]
    if scale_filter:
        decode_cmd.extend(["-vf", scale_filter])
    decode_cmd.extend(
        [
            "-f",
            "rawvideo",
            "-pix_fmt",
            "rgb24",
            "pipe:1",
        ]
    )

    encode_cmd = [
        "ffmpeg",
        "-y",
        "-v",
        "error",
        "-f",
        "rawvideo",
        "-pix_fmt",
        "rgba",
        "-s",
        f"{target_width}x{target_height}",
        "-r",
        "24",
        "-i",
        "pipe:0",
        "-c:v",
        "libvpx-vp9",
        "-pix_fmt",
        "yuva420p",
        "-b:v",
        "0",
        "-crf",
        str(crf),
        "-row-mt",
        "1",
        str(output_path),
    ]

    decoder = subprocess.Popen(decode_cmd, stdout=subprocess.PIPE)
    encoder = subprocess.Popen(encode_cmd, stdin=subprocess.PIPE)

    assert decoder.stdout is not None
    assert encoder.stdin is not None

    frame_index = 0
    try:
        while True:
            frame_rgb = decoder.stdout.read(frame_bytes)
            if len(frame_rgb) != frame_bytes:
                break

            frame_rgba = remove_edge_black_matte(frame_rgb, target_width, target_height)
            encoder.stdin.write(frame_rgba)
            frame_index += 1
            if frame_index % 10 == 0:
                print(
                    f"Processed {frame_index} frames ({frame_index / 24:.1f}s / {duration:.1f}s)",
                    file=sys.stderr,
                )
    finally:
        encoder.stdin.close()
        decoder.stdout.close()
        decoder.wait()
        encoder.wait()

    if decoder.returncode not in (0, None):
        raise RuntimeError(f"Decode failed with exit code {decoder.returncode}")
    if encoder.returncode not in (0, None):
        raise RuntimeError(f"Encode failed with exit code {encoder.returncode}")

    print(f"Wrote {output_path} ({frame_index} frames, {target_width}x{target_height})")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "input",
        type=Path,
        default=Path("public/work/anora/anora_comp_3.mov"),
        nargs="?",
    )
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        default=Path("public/work/anora/anora_comp_3.webm"),
    )
    parser.add_argument("--max-width", type=int, default=2400)
    parser.add_argument("--crf", type=int, default=28)
    args = parser.parse_args()

    export_alpha_webm(args.input, args.output, max_width=args.max_width, crf=args.crf)


if __name__ == "__main__":
    main()
