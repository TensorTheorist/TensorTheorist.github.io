"""Render the AND and OR truth tables side by side as SVG.

In the Boolean pre-order {false ≤ true}, the meet is AND and the
join is OR. This figure shows both tables together.

Usage:
    python3 scripts/notes/specialized/category-theory/truth_tables.py \\
        --out assets/notes/specialized/category-theory/and-or-tables.svg
"""

import argparse
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "lib")))

from svg_style import PALETTE, FONT, open_svg, close_svg, rect, text  # noqa: E402

ROWS = [
    ("false", "false"),
    ("false", "true"),
    ("true",  "false"),
    ("true",  "true"),
]


def draw_cell(x, y, w, h, s, *, header=False, value=None):
    fill = "#efe6ff" if header else PALETTE["surface"]
    color = PALETTE["muted"] if header else PALETTE["text"]
    if value is False:
        color = PALETTE["muted"]
    if value is True:
        color = PALETTE["accent"]
    out = rect(x, y, w, h, fill=fill, stroke=PALETTE["grid"], stroke_width=1)
    out += text(x + w / 2, y + h / 2 + 4, s, color=color, size=12, anchor="middle",
                weight="600" if header else "normal")
    return out


def draw_table(x0, y0, title, op):
    cw, rh = 72, 26
    out = text(x0 + 1.5 * cw, y0 - 10, title, color=PALETTE["accent"],
               size=13, anchor="middle", weight="600")

    for i, h in enumerate(["a", "b", f"a {op} b"]):
        out += draw_cell(x0 + i * cw, y0, cw, rh, h, header=True)

    for r, (a, b) in enumerate(ROWS):
        result = (a == "true" and b == "true") if op == "∧" else (a == "true" or b == "true")
        row = [(a, a == "true"), (b, b == "true"), ("true" if result else "false", result)]
        for i, (label, val) in enumerate(row):
            out += draw_cell(x0 + i * cw, y0 + (r + 1) * rh, cw, rh, label, value=val)
    return out


def render(width=520, height=220):
    parts = [open_svg(width, height, aria="AND and OR truth tables")]
    parts.append(draw_table(20, 40, "meet  ·  a ∧ b  (AND)", "∧"))
    parts.append(draw_table(275, 40, "join  ·  a ∨ b  (OR)", "∨"))
    parts.append(close_svg())
    return "".join(parts)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default=None)
    args = parser.parse_args()
    svg = render()
    if args.out:
        with open(args.out, "w") as f:
            f.write(svg)
    else:
        print(svg)
