# A Survey of Optimization Algorithms

*Published: January 28, 2024*
*Category: Mathematics*

Optimization lies at the heart of machine learning. This post surveys key algorithms and their properties.

![Optimization Landscape](sample-image.jpg)

## Gradient-Based Methods

### Gradient Descent

The simplest optimization algorithm updates parameters in the direction of steepest descent:

$$\theta_{t+1} = \theta_t - \eta \nabla L(\theta_t)$$

where $\eta$ is the learning rate and $\nabla L$ is the gradient of the loss function.

### Adam Optimizer

Adam combines momentum with adaptive learning rates:

```python
def adam_update(params, grads, m, v, t, lr=0.001, beta1=0.9, beta2=0.999):
    m = beta1 * m + (1 - beta1) * grads
    v = beta2 * v + (1 - beta2) * grads**2
    m_hat = m / (1 - beta1**t)
    v_hat = v / (1 - beta2**t)
    params = params - lr * m_hat / (np.sqrt(v_hat) + 1e-8)
    return params, m, v
```

???Click to see convergence analysis

## Convergence Analysis

For smooth convex functions with $L$-Lipschitz gradients, gradient descent converges at rate:

$$f(\theta_t) - f(\theta^*) \leq \frac{L \|\theta_0 - \theta^*\|^2}{2t}$$

???

## Supplementary Materials

!pdf[sample1.pdf]

!pdf[sample2.pdf]

## Evolutionary Algorithms

For non-differentiable objectives, evolutionary algorithms provide an alternative:

1. **Genetic Algorithms**: Selection, crossover, mutation
2. **Particle Swarm**: Social learning from best solutions
3. **Simulated Annealing**: Temperature-based acceptance probability

