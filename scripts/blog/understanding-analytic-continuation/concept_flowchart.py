"""Flowchart: continuity → differentiability → smoothness → analyticity.

Each node names one level of regularity. Below each node, two lines of
criterion. Arrows connect consecutive levels left-to-right.

Usage:
    python3 scripts/blog/understanding-analytic-continuation/concept_flowchart.py \\
        --out assets/blogs/understanding-analytic-continuation/concept-flowchart.svg
"""

import argparse
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "lib")))

from svg_style import PALETTE, open_svg, close_svg, text, rect  # noqa: E402


STAGES = [
    ("continuity",         ["lim  f(x) = L",       "as x → x₀"]),
    ("differentiability",  ["lim  f′(x)  matches", "from both sides"]),
    ("smoothness",         ["every  f⁽ⁿ⁾(x)",       "exists and matches"]),
    ("analyticity",        ["Taylor series → f",   "on an open nbhd of x₀"]),
]


def render(width=640, height=220):
    parts = [open_svg(width, height, aria="Continuity to analyticity flowchart")]

    # Arrow marker definition
    parts.append(
        f'<defs><marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" '
        f'markerWidth="9" markerHeight="9" orient="auto-start-reverse">'
        f'<path d="M0,0 L10,5 L0,10 z" fill="{PALETTE["accent"]}"/>'
        f'</marker></defs>'
    )

    n = len(STAGES)
    left, right = 15, width - 15
    span = right - left
    node_w = 130
    node_h = 42
    gap = (span - n * node_w) / (n - 1)
    y_node = 30
    y_c1 = y_node + node_h + 24
    y_c2 = y_c1 + 16

    centers = []
    for i, (name, _) in enumerate(STAGES):
        x = left + i * (node_w + gap)
        cx = x + node_w / 2
        centers.append(cx)
        parts.append(
            rect(x, y_node, node_w, node_h,
                 fill="#efe6ff", stroke=PALETTE["accent"], stroke_width=1.2, rx=8)
        )
        parts.append(
            text(cx, y_node + node_h / 2 + 5, name,
                 color=PALETTE["accent"], size=13, anchor="middle", weight="600")
        )

    # Arrows between nodes
    y_arrow = y_node + node_h / 2
    for i in range(n - 1):
        x1 = centers[i] + node_w / 2 + 4
        x2 = centers[i + 1] - node_w / 2 - 4
        parts.append(
            f'<line x1="{x1}" y1="{y_arrow}" x2="{x2}" y2="{y_arrow}" '
            f'stroke="{PALETTE["accent"]}" stroke-width="1.6" '
            f'marker-end="url(#arrow)"/>'
        )

    # Criteria below each node
    for cx, (_, criterion) in zip(centers, STAGES):
        parts.append(text(cx, y_c1, criterion[0],
                          color=PALETTE["text"], size=11, anchor="middle"))
        parts.append(text(cx, y_c2, criterion[1],
                          color=PALETTE["muted"], size=10, anchor="middle"))

    # Bottom axis label
    parts.append(text(left,          height - 12, "weaker",   color=PALETTE["muted"],
                      size=11, anchor="start"))
    parts.append(text(right,         height - 12, "stronger", color=PALETTE["muted"],
                      size=11, anchor="end"))

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
