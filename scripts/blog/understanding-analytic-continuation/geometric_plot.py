"""Plot y = 1/(1 - x) with the convergence interval (-1, 1) shaded.

The plot illustrates the analytic continuation of the real geometric
series f(x) = Σ x^k, which converges only on (-1, 1). The rational
function g(x) = 1/(1 - x) agrees with f on that interval and extends
continuously to R \\ {1}. The value g(2) = -1 is marked.

Usage:
    python3 scripts/blog/understanding-analytic-continuation/geometric_plot.py \\
        --out assets/blogs/understanding-analytic-continuation/geometric-plot.svg
"""

import argparse
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "lib")))

from svg_style import PALETTE, open_svg, close_svg, line, circle, text, rect  # noqa: E402


def render(width=560, height=340,
           x_min=-2.0, x_max=2.6,
           y_min=-3.0, y_max=3.0):
    left, right, top, bot = 55, width - 25, 25, height - 40

    def X(x):
        return left + (x - x_min) / (x_max - x_min) * (right - left)

    def Y(y):
        return bot - (y - y_min) / (y_max - y_min) * (bot - top)

    parts = [open_svg(width, height, aria="1/(1 - x) with the convergence interval highlighted")]

    # Convergence-strip shading over (-1, 1)
    parts.append(rect(X(-1), top, X(1) - X(-1), bot - top,
                      fill="#efe6ff"))

    # Gridlines every 1 in x and y
    for xg in range(int(x_min), int(x_max) + 1):
        parts.append(line(X(xg), top, X(xg), bot,
                          color=PALETTE["grid"], width=0.6))
    for yg in range(int(y_min), int(y_max) + 1):
        parts.append(line(left, Y(yg), right, Y(yg),
                          color=PALETTE["grid"], width=0.6))

    # Axes through 0
    parts.append(line(X(x_min), Y(0), X(x_max), Y(0), color=PALETTE["axis"], width=1))
    parts.append(line(X(0), Y(y_min), X(0), Y(y_max), color=PALETTE["axis"], width=1))

    # Vertical asymptote at x = 1
    parts.append(line(X(1), top, X(1), bot,
                      color=PALETTE["critical"], width=1.3, dashed=True))
    parts.append(text(X(1) + 6, top + 12, "x = 1",
                      color=PALETTE["critical"], size=11))

    # Curve y = 1/(1 - x), sampled and clipped to viewport.
    def sample(a, b, n=300):
        pts = []
        for i in range(n + 1):
            x = a + (b - a) * i / n
            if abs(x - 1) < 1e-6:
                continue
            y = 1 / (1 - x)
            if y_min <= y <= y_max:
                pts.append((X(x), Y(y)))
        return pts

    def polyline(pts, color, width=1.8):
        if not pts:
            return ""
        d = " ".join(f"{px:.1f},{py:.1f}" for px, py in pts)
        return (
            f'<polyline points="{d}" fill="none" '
            f'stroke="{color}" stroke-width="{width}"/>\n'
        )

    parts.append(polyline(sample(x_min, 0.985), PALETTE["series1"]))
    parts.append(polyline(sample(1.015, x_max), PALETTE["series1"]))

    # Highlighted point at (2, -1)
    parts.append(circle(X(2), Y(-1), 5, fill=PALETTE["node"],
                        stroke=PALETTE["bg"], stroke_width=2))
    parts.append(text(X(2) + 10, Y(-1) + 4, "g(2) = -1",
                      color=PALETTE["text"], size=11, weight="600"))

    # Tick labels
    for xg in range(int(x_min), int(x_max) + 1):
        parts.append(line(X(xg), bot, X(xg), bot + 4, color=PALETTE["axis"]))
        parts.append(text(X(xg), bot + 16, str(xg),
                          color=PALETTE["muted"], size=10, anchor="middle"))
    for yg in range(int(y_min), int(y_max) + 1):
        if yg == 0:
            continue
        parts.append(line(left - 4, Y(yg), left, Y(yg), color=PALETTE["axis"]))
        parts.append(text(left - 8, Y(yg) + 3, str(yg),
                          color=PALETTE["muted"], size=10, anchor="end"))

    # Legend / labels
    parts.append(text(X(0.0) + 6, Y(1.5), "y = 1/(1 − x)",
                      color=PALETTE["series1"], size=11, weight="600"))
    parts.append(text(X(-0.5), Y(y_min) - 4, "series converges here",
                      color=PALETTE["accent"], size=10, anchor="middle"))

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
