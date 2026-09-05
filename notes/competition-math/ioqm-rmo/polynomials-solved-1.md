# IOQM / RMO Mock — Polynomials, Q1

*Published: September 5, 2026*
*Category: IOQM / RMO — Polynomials*

---

## Problem

Distinct real numbers $\alpha, \beta, \gamma$ satisfy

$$\alpha^{3} - 6\alpha^{2} + 17\alpha - 29 = 0,$$
$$\beta^{3} - 9\beta^{2} + 32\beta - 31 = 0,$$
$$\gamma^{3} + 3\gamma^{2} + 8\gamma - 5 = 0.$$

Compute

$$\left\lfloor \dfrac{2\alpha + \beta - \gamma}{\beta + \gamma} \right\rfloor.$$

---

## Solution

Given different equations in $\alpha, \beta, \gamma$ respectively, we can reformulate them as the same equation via a shift of variable.

$$\alpha^{3} - 6\alpha^{2} + 17\alpha - 29 = 0 \quad \text{or} \quad (\alpha - 2)^{3} + 5(\alpha - 2) - 11 = 0.$$

$$\beta^{3} - 9\beta^{2} + 32\beta - 31 = 0 \quad \text{or} \quad (\beta - 3)^{3} + 5(\beta - 3) + 11 = 0.$$

$$\gamma^{3} + 3\gamma^{2} + 8\gamma - 5 = 0 \quad \text{or} \quad (\gamma + 1)^{3} + 5(\gamma + 1) - 11 = 0.$$

So $(\alpha - 2), \; (3 - \beta), \; (\gamma + 1)$ are roots of

$$z^{3} + 5z - 11 = 0.$$

Check the derivative to estimate the number of real roots.

$$f(z) = z^{3} + 5z - 11, \qquad f'(z) = 3z^{2} + 5 > 0.$$

So $f(z) = z^{3} + 5z - 11$ is [monotone](https://en.wikipedia.org/wiki/Monotonic_function) increasing, and it has only 1 real root. But $\alpha, \beta, \gamma$ are real, so $(\alpha - 2), (3 - \beta), (\gamma + 1)$ are also real. They must all be equal.

$$\alpha - 2 = 3 - \beta \implies \alpha + \beta = 5.$$

$$\alpha - 2 = \gamma + 1 \implies \alpha - \gamma = 3.$$

$$\left\lfloor \dfrac{2\alpha + \beta - \gamma}{\beta + \gamma} \right\rfloor = \left\lfloor \dfrac{(\alpha + \beta) + (\alpha - \gamma)}{(\alpha + \beta) - (\alpha - \gamma)} \right\rfloor = \left\lfloor \dfrac{5 + 3}{5 - 3} \right\rfloor = \lfloor 4 \rfloor = 4.$$
