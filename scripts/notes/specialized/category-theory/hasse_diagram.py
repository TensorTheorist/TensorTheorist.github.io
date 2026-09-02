"""Render Hasse diagrams for pre-orders / partial orders as SVG.

A Hasse diagram draws only the *cover relations* — pairs (a, b) with
a < b such that no c satisfies a < c < b. Transitive edges are implied.

Layout convention: every example specifies (level, offset_from_center)
per node, and the renderer converts to a regular trapezoid-style grid.

Usage:
    python3 scripts/notes/specialized/category-theory/hasse_diagram.py \\
        --example boolean \\
        --out assets/notes/specialized/category-theory/hasse-boolean.svg
"""

import argparse
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "lib")))

from svg_style import PALETTE, FONT, open_svg, close_svg, line, circle, text  # noqa: E402


def render(spec):
    """spec: {'levels': N, 'nodes': [{id, label, level, col}], 'edges': [{lower, upper}]}"""
    levels = spec["levels"]
    # Fixed geometry — this is what makes every Hasse diagram feel the same.
    width = 340
    top, bot = 40, 240
    center_x = width // 2
    dx = 55  # horizontal spacing between adjacent columns

    def y_of(level):
        if levels == 1:
            return (top + bot) // 2
        return bot - (bot - top) * level / (levels - 1)

    def x_of(col):
        return center_x + col * dx

    positioned = [
        {**n, "x": x_of(n["col"]), "y": y_of(n["level"])} for n in spec["nodes"]
    ]
    id_map = {n["id"]: n for n in positioned}

    height = bot + 60
    parts = [open_svg(width, height, aria=spec.get("aria", "Hasse diagram"))]

    for e in spec["edges"]:
        a, b = id_map[e["lower"]], id_map[e["upper"]]
        parts.append(line(a["x"], a["y"], b["x"], b["y"], color=PALETTE["accent"], width=1.6))

    for n in positioned:
        parts.append(circle(n["x"], n["y"], 8, fill=PALETTE["node"], stroke=PALETTE["bg"], stroke_width=2))
        parts.append(
            text(n["x"], n["y"] + 26, n["label"], color=PALETTE["text"], size=12, anchor="middle")
        )

    parts.append(close_svg())
    return "".join(parts)


EXAMPLES = {
    # Level 0 = bottom. Column 0 = centre; ±1, ±2, … are ±dx offsets.
    "boolean": {
        "levels": 2,
        "nodes": [
            {"id": "F", "label": "false", "level": 0, "col": 0},
            {"id": "T", "label": "true",  "level": 1, "col": 0},
        ],
        "edges": [{"lower": "F", "upper": "T"}],
        "aria": "Hasse diagram of the Boolean pre-order",
    },
    "divisors12": {
        "levels": 4,
        "nodes": [
            {"id": "1",  "label": "1",  "level": 0, "col":  0},
            {"id": "2",  "label": "2",  "level": 1, "col": -1},
            {"id": "3",  "label": "3",  "level": 1, "col":  1},
            {"id": "4",  "label": "4",  "level": 2, "col": -1},
            {"id": "6",  "label": "6",  "level": 2, "col":  1},
            {"id": "12", "label": "12", "level": 3, "col":  0},
        ],
        "edges": [
            {"lower": "1", "upper": "2"}, {"lower": "1", "upper": "3"},
            {"lower": "2", "upper": "4"}, {"lower": "2", "upper": "6"},
            {"lower": "3", "upper": "6"},
            {"lower": "4", "upper": "12"}, {"lower": "6", "upper": "12"},
        ],
        "aria": "Hasse diagram of the divisors of 12",
    },
}


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--example", required=True, choices=list(EXAMPLES.keys()))
    parser.add_argument("--out", default=None)
    args = parser.parse_args()
    svg = render(EXAMPLES[args.example])
    if args.out:
        with open(args.out, "w") as f:
            f.write(svg)
    else:
        print(svg)
