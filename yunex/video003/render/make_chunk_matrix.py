#!/usr/bin/env python3
"""Create a deterministic inclusive frame-chunk matrix for YUNEX 003."""
from __future__ import annotations

import argparse
import json
import sys


def build_matrix(total_frames: int, chunk_size: int) -> dict:
    if total_frames < 1:
        raise ValueError("total_frames must be >= 1")
    if chunk_size < 1:
        raise ValueError("chunk_size must be >= 1")
    rows = []
    last = total_frames - 1
    for start in range(0, total_frames, chunk_size):
        end = min(last, start + chunk_size - 1)
        rows.append(
            {
                "part": f"{start:04d}-{end:04d}",
                "frames": f"{start}-{end}",
                "start": start,
                "end": end,
                "count": end - start + 1,
            }
        )
    return {"include": rows}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("total_frames", type=int)
    parser.add_argument("chunk_size", type=int)
    parser.add_argument("--github-output", default=None)
    args = parser.parse_args()

    matrix = build_matrix(args.total_frames, args.chunk_size)
    payload = json.dumps(matrix, separators=(",", ":"))
    if args.github_output:
        with open(args.github_output, "a", encoding="utf-8") as handle:
            handle.write(f"matrix={payload}\n")
    else:
        print(payload)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(2)
