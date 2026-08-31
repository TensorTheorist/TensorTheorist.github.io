# The Riemann Hypothesis: A Gentle Introduction

*Published: August 31, 2026*
*Category: Riemann*

Why should anyone care about the zeros of a strange complex-valued function? Because they hold the deepest secret we know about the distribution of the prime numbers. This post walks through the statement of the Riemann Hypothesis with just enough machinery to see *why* it matters.

## Contents

1. [Motivation: primes are irregular](#motivation)
2. [Enter the zeta function](#zeta)
3. [Analytic continuation and the critical strip](#continuation)
4. [The Riemann Hypothesis, stated](#hypothesis)
5. [Why it controls the primes](#primes)
6. [Where things stand](#status)

---

<a id="motivation"></a>
## 1. Motivation: primes are irregular

The primes seem chaotic up close but tame in the aggregate. Let $\pi(x)$ denote the number of primes $\le x$. Numerical experiments suggest

$$\pi(x) \sim \frac{x}{\log x}.$$

This is the **Prime Number Theorem** (PNT), proved independently by Hadamard and de la Vallée Poussin in 1896. A sharper approximation is the logarithmic integral

$$\mathrm{Li}(x) = \int_2^x \frac{dt}{\log t}.$$

![Prime counting function compared to x/log(x) and Li(x)](assets/blogs/riemann-hypothesis-intro/prime-counting.svg)

PNT tells us *how many* primes there are up to $x$. It does **not** tell us how far off the estimate can drift. That question is where $\zeta$ enters.

---

<a id="zeta"></a>
## 2. Enter the zeta function

For $\operatorname{Re}(s) > 1$, Riemann's zeta function is

$$\zeta(s) = \sum_{n=1}^{\infty} \frac{1}{n^{s}}.$$

Euler's product formula rewrites this sum as a product over primes:

$$\zeta(s) = \prod_{p \text{ prime}} \frac{1}{1 - p^{-s}}, \qquad \operatorname{Re}(s) > 1.$$

The identity is short but astonishing — it welds the additive structure of the integers on the left to the multiplicative structure of the primes on the right. Any analytic fact about $\zeta$ is therefore, secretly, an arithmetic fact about primes.

---

<a id="continuation"></a>
## 3. Analytic continuation and the critical strip

Riemann showed that $\zeta(s)$ can be extended to a meromorphic function on all of $\mathbb{C}$, with a single simple pole at $s = 1$. The extended function satisfies a symmetry called the **functional equation**:

$$\zeta(s) = 2^{s} \pi^{s-1} \sin\!\left(\frac{\pi s}{2}\right) \Gamma(1 - s)\, \zeta(1 - s).$$

Two kinds of zeros appear:

- **Trivial zeros** at $s = -2, -4, -6, \dots$, forced by the sine factor.
- **Non-trivial zeros** inside the *critical strip* $0 < \operatorname{Re}(s) < 1$.

![The critical strip and the critical line Re(s) = 1/2](assets/blogs/riemann-hypothesis-intro/critical-strip.svg)

The functional equation says the strip is symmetric about the line $\operatorname{Re}(s) = \tfrac{1}{2}$, called the **critical line**.

---

<a id="hypothesis"></a>
## 4. The Riemann Hypothesis, stated

> **Riemann Hypothesis.** Every non-trivial zero of $\zeta(s)$ satisfies
>
> $$\operatorname{Re}(s) = \frac{1}{2}.$$

That's it. One line. All non-trivial zeros lie exactly on the critical line.

---

<a id="primes"></a>
## 5. Why it controls the primes

Riemann derived an *explicit formula* for $\pi(x)$ (or, more cleanly, for the closely related $\psi(x) = \sum_{p^{k} \le x} \log p$). Schematically:

$$\psi(x) = x - \sum_{\rho} \frac{x^{\rho}}{\rho} - \log(2\pi) - \tfrac{1}{2}\log(1 - x^{-2}),$$

where $\rho$ runs over the non-trivial zeros. Each zero contributes an oscillation of size $x^{\operatorname{Re}(\rho)}$.

- If **every** $\rho$ has $\operatorname{Re}(\rho) = \tfrac{1}{2}$, the error term in the Prime Number Theorem is bounded by $O(\sqrt{x}\, \log^{2} x)$ — the best possible.
- If **some** $\rho$ drifts off the critical line, the primes wobble more than we'd like.

So the Riemann Hypothesis is, in disguise, the statement that primes are as regularly distributed as they possibly can be.

---

<a id="status"></a>
## 6. Where things stand

- Trillions of zeros have been checked and all lie on the critical line.
- Hardy (1914) proved that infinitely many zeros lie on the critical line.
- The best known unconditional bounds still allow zeros to drift arbitrarily close to $\operatorname{Re}(s) = 1$.
- No proof — and no plausible strategy — is currently known.

The Riemann Hypothesis is one of the seven [Clay Millennium Problems](blog-post.html?post=millennium-problems-overview). A proof would immediately upgrade thousands of conditional theorems in number theory to unconditional ones.

---

*Next in this series:* the explicit formula, worked out slowly, from $\zeta$ to $\psi(x)$.
