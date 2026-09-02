"""Render the AND and OR truth tables side by side as SVG.

In the Boolean pre-order {false ≤ true}, the meet is AND and the
join is OR. This figure shows both tables together.

Usage:
    python3 scripts/notes/specialized/category-theory/truth_tables.py \\
        --out assets/notes/specialized/category-theory/and-or-tables.svg
"""

import argparse

ROWS = [
    ("false", "false"),
    ("false", "true"),
    ("true",  "false"),
    ("true",  "true"),
]


def cell(x, y, w, h, text, fill, tx_color):
    return (
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" '
        f'stroke="#4a5578" stroke-width="0.6"/>'
        f'<text x="{x + w / 2}" y="{y + h / 2 + 4}" fill="{tx_color}" '
        f'font-family="JetBrains Mono, monospace" font-size="12" '
        f'text-anchor="middle">{text}</text>'
    )


def render_table(x0, y0, title, op):
    # Column widths
    cw = 78
    rh = 30
    lines = []
    lines.append(
        f'<text x="{x0 + 1.5 * cw}" y="{y0 - 12}" fill="#ffd166" '
        f'font-family="JetBrains Mono, monospace" font-size="13" '
        f'text-anchor="middle">{title}</text>'
    )
    # header row
    header = ["a", "b", "a " + op + " b"]
    for i, h in enumerate(header):
        lines.append(cell(x0 + i * cw, y0, cw, rh, h, "#1a1f3a", "#9aa4c7"))
    # data rows
    for r, (a, b) in enumerate(ROWS):
        if op == "∧":
            out = "true" if a == "true" and b == "true" else "false"
        else:
            out = "true" if a == "true" or b == "true" else "false"
        row = [a, b, out]
        for i, v in enumerate(row):
            fill = "#0e1220"
            color = "#e6edf3" if v == "true" else "#8b949e"
            lines.append(
                cell(x0 + i * cw, y0 + (r + 1) * rh, cw, rh, v, fill, color)
            )
    return "\n".join(lines)


def render_svg(width=620, height=240):
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" '
        f'role="img" aria-label="AND and OR truth tables">'
    ]
    parts.append('<rect width="100%" height="100%" fill="#0e1220"/>')
    parts.append(render_table(20, 40, "meet: a ∧ b  (AND)", "∧"))
    parts.append(render_table(325, 40, "join: a ∨ b  (OR)", "∨"))
    parts.append("</svg>")
    return "\n".join(parts) + "\n"


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default=None)
    args = parser.parse_args()
    svg = render_svg()
    if args.out:
        with open(args.out, "w") as f:
            f.write(svg)
    else:
        print(svg)
