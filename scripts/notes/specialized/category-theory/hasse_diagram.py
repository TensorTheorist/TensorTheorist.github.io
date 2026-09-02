"""Render Hasse diagrams for pre-orders / partial orders as SVG.

A Hasse diagram draws only the *cover relations* — pairs (a, b) with
a < b such that no c satisfies a < c < b. Transitive edges are implied.

Usage:
    python3 scripts/notes/specialized/category-theory/hasse_diagram.py \\
        --example boolean \\
        --out assets/notes/specialized/category-theory/hasse-boolean.svg
"""

import argparse


def render(nodes, edges, width=400, height=300):
    id_map = {n["id"]: n for n in nodes}
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" '
        f'role="img" aria-label="Hasse diagram">'
    ]
    parts.append('<rect width="100%" height="100%" fill="#0e1220"/>')
    for e in edges:
        a, b = id_map[e["lower"]], id_map[e["upper"]]
        parts.append(
            f'<line x1="{a["x"]}" y1="{a["y"]}" x2="{b["x"]}" y2="{b["y"]}" '
            f'stroke="#7c9cff" stroke-width="1.6"/>'
        )
    for n in nodes:
        parts.append(
            f'<circle cx="{n["x"]}" cy="{n["y"]}" r="8" '
            f'fill="#ffd166" stroke="#0e1220" stroke-width="2"/>'
        )
        parts.append(
            f'<text x="{n["x"] + 14}" y="{n["y"] + 4}" fill="#e6edf3" '
            f'font-family="JetBrains Mono, monospace" font-size="12">{n["label"]}</text>'
        )
    parts.append("</svg>")
    return "\n".join(parts) + "\n"


EXAMPLES = {
    "boolean": {
        "nodes": [
            {"id": "F", "label": "false", "x": 200, "y": 230},
            {"id": "T", "label": "true",  "x": 200, "y": 80},
        ],
        "edges": [{"lower": "F", "upper": "T"}],
        "width": 400, "height": 310,
    },
    "divisors12": {
        "nodes": [
            {"id": "1",  "label": "1",  "x": 200, "y": 270},
            {"id": "2",  "label": "2",  "x": 120, "y": 190},
            {"id": "3",  "label": "3",  "x": 280, "y": 190},
            {"id": "4",  "label": "4",  "x": 80,  "y": 105},
            {"id": "6",  "label": "6",  "x": 220, "y": 105},
            {"id": "12", "label": "12", "x": 150, "y": 30},
        ],
        "edges": [
            {"lower": "1", "upper": "2"}, {"lower": "1", "upper": "3"},
            {"lower": "2", "upper": "4"}, {"lower": "2", "upper": "6"},
            {"lower": "3", "upper": "6"},
            {"lower": "4", "upper": "12"}, {"lower": "6", "upper": "12"},
        ],
        "width": 420, "height": 320,
    },
}


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--example", required=True, choices=list(EXAMPLES.keys()))
    parser.add_argument("--out", default=None)
    args = parser.parse_args()
    spec = EXAMPLES[args.example]
    svg = render(spec["nodes"], spec["edges"], spec["width"], spec["height"])
    if args.out:
        with open(args.out, "w") as f:
            f.write(svg)
    else:
        print(svg)
