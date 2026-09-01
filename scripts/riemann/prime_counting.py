"""Reference implementation for the prime counting function pi(x)
and its two classical approximations.

    pi(x)      = number of primes <= x
    x / log(x) = crude PNT estimate
    Li(x)      = integral from 2 to x of dt / log(t)

Used as the source of truth for the interactive plot in the
"Riemann Hypothesis: A Gentle Introduction" blog post.

The mirrored JS implementation lives at
    assets/blogs/riemann-hypothesis-intro/prime-counting.js
and matches this file exactly.

Usage:
    python3 scripts/riemann/prime_counting.py --n 10000 --step 50 --out data.json
"""

import argparse
import json
import math


def sieve(n: int) -> list[bool]:
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(n ** 0.5) + 1):
        if is_prime[i]:
            for j in range(i * i, n + 1, i):
                is_prime[j] = False
    return is_prime


def li(x: float, steps: int = 400) -> float:
    """Trapezoidal integration of 1/log(t) from 2 to x."""
    if x <= 2:
        return 0.0
    dx = (x - 2) / steps
    total = 0.0
    for k in range(steps):
        a = 2 + k * dx
        b = a + dx
        total += 0.5 * (1 / math.log(a) + 1 / math.log(b)) * dx
    return total


def compute(n_max: int, step: int = 50) -> dict:
    is_prime = sieve(n_max)
    xs, pi_x, x_over_log, li_x = [], [], [], []
    running = 0
    for x in range(2, n_max + 1):
        if is_prime[x]:
            running += 1
        if x % step == 0 or x == n_max:
            xs.append(x)
            pi_x.append(running)
            x_over_log.append(x / math.log(x))
            li_x.append(li(x))
    return {"xs": xs, "pi": pi_x, "x_over_log": x_over_log, "li": li_x}


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--n", type=int, default=10000)
    parser.add_argument("--step", type=int, default=50)
    parser.add_argument("--out", default=None)
    args = parser.parse_args()

    data = compute(args.n, args.step)
    payload = json.dumps(data)
    if args.out:
        with open(args.out, "w") as f:
            f.write(payload)
    else:
        print(payload)
