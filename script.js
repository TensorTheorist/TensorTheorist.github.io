document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTypingEffect();
    initScrollAnimations();
    initProjectsSection();
    initResearchSection();
    initVisualizationTabs();
    initBlogSection();
    initMathSection();
    initGitHubSection();
    initKaTeX();
});

function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        updateActiveNavLink();
    });

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

function initTypingEffect() {
    const typingElement = document.getElementById('typingText');
    if (!typingElement) return;
    
    const roles = [
        'AI Engineer',
        'Machine Learning Researcher',
        'Optimization Systems Expert',
        'Mathematics Enthusiast',
        'Deep Learning Specialist',
        'LLM Developer'
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }
    
    type();
}

function initScrollAnimations() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                scrollTrigger: {
                    trigger: header,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
        
        gsap.utils.toArray('.project-card, .blog-card, .research-domain, .stat-card').forEach((card, i) => {
            gsap.from(card, {
                y: 30,
                opacity: 0,
                duration: 0.5,
                delay: i * 0.1,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    }
}

const projects = [
    {
        id: 'llm-rag',
        title: 'LLM RAG System',
        description: 'Production-ready Retrieval-Augmented Generation system with semantic search, hybrid retrieval, and intelligent reranking for enterprise document QA.',
        category: 'ai',
        tech: ['Python', 'LangChain', 'ChromaDB', 'FastAPI', 'Docker'],
        github: 'https://github.com/TensorTheorist/llm-rag'
    },
    {
        id: 'kg-pipeline',
        title: 'Knowledge Graph Pipeline',
        description: 'End-to-end pipeline for building knowledge graphs from unstructured text using NER, relation extraction, and entity resolution.',
        category: 'ai',
        tech: ['Neo4j', 'spaCy', 'NetworkX', 'Python'],
        github: 'https://github.com/TensorTheorist/kg-pipeline'
    },
    {
        id: 'scheduler',
        title: 'Scheduling Optimization Engine',
        description: 'Advanced scheduling solver using constraint programming and metaheuristics for production planning and resource allocation.',
        category: 'optimization',
        tech: ['Python', 'OR-Tools', 'NumPy', 'FastAPI'],
        github: 'https://github.com/TensorTheorist/scheduler'
    },
    {
        id: 'ml-pipeline',
        title: 'ML Pipeline Framework',
        description: 'Modular machine learning pipeline with automated feature engineering, model selection, and experiment tracking.',
        category: 'ml',
        tech: ['Python', 'scikit-learn', 'MLflow', 'Airflow'],
        github: 'https://github.com/TensorTheorist/ml-pipeline'
    },
    {
        id: 'ai-agents',
        title: 'AI Agent Framework',
        description: 'Framework for building autonomous AI agents with tool use, planning, and multi-step reasoning capabilities.',
        category: 'ai',
        tech: ['Python', 'LangChain', 'OpenAI', 'Redis'],
        github: 'https://github.com/TensorTheorist/ai-agents'
    },
    {
        id: 'inference-api',
        title: 'Model Inference API',
        description: 'High-performance model serving infrastructure with batching, caching, and auto-scaling for production ML deployment.',
        category: 'systems',
        tech: ['Python', 'FastAPI', 'Docker', 'Kubernetes', 'Redis'],
        github: 'https://github.com/TensorTheorist/inference-api'
    },
    {
        id: 'embedding-search',
        title: 'Embedding Search Engine',
        description: 'Semantic search engine using dense embeddings with HNSW indexing for fast approximate nearest neighbor search.',
        category: 'ml',
        tech: ['Python', 'Sentence-Transformers', 'FAISS', 'FastAPI'],
        github: 'https://github.com/TensorTheorist/embedding-search'
    },
    {
        id: 'optim-benchmark',
        title: 'Optimization Benchmark Suite',
        description: 'Comprehensive benchmark suite for evaluating optimization algorithms on classic and real-world problems.',
        category: 'optimization',
        tech: ['Python', 'NumPy', 'Matplotlib', 'Pytest'],
        github: 'https://github.com/TensorTheorist/optim-benchmark'
    }
];

function initProjectsSection() {
    const projectsGrid = document.getElementById('projectsGrid');
    const filterBtns = document.querySelectorAll('.project-filters .filter-btn');
    
    if (!projectsGrid) return;
    
    function renderProjects(filter = 'all') {
        const filteredProjects = filter === 'all' 
            ? projects 
            : projects.filter(p => p.category === filter);
        
        projectsGrid.innerHTML = filteredProjects.map(project => `
            <div class="project-card" data-category="${project.category}">
                <div class="project-header">
                    <div class="project-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </div>
                    <div class="project-links">
                        <a href="${project.github}" target="_blank" class="project-link" aria-label="GitHub">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                        </a>
                    </div>
                </div>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.tech.map(t => `<span class="tech-badge">${t}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }
    
    renderProjects();
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProjects(btn.dataset.filter);
        });
    });
}

const researchItems = {
    aiSystems: [
        {
            title: 'RAG Architecture Patterns',
            abstract: 'Analysis of retrieval-augmented generation architectures for knowledge-intensive NLP tasks.',
            method: 'Comparative study of naive RAG, advanced RAG, and modular RAG patterns.',
            results: 'Identified optimal configurations for different use cases and document types.'
        },
        {
            title: 'Multi-Agent Coordination',
            abstract: 'Framework for coordinating multiple AI agents on complex tasks.',
            method: 'Hierarchical task decomposition with dynamic agent allocation.',
            results: 'Improved task completion rates and reduced redundant computation.'
        }
    ],
    ml: [
        {
            title: 'Feature Engineering Automation',
            abstract: 'Automated feature generation and selection for tabular data.',
            method: 'Genetic programming combined with mutual information criteria.',
            results: 'Achieved competitive performance with minimal manual intervention.'
        },
        {
            title: 'Transfer Learning Strategies',
            abstract: 'Effective transfer learning approaches for domain adaptation.',
            method: 'Progressive fine-tuning with layer-wise learning rate decay.',
            results: 'Reduced training time while maintaining accuracy on target domains.'
        }
    ],
    optimization: [
        {
            title: 'Constraint Programming for Scheduling',
            abstract: 'Application of CP techniques to job shop scheduling problems.',
            method: 'Hybrid approach combining CP with local search heuristics.',
            results: 'Found optimal or near-optimal solutions for benchmark instances.'
        },
        {
            title: 'Metaheuristic Hybridization',
            abstract: 'Combining genetic algorithms with simulated annealing.',
            method: 'Adaptive operator selection based on search landscape analysis.',
            results: 'Improved convergence speed and solution quality.'
        }
    ],
    math: [
        {
            title: 'Gradient Flow Analysis',
            abstract: 'Understanding optimization dynamics through gradient flow.',
            method: 'Mathematical analysis of continuous-time gradient descent.',
            results: 'Derived convergence guarantees for non-convex objectives.'
        },
        {
            title: 'Matrix Factorization Methods',
            abstract: 'Efficient algorithms for large-scale matrix decomposition.',
            method: 'Randomized SVD with iterative refinement.',
            results: 'Achieved near-optimal approximations with reduced complexity.'
        }
    ]
};

function initResearchSection() {
    const aiContainer = document.getElementById('aiSystemsResearch');
    const mlContainer = document.getElementById('mlResearch');
    const optimizationContainer = document.getElementById('optimizationResearch');
    const mathContainer = document.getElementById('mathResearch');
    
    function renderResearchItems(container, items) {
        if (!container) return;
        container.innerHTML = items.map(item => `
            <div class="research-item">
                <h4>${item.title}</h4>
                <p>${item.abstract}</p>
            </div>
        `).join('');
    }
    
    renderResearchItems(aiContainer, researchItems.aiSystems);
    renderResearchItems(mlContainer, researchItems.ml);
    renderResearchItems(optimizationContainer, researchItems.optimization);
    renderResearchItems(mathContainer, researchItems.math);
}

function initVisualizationTabs() {
    const tabs = document.querySelectorAll('.viz-tab');
    const panels = document.querySelectorAll('.viz-panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetViz = tab.dataset.viz;
            
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${targetViz}Viz`).classList.add('active');
        });
    });
}

const blogPosts = [
    {
        id: 'understanding-rag',
        title: 'Understanding Retrieval-Augmented Generation',
        excerpt: 'A deep dive into RAG systems, from basic retrieval to advanced hybrid approaches.',
        date: '2024-02-15',
        category: 'ai',
        content: `
# Understanding Retrieval-Augmented Generation

Retrieval-Augmented Generation (RAG) has become a cornerstone technique for building knowledge-intensive AI applications. This post explores the fundamentals and advanced patterns.

## What is RAG?

RAG combines the generative capabilities of large language models with the precision of information retrieval systems. Instead of relying solely on the knowledge encoded in model weights, RAG systems retrieve relevant context at inference time.

## Basic Architecture

The standard RAG pipeline consists of:

1. **Indexing**: Documents are chunked and embedded into a vector space
2. **Retrieval**: Given a query, find the most relevant chunks
3. **Generation**: Feed retrieved context to the LLM for response generation

\`\`\`python
# Simple RAG pipeline
def rag_pipeline(query, retriever, llm):
    # Retrieve relevant documents
    docs = retriever.search(query, top_k=5)
    
    # Build context
    context = "\\n".join([d.content for d in docs])
    
    # Generate response
    prompt = f"Context: {context}\\n\\nQuestion: {query}"
    return llm.generate(prompt)
\`\`\`

## Advanced Patterns

Modern RAG systems employ sophisticated techniques:

- **Hybrid retrieval**: Combining dense and sparse retrievers
- **Query expansion**: Rewriting queries for better retrieval
- **Reranking**: Using cross-encoders for precision

## Mathematical Foundation

The retrieval score is typically computed as:

$$\\text{score}(q, d) = \\frac{\\mathbf{q} \\cdot \\mathbf{d}}{\\|\\mathbf{q}\\| \\|\\mathbf{d}\\|}$$

where $\\mathbf{q}$ and $\\mathbf{d}$ are the query and document embeddings respectively.
        `
    },
    {
        id: 'optimization-algorithms',
        title: 'A Survey of Optimization Algorithms',
        excerpt: 'From gradient descent to evolutionary algorithms, understanding optimization landscapes.',
        date: '2024-01-28',
        category: 'math',
        content: `
# A Survey of Optimization Algorithms

Optimization lies at the heart of machine learning. This post surveys key algorithms and their properties.

## Gradient-Based Methods

### Gradient Descent

The simplest optimization algorithm updates parameters in the direction of steepest descent:

$$\\theta_{t+1} = \\theta_t - \\eta \\nabla L(\\theta_t)$$

where $\\eta$ is the learning rate and $\\nabla L$ is the gradient of the loss function.

### Adam Optimizer

Adam combines momentum with adaptive learning rates:

\`\`\`python
def adam_update(params, grads, m, v, t, lr=0.001, beta1=0.9, beta2=0.999):
    m = beta1 * m + (1 - beta1) * grads
    v = beta2 * v + (1 - beta2) * grads**2
    m_hat = m / (1 - beta1**t)
    v_hat = v / (1 - beta2**t)
    params = params - lr * m_hat / (np.sqrt(v_hat) + 1e-8)
    return params, m, v
\`\`\`

## Evolutionary Algorithms

For non-differentiable objectives, evolutionary algorithms provide an alternative:

1. **Genetic Algorithms**: Selection, crossover, mutation
2. **Particle Swarm**: Social learning from best solutions
3. **Simulated Annealing**: Temperature-based acceptance probability
        `
    },
    {
        id: 'transformers-explained',
        title: 'Transformers: Attention Is All You Need',
        excerpt: 'Breaking down the transformer architecture and self-attention mechanism.',
        date: '2024-01-10',
        category: 'ml',
        content: `
# Transformers: Attention Is All You Need

The transformer architecture revolutionized NLP and beyond. Let's understand how it works.

## Self-Attention

The core innovation is the self-attention mechanism:

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

This allows each position to attend to all other positions in the sequence.

## Multi-Head Attention

Multiple attention heads capture different relationships:

\`\`\`python
def multi_head_attention(Q, K, V, num_heads):
    d_model = Q.shape[-1]
    d_k = d_model // num_heads
    
    heads = []
    for i in range(num_heads):
        Q_i = linear(Q, d_k)
        K_i = linear(K, d_k)
        V_i = linear(V, d_k)
        head_i = attention(Q_i, K_i, V_i)
        heads.append(head_i)
    
    return linear(concat(heads), d_model)
\`\`\`

## Positional Encoding

Since attention is permutation-invariant, we add positional information:

$$PE_{(pos, 2i)} = \\sin\\left(\\frac{pos}{10000^{2i/d}}\\right)$$
$$PE_{(pos, 2i+1)} = \\cos\\left(\\frac{pos}{10000^{2i/d}}\\right)$$
        `
    },
    {
        id: 'building-ml-systems',
        title: 'Building Production ML Systems',
        excerpt: 'Best practices for deploying machine learning models at scale.',
        date: '2023-12-20',
        category: 'systems',
        content: `
# Building Production ML Systems

Moving from prototype to production requires careful engineering.

## Key Considerations

### Reproducibility

Every prediction should be reproducible:

\`\`\`python
# Set seeds for reproducibility
import random
import numpy as np
import torch

def set_seeds(seed=42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
\`\`\`

### Monitoring

Track model performance in production:

- **Data drift**: Distribution changes in inputs
- **Concept drift**: Relationship changes between inputs and outputs
- **Prediction latency**: Response time percentiles

### Versioning

Version everything:

- Model artifacts
- Training data
- Feature definitions
- Configuration

## Architecture Patterns

### Model Serving

\`\`\`python
from fastapi import FastAPI
import torch

app = FastAPI()
model = load_model("model_v1.pt")

@app.post("/predict")
async def predict(features: dict):
    tensor = preprocess(features)
    with torch.no_grad():
        prediction = model(tensor)
    return {"prediction": prediction.tolist()}
\`\`\`
        `
    }
];

function initBlogSection() {
    const blogGrid = document.getElementById('blogGrid');
    const categoryBtns = document.querySelectorAll('.blog-categories .category-btn');
    const modal = document.getElementById('blogModal');
    const closeModal = document.getElementById('closeBlogModal');
    const postContent = document.getElementById('blogPostContent');
    
    if (!blogGrid) return;
    
    function renderBlogPosts(filter = 'all') {
        const filteredPosts = filter === 'all' 
            ? blogPosts 
            : blogPosts.filter(p => p.category === filter);
        
        blogGrid.innerHTML = filteredPosts.map(post => `
            <div class="blog-card" data-post-id="${post.id}">
                <div class="blog-image">
                    <span class="blog-category-tag">${post.category}</span>
                </div>
                <div class="blog-content">
                    <span class="blog-date">${formatDate(post.date)}</span>
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                </div>
            </div>
        `).join('');
        
        document.querySelectorAll('.blog-card').forEach(card => {
            card.addEventListener('click', () => {
                const postId = card.dataset.postId;
                openBlogPost(postId);
            });
        });
    }
    
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    function openBlogPost(postId) {
        const post = blogPosts.find(p => p.id === postId);
        if (!post || !postContent) return;
        
        let html = marked.parse(post.content);
        
        postContent.innerHTML = html;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        renderMathInElement(postContent, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false },
                { left: '\\[', right: '\\]', display: true },
                { left: '\\(', right: '\\)', display: false }
            ]
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    renderBlogPosts();
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderBlogPosts(btn.dataset.category);
        });
    });
}

const mathNotes = {
    'linear-algebra': {
        title: 'Linear Algebra Foundations',
        content: `
## Vectors and Matrices

A vector $\\mathbf{x} \\in \\mathbb{R}^n$ is an ordered collection of $n$ real numbers.

The dot product of two vectors:
$$\\mathbf{a} \\cdot \\mathbf{b} = \\sum_{i=1}^{n} a_i b_i = \\|\\mathbf{a}\\| \\|\\mathbf{b}\\| \\cos\\theta$$

## Matrix Operations

Matrix multiplication $(\\mathbf{AB})_{ij} = \\sum_k A_{ik} B_{kj}$

The transpose $(\\mathbf{A}^T)_{ij} = A_{ji}$

## Eigenvalue Decomposition

For a square matrix $\\mathbf{A}$, the eigenvalue equation is:
$$\\mathbf{A}\\mathbf{v} = \\lambda \\mathbf{v}$$

The spectral decomposition:
$$\\mathbf{A} = \\mathbf{Q}\\mathbf{\\Lambda}\\mathbf{Q}^{-1}$$

## Singular Value Decomposition

Any matrix can be decomposed as:
$$\\mathbf{A} = \\mathbf{U}\\mathbf{\\Sigma}\\mathbf{V}^T$$

where $\\mathbf{U}$ and $\\mathbf{V}$ are orthogonal matrices.
        `
    },
    'optimization': {
        title: 'Optimization Theory',
        content: `
## Convex Optimization

A function $f$ is convex if:
$$f(\\alpha x + (1-\\alpha)y) \\leq \\alpha f(x) + (1-\\alpha)f(y)$$

for all $x, y$ and $\\alpha \\in [0, 1]$.

## Gradient Descent

The update rule:
$$\\theta_{t+1} = \\theta_t - \\eta \\nabla f(\\theta_t)$$

Convergence rate for convex $f$ with $L$-Lipschitz gradient:
$$f(\\theta_T) - f(\\theta^*) \\leq \\frac{\\|\\theta_0 - \\theta^*\\|^2}{2\\eta T}$$

## Constrained Optimization

The Lagrangian:
$$\\mathcal{L}(x, \\lambda) = f(x) + \\sum_i \\lambda_i g_i(x)$$

KKT conditions:
- $\\nabla_x \\mathcal{L} = 0$
- $\\lambda_i \\geq 0$
- $\\lambda_i g_i(x) = 0$
- $g_i(x) \\leq 0$

## Newton's Method

Second-order update:
$$\\theta_{t+1} = \\theta_t - [\\nabla^2 f(\\theta_t)]^{-1} \\nabla f(\\theta_t)$$
        `
    },
    'probability': {
        title: 'Probability Theory',
        content: `
## Fundamentals

Probability axioms:
1. $P(A) \\geq 0$
2. $P(\\Omega) = 1$
3. $P(A \\cup B) = P(A) + P(B)$ for disjoint events

## Bayes' Theorem

$$P(A|B) = \\frac{P(B|A)P(A)}{P(B)}$$

In machine learning terms:
$$P(\\theta|D) = \\frac{P(D|\\theta)P(\\theta)}{P(D)}$$

## Common Distributions

**Gaussian Distribution:**
$$p(x) = \\frac{1}{\\sqrt{2\\pi\\sigma^2}} \\exp\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)$$

**Multivariate Gaussian:**
$$p(\\mathbf{x}) = \\frac{1}{(2\\pi)^{d/2}|\\Sigma|^{1/2}} \\exp\\left(-\\frac{1}{2}(\\mathbf{x}-\\boldsymbol{\\mu})^T\\Sigma^{-1}(\\mathbf{x}-\\boldsymbol{\\mu})\\right)$$

## Information Theory

**Entropy:**
$$H(X) = -\\sum_x p(x) \\log p(x)$$

**KL Divergence:**
$$D_{KL}(P \\| Q) = \\sum_x P(x) \\log \\frac{P(x)}{Q(x)}$$
        `
    },
    'ml-theory': {
        title: 'Machine Learning Theory',
        content: `
## Loss Functions

**Cross-Entropy Loss:**
$$\\mathcal{L} = -\\sum_i y_i \\log(\\hat{y}_i)$$

**Mean Squared Error:**
$$\\mathcal{L} = \\frac{1}{n}\\sum_i (y_i - \\hat{y}_i)^2$$

## Bias-Variance Tradeoff

$$\\mathbb{E}[(y - \\hat{f}(x))^2] = \\text{Bias}^2 + \\text{Variance} + \\text{Noise}$$

## Regularization

**L2 Regularization (Ridge):**
$$\\mathcal{L}_{reg} = \\mathcal{L} + \\lambda \\|\\theta\\|_2^2$$

**L1 Regularization (Lasso):**
$$\\mathcal{L}_{reg} = \\mathcal{L} + \\lambda \\|\\theta\\|_1$$

## PAC Learning

A concept class $C$ is PAC learnable if there exists an algorithm that, for any $\\epsilon, \\delta > 0$, returns hypothesis $h$ such that:
$$P(\\text{error}(h) \\leq \\epsilon) \\geq 1 - \\delta$$

with sample complexity polynomial in $1/\\epsilon$ and $1/\\delta$.

## VC Dimension

The maximum number of points that can be shattered by hypothesis class $H$.

For linear classifiers in $\\mathbb{R}^d$: $\\text{VC}(H) = d + 1$
        `
    }
};

function initMathSection() {
    const mathTopics = document.querySelectorAll('.math-topic');
    const mathNoteContainer = document.getElementById('selectedMathNote');
    
    mathTopics.forEach(topic => {
        topic.addEventListener('click', () => {
            const topicId = topic.dataset.topic;
            const note = mathNotes[topicId];
            
            if (!note || !mathNoteContainer) return;
            
            mathTopics.forEach(t => t.classList.remove('active'));
            topic.classList.add('active');
            
            mathNoteContainer.innerHTML = `
                <h3>${note.title}</h3>
                ${marked.parse(note.content)}
            `;
            
            renderMathInElement(mathNoteContainer, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false },
                    { left: '\\[', right: '\\]', display: true },
                    { left: '\\(', right: '\\)', display: false }
                ]
            });
        });
    });
}

function initGitHubSection() {
    const username = 'TensorTheorist';
    
    fetchGitHubData(username);
    renderContributionGraph();
}

async function fetchGitHubData(username) {
    const repoCountEl = document.getElementById('repoCount');
    const starCountEl = document.getElementById('starCount');
    const followerCountEl = document.getElementById('followerCount');
    const recentReposEl = document.getElementById('recentRepos');
    
    try {
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        const userData = await userResponse.json();
        
        if (repoCountEl) repoCountEl.textContent = userData.public_repos || 0;
        if (followerCountEl) followerCountEl.textContent = userData.followers || 0;
        
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        const reposData = await reposResponse.json();
        
        let totalStars = 0;
        if (Array.isArray(reposData)) {
            reposData.forEach(repo => {
                totalStars += repo.stargazers_count || 0;
            });
        }
        if (starCountEl) starCountEl.textContent = totalStars;
        
        if (recentReposEl && Array.isArray(reposData)) {
            recentReposEl.innerHTML = reposData.slice(0, 6).map(repo => `
                <a href="${repo.html_url}" target="_blank" class="repo-card">
                    <h4 class="repo-name">${repo.name}</h4>
                    <p class="repo-description">${repo.description || 'No description'}</p>
                    <div class="repo-stats">
                        <span class="repo-stat">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                            ${repo.stargazers_count}
                        </span>
                        <span class="repo-stat">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="4"></circle>
                                <line x1="1.05" y1="12" x2="7" y2="12"></line>
                                <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                            </svg>
                            ${repo.forks_count}
                        </span>
                        ${repo.language ? `<span class="repo-stat">${repo.language}</span>` : ''}
                    </div>
                </a>
            `).join('');
        }
    } catch (error) {
        console.log('GitHub API rate limited or unavailable');
        
        if (repoCountEl) repoCountEl.textContent = '10+';
        if (starCountEl) starCountEl.textContent = '50+';
        if (followerCountEl) followerCountEl.textContent = '100+';
    }
}

function renderContributionGraph() {
    const graphContainer = document.getElementById('contributionGraph');
    if (!graphContainer) return;
    
    const weeks = 52;
    const days = 7;
    
    let html = '<div class="contribution-grid">';
    
    for (let w = 0; w < weeks; w++) {
        html += '<div class="contribution-column">';
        for (let d = 0; d < days; d++) {
            const level = Math.floor(Math.random() * 5);
            html += `<div class="contribution-cell level-${level}"></div>`;
        }
        html += '</div>';
    }
    
    html += '</div>';
    graphContainer.innerHTML = html;
}

function initKaTeX() {
    if (typeof renderMathInElement === 'function') {
        document.querySelectorAll('.math-content, .blog-post').forEach(el => {
            renderMathInElement(el, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false },
                    { left: '\\[', right: '\\]', display: true },
                    { left: '\\(', right: '\\)', display: false }
                ],
                throwOnError: false
            });
        });
    }
}
