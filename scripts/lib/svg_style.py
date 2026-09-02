"""Shared visual language for every SVG figure on the site.

Every figure — Hasse diagrams, truth tables, function plots — imports the
same palette and helpers here. Importing scripts get:

    - a consistent pastel background,
    - a fixed font stack,
    - the same accent colours,
    - helpers to open/close SVG documents and draw common elements.

To use in a new figure script:

    import sys, os
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'lib'))
    # (adjust the number of ..'s to your script's depth)
    from svg_style import PALETTE, FONT, open_svg, close_svg
"""

# Pastel palette shared by every generated figure.
PALETTE = {
    "bg":       "#f5f1ff",   # very light lavender — matches the .intuition blob
    "surface":  "#ffffff",   # cells, table backgrounds
    "text":     "#2b2545",   # near-black violet
    "muted":    "#6b5b95",   # secondary labels
    "grid":     "#e5deff",   # very soft grid lines
    "axis":     "#8b7ac0",   # axis lines, slightly stronger than grid
    "accent":   "#7c3aed",   # primary accent (edges, emphasis)
    "node":     "#f59e0b",   # amber node fill / point marker
    "series1":  "#2563eb",   # data series 1 — blue
    "series2":  "#f59e0b",   # data series 2 — amber
    "series3":  "#e11d48",   # data series 3 / highlight — rose
    "critical": "#e11d48",   # critical line / attention line — rose
}

FONT = "JetBrains Mono, monospace"


def open_svg(width: int, height: int, aria: str = "") -> str:
    """Standard SVG header + pastel background rect."""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" '
        f'role="img" aria-label="{aria}">\n'
        f'<rect width="100%" height="100%" fill="{PALETTE["bg"]}"/>\n'
    )


def close_svg() -> str:
    return "</svg>\n"


def text(x, y, s, *, color=None, size=12, anchor="start", weight="normal"):
    c = color or PALETTE["text"]
    return (
        f'<text x="{x}" y="{y}" fill="{c}" font-family="{FONT}" '
        f'font-size="{size}" text-anchor="{anchor}" font-weight="{weight}">{s}</text>\n'
    )


def line(x1, y1, x2, y2, *, color=None, width=1.0, dashed=False):
    c = color or PALETTE["axis"]
    dash = ' stroke-dasharray="4 3"' if dashed else ""
    return (
        f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" '
        f'stroke="{c}" stroke-width="{width}"{dash}/>\n'
    )


def circle(cx, cy, r, *, fill=None, stroke=None, stroke_width=0):
    f = fill or PALETTE["node"]
    s = f' stroke="{stroke}" stroke-width="{stroke_width}"' if stroke else ""
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{f}"{s}/>\n'


def rect(x, y, w, h, *, fill=None, stroke=None, stroke_width=0, rx=0):
    f = fill or PALETTE["surface"]
    s = f' stroke="{stroke}" stroke-width="{stroke_width}"' if stroke else ""
    r = f' rx="{rx}"' if rx else ""
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{f}"{s}{r}/>\n'
