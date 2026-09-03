# Understanding Analytic Continuation

*Published: September 2, 2026*
*Category: Analytic Continuation*

[Analytic continuation](https://en.wikipedia.org/wiki/Analytic_continuation) extends a function beyond its original domain in a way that preserves its analytic structure. This post walks through two elementary examples: a punctured domain and a restricted domain.

## Contents

1. [A punctured point](#punctured)
2. [Continuity versus analyticity](#regularity)
3. [A restricted domain](#restricted)

---

<a id="punctured"></a>
## 1. A punctured point

Consider

$$f(x) = \frac{x^{2}}{x}.$$

This is not the same as $g(x) = x$ — they have different domains. We will show that $g(x) = x$ is the analytic continuation of $f(x) = x^{2}/x$.

$f(x) = x^{2}/x$ has domain $\mathbb{R} \setminus \{0\}$, so $f(0)$ is undefined. However, the function $g(x) = x$ is exactly the same as $f(x)$ everywhere in the domain of $f(x)$. Additionally, $g(x)$ is continuous and differentiable everywhere ([analytic](https://en.wikipedia.org/wiki/Analytic_function)).

The [Taylor series](https://en.wikipedia.org/wiki/Taylor_series) expansion of $f(x)$ on $\mathbb{R} \setminus \{0\}$ is the same as that of $g(x) = x$:

$$f(x) = x_{0} + 1 \cdot (x - x_{0}) + 0 \cdot \frac{(x - x_{0})^{2}}{2!} + \cdots.$$

The [radius of convergence](https://en.wikipedia.org/wiki/Radius_of_convergence) is $R = \infty$.

<details class="bulb">
<summary>Compute R via the Ratio Test or Cauchy–Hadamard</summary>

The [Ratio Test](https://en.wikipedia.org/wiki/Ratio_test):

$$\frac{1}{R} = \lim_{k \to \infty} \Big| \frac{a_{k+1}}{a_{k}} \Big|.$$

The [Cauchy–Hadamard formula](https://en.wikipedia.org/wiki/Cauchy%E2%80%93Hadamard_theorem):

$$\frac{1}{R} = \limsup_{k \to \infty} |a_{k}|^{1/k}.$$

For $g(x) = x$ centered at $x_{0} \neq 0$, only $a_{0} = x_{0}$ and $a_{1} = 1$ are nonzero, so $1/R = 0$ and $R = \infty$.

</details>

$R = \infty$ means that the Taylor expansion holds around any $x_{0} \neq 0$. This is similar in idea to a function being [continuous](https://en.wikipedia.org/wiki/Continuous_function) at a point where it is undefined by having

$$\lim_{x \to x_{0}} f(x) = L, \qquad L = \lim_{x \to x_{0}^{-}} f(x) = \lim_{x \to x_{0}^{+}} f(x).$$

However this is only continuity, not [analyticity](https://en.wikipedia.org/wiki/Analytic_function).

---

<a id="regularity"></a>
## 2. Continuity versus analyticity

Four levels of regularity at a point $x_{0}$, from weakest to strongest:

| Level | Criterion at $x_{0}$ |
| --- | --- |
| **Continuity** | $\displaystyle\lim_{x \to x_{0}} f(x) = L$, with both one-sided limits equal to $L$. |
| **Differentiability** | $f'(x_{0})$ exists — the derivative limit matches from both sides. |
| **Smoothness** | Every derivative $f^{(n)}(x_{0})$ exists. |
| **Analyticity** | The Taylor series of $f$ at $x_{0}$ converges to $f$ on an open neighbourhood of $x_{0}$. |

Analyticity is strictly stronger than smoothness. A standard example is the [smooth non-analytic function](https://en.wikipedia.org/wiki/Non-analytic_smooth_function) $\varphi(x) = e^{-1/x^{2}}$ with $\varphi(0) = 0$: every derivative at $0$ vanishes, so its Taylor series at $0$ is identically zero, yet $\varphi$ is not.

Now looking back at $f(x) = x^{2}/x$: the value at $x = 0$ is not defined by the formula. The analytic continuation $g(x) = x$ assigns the value $g(0) = 0$ — recovered from the Taylor data at any $x_{0} \neq 0$.

---

<a id="restricted"></a>
## 3. A restricted domain

Consider the real [geometric series](https://en.wikipedia.org/wiki/Geometric_series)

$$f(x) = \sum_{k=0}^{\infty} x^{k}.$$

This diverges when $|x| \geq 1$. On its domain of convergence,

$$f(x) = \frac{1}{1 - x}, \qquad |x| < 1.$$

Now consider

$$g(x) = \frac{1}{1 - x}, \qquad x \neq 1.$$

$g$ agrees with $f$ on $(-1, 1)$ and is defined everywhere else on $\mathbb{R}$ except at $x = 1$, where it has a [simple pole](https://en.wikipedia.org/wiki/Pole_(complex_analysis)). $g$ is the analytic continuation of $f$.

!interactive[geometric-partial-sums]

*Slide $N$ to change the number of terms in the partial sum $S_{N}(x) = \sum_{k=0}^{N} x^{k}$. Inside the shaded band $(-1, 1)$, $S_{N}$ tracks the analytic continuation $1/(1-x)$ closely as $N$ grows. Outside that band, $S_{N}$ diverges and does not approximate $g$ at all.*

Evaluating $g$ at $x = 2$ gives $g(2) = -1$. Of course $1 + 2 + 4 + \cdots \to \infty$ does not equal $-1$; the literal series diverges. But $f$ is a restriction of $g$ to $(-1, 1)$, and the underlying $g(x)$ is equal to $-1$ at the point $x = 2$ where $f(x)$ is not defined.

<div class="intuition"><strong>Intuition.</strong> The value of an analytic continuation outside the original domain is not the value of any convergent partial sum. It is the value of the underlying analytic function that agrees with the series on its domain of convergence.</div>

---

<div class="sneak-peek"><strong>Sneak peek.</strong> The <a href="blog-post.html?post=riemann-hypothesis-intro">Riemann zeta function</a> is defined by a similar series that converges only for $\operatorname{Re}(s) > 1$. Its analytic continuation to $\mathbb{C} \setminus \{1\}$ is what underlies the Riemann Hypothesis.</div>
