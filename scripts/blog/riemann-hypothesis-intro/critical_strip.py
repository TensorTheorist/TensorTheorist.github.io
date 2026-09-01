"""Regenerate the critical-strip SVG figure for the Riemann blog post.

Produces `assets/blogs/riemann-hypothesis-intro/critical-strip.svg`
with:
  - the complex plane with gridlines and labelled axes,
  - the critical strip 0 < Re(s) < 1 shaded,
  - the critical line Re(s) = 1/2 dashed,
  - the first ten non-trivial zeros of zeta placed at their true
    imaginary parts on the critical line,
  - the first trivial zero at s = -2.

Zero heights are taken from Odlyzko's published tables.

Usage:
    python3 scripts/blog/riemann-hypothesis-intro/critical_strip.py \\
        --out assets/blogs/riemann-hypothesis-intro/critical-strip.svg
"""

import argparse

# First ten non-trivial zeros of zeta on the critical line, i.e. their
# imaginary parts. Real part is 1/2 for each (assuming RH).
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


def render_svg(width: int = 640, height: int = 420,
               re_min: float = -3.0, re_max: float = 3.0,
               im_max: float = 55.0, n_zeros: int = 10) -> str:
    left, right, top, bottom = 70, width - 40, 30, height - 50

    def x_of(re: float) -> float:
        return left + (re - re_min) / (re_max - re_min) * (right - left)

    def y_of(im: float) -> float:
        return bottom - (im / im_max) * (bottom - top)

    parts = []
    parts.append(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" '
        f'role="img" aria-label="Critical strip and non-trivial zeros of zeta">'
    )
    parts.append('<rect width="100%" height="100%" fill="#0e1220"/>')

    # gridlines
    for re in range(int(re_min), int(re_max) + 1):
        parts.append(
            f'<line x1="{x_of(re):.1f}" y1="{top}" x2="{x_of(re):.1f}" y2="{bottom}" '
            f'stroke="#232a44" stroke-width="0.5"/>'
        )
    for im in range(0, int(im_max) + 1, 10):
        parts.append(
            f'<line x1="{left}" y1="{y_of(im):.1f}" x2="{right}" y2="{y_of(im):.1f}" '
            f'stroke="#232a44" stroke-width="0.5"/>'
        )

    # critical strip
    parts.append(
        f'<rect x="{x_of(0):.1f}" y="{top}" width="{x_of(1) - x_of(0):.1f}" '
        f'height="{bottom - top}" fill="#7c9cff" fill-opacity="0.12"/>'
    )
    # critical line
    parts.append(
        f'<line x1="{x_of(0.5):.1f}" y1="{top}" x2="{x_of(0.5):.1f}" y2="{bottom}" '
        f'stroke="#ff7ea8" stroke-dasharray="4 3" stroke-width="1.4"/>'
    )

    # axes
    parts.append(
        f'<line x1="{x_of(0):.1f}" y1="{top}" x2="{x_of(0):.1f}" y2="{bottom}" '
        f'stroke="#4a5578"/>'
    )
    parts.append(
        f'<line x1="{left}" y1="{bottom}" x2="{right}" y2="{bottom}" stroke="#4a5578"/>'
    )

    # x tick labels
    for re in range(int(re_min), int(re_max) + 1):
        parts.append(
            f'<line x1="{x_of(re):.1f}" y1="{bottom}" x2="{x_of(re):.1f}" y2="{bottom + 4}" '
            f'stroke="#4a5578"/>'
        )
        parts.append(
            f'<text x="{x_of(re):.1f}" y="{bottom + 18}" fill="#9aa4c7" '
            f'font-family="JetBrains Mono, monospace" font-size="10" '
            f'text-anchor="middle">{re}</text>'
        )
    # y tick labels
    for im in range(0, int(im_max) + 1, 10):
        parts.append(
            f'<line x1="{left - 4}" y1="{y_of(im):.1f}" x2="{left}" y2="{y_of(im):.1f}" '
            f'stroke="#4a5578"/>'
        )
        parts.append(
            f'<text x="{left - 8}" y="{y_of(im) + 3:.1f}" fill="#9aa4c7" '
            f'font-family="JetBrains Mono, monospace" font-size="10" '
            f'text-anchor="end">{im}</text>'
        )

    # non-trivial zeros
    for im in ZEROS_IM[:n_zeros]:
        parts.append(
            f'<circle cx="{x_of(0.5):.1f}" cy="{y_of(im):.1f}" r="4" fill="#ffd166"/>'
        )
    # first trivial zero -2 (also -4 outside range)
    parts.append(
        f'<circle cx="{x_of(-2):.1f}" cy="{y_of(0):.1f}" r="3.5" fill="#9aa4c7"/>'
    )

    # labels
    parts.append(
        f'<text x="{x_of(0.5) + 8:.1f}" y="{top + 16}" fill="#ff7ea8" '
        f'font-family="JetBrains Mono, monospace" font-size="11">Re(s) = 1/2</text>'
    )
    parts.append(
        f'<text x="{right - 4}" y="{bottom - 6}" fill="#9aa4c7" '
        f'font-family="JetBrains Mono, monospace" font-size="11" '
        f'text-anchor="end">Re(s)</text>'
    )
    parts.append(
        f'<text x="{x_of(0) + 8:.1f}" y="{top + 14}" fill="#9aa4c7" '
        f'font-family="JetBrains Mono, monospace" font-size="11">Im(s)</text>'
    )
    parts.append(
        f'<text x="{x_of(-2):.1f}" y="{y_of(0) + 18:.1f}" fill="#9aa4c7" '
        f'font-family="JetBrains Mono, monospace" font-size="10" '
        f'text-anchor="middle">s = -2</text>'
    )

    parts.append('</svg>')
    return "\n".join(parts) + "\n"


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
