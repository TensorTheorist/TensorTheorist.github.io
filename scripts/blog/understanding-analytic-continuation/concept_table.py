"""Render the continuity → differentiability → smooth → analytic table.

Each of the four columns names a level of regularity, with a one-line
criterion below the name. The columns are increasingly strong from left
to right.

Usage:
    python3 scripts/blog/understanding-analytic-continuation/concept_table.py \\
        --out assets/blogs/understanding-analytic-continuation/concept-table.svg
"""

import argparse
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "lib")))

from svg_style import PALETTE, open_svg, close_svg, rect, text  # noqa: E402


COLUMNS = [
    ("continuity",         "lim  f(x) = L",     "as x → x₀"),
    ("differentiability",  "lim  f′(x)  matches", "from both sides"),
    ("smoothness",         "every  f⁽ⁿ⁾(x)",     "exists and matches"),
    ("analyticity",        "Taylor series → f",  "on an open nbhd of x₀"),
]


def draw_cell(x, y, w, h, txt, *, header=False, weight="normal", size=12, color=None):
    fill = "#efe6ff" if header else PALETTE["surface"]
    c = color or (PALETTE["accent"] if header else PALETTE["text"])
    out = rect(x, y, w, h, fill=fill, stroke=PALETTE["grid"], stroke_width=1)
    out += text(x + w / 2, y + h / 2 + 4, txt,
                color=c, size=size, anchor="middle", weight=weight)
    return out


def render(width=560, height=170):
    parts = [open_svg(width, height, aria="Continuity, differentiability, smoothness, analyticity")]
    n = len(COLUMNS)
    left = 20
    total = width - 40
    cw = total / n
    hh = 34   # header height
    rh = 32   # row height (each criterion line)
    y0 = 20

    for i, (name, line1, line2) in enumerate(COLUMNS):
        x = left + i * cw
        parts.append(draw_cell(x, y0,        cw, hh, name,  header=True, weight="600", size=13))
        parts.append(draw_cell(x, y0 + hh,   cw, rh, line1, size=11))
        parts.append(draw_cell(x, y0 + hh + rh, cw, rh, line2,
                               size=10, color=PALETTE["muted"]))

    # Direction arrow underneath
    ay = y0 + hh + 2 * rh + 18
    parts.append(text(left,           ay, "weaker",  color=PALETTE["muted"],
                      size=11, anchor="start"))
    parts.append(text(left + total,   ay, "stronger", color=PALETTE["muted"],
                      size=11, anchor="end"))
    parts.append(
        f'<line x1="{left + 55}" y1="{ay - 4}" x2="{left + total - 60}" y2="{ay - 4}" '
        f'stroke="{PALETTE["accent"]}" stroke-width="1.3" '
        f'marker-end="url(#arrow)"/>'
    )
    # Arrow marker
    parts.insert(1,
        f'<defs><marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" '
        f'markerWidth="8" markerHeight="8" orient="auto-start-reverse">'
        f'<path d="M0,0 L10,5 L0,10 z" fill="{PALETTE["accent"]}"/>'
        f'</marker></defs>'
    )

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
