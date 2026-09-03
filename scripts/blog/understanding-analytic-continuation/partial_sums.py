"""Reference implementation for the partial-sum overlay.

Computes S_N(x) = sum_{k=0}^{N} x^k for x in the open interval
(-1 + eps, 1 - eps), together with the closed-form limit 1/(1-x).

The interactive plot at
    assets/blogs/understanding-analytic-continuation/geometric-partial-sums.js
mirrors this computation exactly in the browser.

Usage:
    python3 scripts/blog/understanding-analytic-continuation/partial_sums.py \\
        --n 50 --steps 400 --out data.json
"""

import argparse
import json


def compute(n_terms: int, steps: int = 400, eps: float = 1e-2) -> dict:
    xs, s_n, exact = [], [], []
    lo, hi = -1.0 + eps, 1.0 - eps
    for i in range(steps + 1):
        x = lo + (hi - lo) * i / steps
        term, total = 1.0, 0.0
        for _ in range(n_terms + 1):
            total += term
            term *= x
        xs.append(x)
        s_n.append(total)
        exact.append(1.0 / (1.0 - x))
    return {"xs": xs, "partial_sum": s_n, "exact": exact, "N": n_terms}


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--n", type=int, default=20,
                        help="number of terms (0..N)")
    parser.add_argument("--steps", type=int, default=400)
    parser.add_argument("--out", default=None)
    args = parser.parse_args()

    data = compute(args.n, args.steps)
    payload = json.dumps(data)
    if args.out:
        with open(args.out, "w") as f:
            f.write(payload)
    else:
        print(payload)
