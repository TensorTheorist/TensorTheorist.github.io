# Optimization Theory

## Convex Optimization

A function $f$ is convex if:
$$f(\alpha x + (1-\alpha)y) \leq \alpha f(x) + (1-\alpha)f(y)$$

for all $x, y$ and $\alpha \in [0, 1]$.

## Gradient Descent

The update rule:
$$\theta_{t+1} = \theta_t - \eta \nabla f(\theta_t)$$

Convergence rate for convex $f$ with $L$-Lipschitz gradient:
$$f(\theta_T) - f(\theta^*) \leq \frac{\|\theta_0 - \theta^*\|^2}{2\eta T}$$

## Constrained Optimization

The Lagrangian:
$$\mathcal{L}(x, \lambda) = f(x) + \sum_i \lambda_i g_i(x)$$

KKT conditions:
- $\nabla_x \mathcal{L} = 0$
- $\lambda_i \geq 0$
- $\lambda_i g_i(x) = 0$
- $g_i(x) \leq 0$

## Newton's Method

Second-order update:
$$\theta_{t+1} = \theta_t - [\nabla^2 f(\theta_t)]^{-1} \nabla f(\theta_t)$$
