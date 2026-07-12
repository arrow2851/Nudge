#!/usr/bin/env python3
"""Decode the checked-in compressed prototype into dist/index.html."""

from __future__ import annotations

import base64
import gzip
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PARTS = sorted((ROOT / "parts").glob("part-*.txt"))
OUTPUT = ROOT / "dist" / "index.html"


def main() -> None:
    if not PARTS:
        raise SystemExit("No prototype parts were found.")

    encoded = "".join(path.read_text(encoding="utf-8").strip() for path in PARTS)
    html = gzip.decompress(base64.b64decode(encoded))
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_bytes(html)
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    main()
