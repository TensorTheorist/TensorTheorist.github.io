# Linear Algebra Foundations

## Vectors and Matrices

A vector $\mathbf{x} \in \mathbb{R}^n$ is an ordered collection of $n$ real numbers.

The dot product of two vectors:
$$\mathbf{a} \cdot \mathbf{b} = \sum_{i=1}^{n} a_i b_i = \|\mathbf{a}\| \|\mathbf{b}\| \cos\theta$$

## Matrix Operations

Matrix multiplication $(AB)_{ij} = \sum_k A_{ik} B_{kj}$

The transpose $(A^T)_{ij} = A_{ji}$

## Eigenvalue Decomposition

For a square matrix $A$, the eigenvalue equation is:
$$A\mathbf{v} = \lambda \mathbf{v}$$

The spectral decomposition:
$$A = Q\Lambda Q^{-1}$$

## Singular Value Decomposition

Any matrix can be decomposed as:
$$A = U\Sigma V^T$$

where $U$ and $V$ are orthogonal matrices and $\Sigma$ contains singular values.

## Applications in ML

- **PCA**: Uses SVD for dimensionality reduction
- **Matrix Factorization**: Recommender systems
- **Covariance Matrices**: Gaussian distributions
