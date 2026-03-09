# Optimization Benchmark Suite

*Category: Optimization*
*GitHub: https://github.com/TensorTheorist/optim-benchmark*
*Technologies: Python, NumPy, Matplotlib, Pytest*

Evaluate optimization algorithms systematically.

## Test Functions

### Continuous Optimization
- Rosenbrock, Rastrigin, Ackley
- Sphere, Griewank, Schwefel
- Custom functions

### Combinatorial
- TSP, Knapsack, Graph Coloring
- Job Shop, Vehicle Routing

## Usage

```python
from optim_benchmark import Benchmark, algorithms

# Define benchmark
bench = Benchmark(
    functions=["rosenbrock", "rastrigin"],
    dimensions=[2, 10, 50],
    algorithms=[
        algorithms.GradientDescent(lr=0.01),
        algorithms.Adam(lr=0.001),
        algorithms.PSO(particles=50),
        algorithms.GeneticAlgorithm(pop_size=100)
    ],
    runs=30
)

# Run and analyze
results = bench.run()
results.plot_convergence()
results.statistical_comparison()
```

## Metrics

- Convergence rate
- Final solution quality
- Computational cost
- Statistical significance testing

## Test Functions

### Rosenbrock Function

$$f(x) = \sum_{i=1}^{n-1} \left[ 100(x_{i+1} - x_i^2)^2 + (1-x_i)^2 \right]$$

Global minimum at $x^* = (1, 1, ..., 1)$, $f(x^*) = 0$

### Rastrigin Function

$$f(x) = 10n + \sum_{i=1}^{n} \left[ x_i^2 - 10\cos(2\pi x_i) \right]$$

Global minimum at $x^* = (0, 0, ..., 0)$, $f(x^*) = 0$

## Visualization

```python
from optim_benchmark.viz import plot_landscape, plot_trajectory

# Plot 2D landscape
plot_landscape("rosenbrock", xlim=(-2, 2), ylim=(-1, 3))

# Plot optimization trajectory
plot_trajectory(results["GradientDescent"], function="rosenbrock")
```

## Statistical Analysis

```python
from optim_benchmark.stats import wilcoxon_test, friedman_test

# Pairwise comparison
p_value = wilcoxon_test(results["Adam"], results["SGD"])

# Multi-algorithm comparison
rankings = friedman_test(results)
print(rankings)
```
