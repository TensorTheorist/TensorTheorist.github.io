# Groups: the intuition first

*Published: August 31, 2026*
*Category: Abstract Algebra*

Short note. What is a group, before the four axioms scare anyone?

---

## The one-line answer

A **group** is a set of moves you can undo. Nothing more.

If I can rotate a Rubik's cube, I can rotate it back. That's the whole idea.

## The definition, once you're convinced

A group $(G, \cdot)$ is a set $G$ with a binary operation $\cdot$ such that:

1. **Closure** — $a \cdot b \in G$ for all $a, b \in G$.
2. **Associativity** — $(a \cdot b) \cdot c = a \cdot (b \cdot c)$.
3. **Identity** — some $e \in G$ satisfies $e \cdot a = a \cdot e = a$.
4. **Inverse** — every $a$ has some $a^{-1}$ with $a \cdot a^{-1} = e$.

Read the axioms slowly. They are exactly what "moves that can be undone" force you to say.

## Two examples you already know

- $(\mathbb{Z}, +)$ — the integers under addition. Identity $0$, inverses $-n$.
- Rotations of a square by multiples of $90^{\circ}$ — a group of order $4$.

*Next note:* subgroups, and why they aren't optional.
