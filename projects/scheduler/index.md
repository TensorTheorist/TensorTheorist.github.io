# Scheduling Optimization Engine

*Category: Optimization*
*GitHub: https://github.com/TensorTheorist/scheduler*
*Technologies: Python, OR-Tools, NumPy, FastAPI*

High-performance scheduling solver for production planning and resource allocation.

## Algorithms

- **Constraint Programming** (OR-Tools CP-SAT)
- **Genetic Algorithms**
- **Simulated Annealing**
- **Particle Swarm Optimization**

## Problem Types

### Job Shop Scheduling

```python
from scheduler import JobShopSolver

solver = JobShopSolver()
solver.add_job("J1", [("M1", 3), ("M2", 2), ("M3", 4)])
solver.add_job("J2", [("M2", 2), ("M1", 4), ("M3", 1)])

solution = solver.solve(time_limit=60)
print(f"Makespan: {solution.makespan}")
```

### Resource Constrained Scheduling

```python
from scheduler import RCPSPSolver

solver = RCPSPSolver()
solver.add_resource("workers", capacity=5)
solver.add_task("T1", duration=3, workers=2)
solver.add_task("T2", duration=5, workers=3)
solver.add_precedence("T1", "T2")

solution = solver.solve()
```

## Performance

| Problem Size | CP-SAT | Genetic | SA |
|--------------|--------|---------|-----|
| 10x10 | 0.5s | 2s | 1s |
| 20x20 | 5s | 15s | 8s |
| 50x50 | 60s | 120s | 90s |

## Mathematical Formulation

The job shop scheduling problem minimizes makespan:

$$\min \max_{j} C_j$$

Subject to:
- Precedence constraints within jobs
- Machine capacity constraints (one job per machine at a time)
- Non-preemption constraints
