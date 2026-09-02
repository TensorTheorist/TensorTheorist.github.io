"""Regenerate the critical-strip SVG figure for the Riemann blog post.

Uses the shared pastel palette from scripts/lib/svg_style.py so this
figure matches every other visual on the site.

Usage:
    python3 scripts/blog/riemann-hypothesis-intro/critical_strip.py \\
        --out assets/blogs/riemann-hypothesis-intro/critical-strip.svg
"""

import argparse
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "lib")))

from svg_style import PALETTE, open_svg, close_svg, line, circle, text, rect  # noqa: E402

ZEROS_IM = [
    14.134725141734693,
    21.022039638771556,
    25.010857580145688,
    30.424876125859513,
    32.935061587739189,
    37.586178158825671,
    40.918719012147495,
    43.327073280914999,
    48.005150881167159,
    49.773832477672302,
]


def render_svg(width=580, height=380, re_min=-3.0, re_max=3.0,
               im_max=55.0, n_zeros=10):
    left, right, top, bottom = 60, width - 30, 30, height - 46

    def x_of(re):
        return left + (re - re_min) / (re_max - re_min) * (right - left)

    def y_of(im):
        return bottom - (im / im_max) * (bottom - top)

    parts = [open_svg(width, height, aria="Critical strip and non-trivial zeros of zeta")]

    # gridlines
    for re in range(int(re_min), int(re_max) + 1):
        parts.append(line(x_of(re), top, x_of(re), bottom, color=PALETTE["grid"], width=0.6))
    for im in range(0, int(im_max) + 1, 10):
        parts.append(line(left, y_of(im), right, y_of(im), color=PALETTE["grid"], width=0.6))

    # critical strip
    parts.append(rect(x_of(0), top, x_of(1) - x_of(0), bottom - top, fill="#efe6ff"))
    # critical line
    parts.append(line(x_of(0.5), top, x_of(0.5), bottom,
                      color=PALETTE["critical"], width=1.4, dashed=True))
    # axes
    parts.append(line(x_of(0), top, x_of(0), bottom, color=PALETTE["axis"], width=1))
    parts.append(line(left, bottom, right, bottom, color=PALETTE["axis"], width=1))

    for re in range(int(re_min), int(re_max) + 1):
        parts.append(line(x_of(re), bottom, x_of(re), bottom + 4, color=PALETTE["axis"]))
        parts.append(text(x_of(re), bottom + 16, str(re),
                          color=PALETTE["muted"], size=10, anchor="middle"))
    for im in range(0, int(im_max) + 1, 10):
        parts.append(line(left - 4, y_of(im), left, y_of(im), color=PALETTE["axis"]))
        parts.append(text(left - 8, y_of(im) + 3, str(im),
                          color=PALETTE["muted"], size=10, anchor="end"))

    for im in ZEROS_IM[:n_zeros]:
        parts.append(circle(x_of(0.5), y_of(im), 4, fill=PALETTE["node"]))
    parts.append(circle(x_of(-2), y_of(0), 3.5, fill=PALETTE["muted"]))

    parts.append(text(x_of(0.5) + 8, top + 14, "Re(s) = 1/2",
                      color=PALETTE["critical"], size=11))
    parts.append(text(right - 4, bottom - 6, "Re(s)",
                      color=PALETTE["muted"], size=11, anchor="end"))
    parts.append(text(x_of(0) + 8, top + 12, "Im(s)",
                      color=PALETTE["muted"], size=11))
    parts.append(text(x_of(-2), y_of(0) + 18, "s = -2",
                      color=PALETTE["muted"], size=10, anchor="middle"))

    parts.append(close_svg())
    return "".join(parts)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default=None)
    parser.add_argument("--n-zeros", type=int, default=10)
    args = parser.parse_args()
    svg = render_svg(n_zeros=args.n_zeros)
    if args.out:
        with open(args.out, "w") as f:
            f.write(svg)
    else:
        print(svg)
