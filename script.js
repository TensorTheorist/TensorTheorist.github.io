document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initNavigation();
    
    if (document.getElementById('typingText')) {
        initTypingEffect();
        initGitHubStats();
    }
    
    if (document.getElementById('projectsGrid')) {
        initProjectsSection();
    }
    
    if (document.getElementById('aiSystemsResearch')) {
        initResearchSection();
    }
    
    if (document.querySelector('.viz-tab')) {
        initVisualizationTabs();
    }
    
    if (document.getElementById('blogGrid')) {
        initBlogSection();
    }
    
    if (document.querySelector('.math-topic')) {
        initMathSection();
    }
    
    if (document.getElementById('profileImageContainer')) {
        initImageZoom();
    }
});

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (!prefersDark.matches) {
        document.documentElement.setAttribute('data-theme', 'light');
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
}

function initTypingEffect() {
    const typingElement = document.getElementById('typingText');
    if (!typingElement) return;
    
    const roles = [
        'AI/ML Research Engineer',
        'Machine Learning Specialist',
        'Optimization Systems Expert',
        'Mathematics Enthusiast',
        'Deep Learning Researcher',
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

async function initGitHubStats() {
    const username = 'TensorTheorist';
    
    try {
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        const userData = await userResponse.json();
        
        const repoCountEl = document.getElementById('repoCount');
        const followerCountEl = document.getElementById('followerCount');
        
        if (repoCountEl && userData.public_repos) {
            repoCountEl.textContent = userData.public_repos;
        }
        if (followerCountEl && userData.followers) {
            followerCountEl.textContent = userData.followers;
        }
        
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        const reposData = await reposResponse.json();
        
        if (Array.isArray(reposData)) {
            let totalStars = 0;
            reposData.forEach(repo => {
                totalStars += repo.stargazers_count || 0;
            });
            const starCountEl = document.getElementById('starCount');
            if (starCountEl) {
                starCountEl.textContent = totalStars;
            }
        }
    } catch (error) {
        console.log('GitHub API unavailable');
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
        { title: 'RAG Architecture Patterns', abstract: 'Analysis of retrieval-augmented generation architectures for knowledge-intensive NLP tasks.' },
        { title: 'Multi-Agent Coordination', abstract: 'Framework for coordinating multiple AI agents on complex tasks.' }
    ],
    ml: [
        { title: 'Feature Engineering Automation', abstract: 'Automated feature generation and selection for tabular data.' },
        { title: 'Transfer Learning Strategies', abstract: 'Effective transfer learning approaches for domain adaptation.' }
    ],
    optimization: [
        { title: 'Constraint Programming for Scheduling', abstract: 'Application of CP techniques to job shop scheduling problems.' },
        { title: 'Metaheuristic Hybridization', abstract: 'Combining genetic algorithms with simulated annealing.' }
    ],
    math: [
        { title: 'Gradient Flow Analysis', abstract: 'Understanding optimization dynamics through gradient flow.' },
        { title: 'Matrix Factorization Methods', abstract: 'Efficient algorithms for large-scale matrix decomposition.' }
    ]
};

function initResearchSection() {
    const containers = {
        ai: document.getElementById('aiSystemsResearch'),
        ml: document.getElementById('mlResearch'),
        optimization: document.getElementById('optimizationResearch'),
        math: document.getElementById('mathResearch')
    };
    
    function renderItems(container, items) {
        if (!container) return;
        container.innerHTML = items.map(item => `
            <div class="research-item">
                <h4>${item.title}</h4>
                <p>${item.abstract}</p>
            </div>
        `).join('');
    }
    
    renderItems(containers.ai, researchItems.aiSystems);
    renderItems(containers.ml, researchItems.ml);
    renderItems(containers.optimization, researchItems.optimization);
    renderItems(containers.math, researchItems.math);
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
        image: 'ai',
        content: `# Understanding Retrieval-Augmented Generation\n\nRetrieval-Augmented Generation (RAG) has become a cornerstone technique for building knowledge-intensive AI applications.\n\n## What is RAG?\n\nRAG combines the generative capabilities of large language models with the precision of information retrieval systems.\n\n## Basic Architecture\n\nThe standard RAG pipeline consists of:\n\n1. **Indexing**: Documents are chunked and embedded\n2. **Retrieval**: Find the most relevant chunks\n3. **Generation**: Feed retrieved context to the LLM\n\n\`\`\`python\ndef rag_pipeline(query, retriever, llm):\n    docs = retriever.search(query, top_k=5)\n    context = "\\n".join([d.content for d in docs])\n    prompt = f"Context: {context}\\n\\nQuestion: {query}"\n    return llm.generate(prompt)\n\`\`\`\n\n## Mathematical Foundation\n\n$$\\text{score}(q, d) = \\frac{\\mathbf{q} \\cdot \\mathbf{d}}{\\|\\mathbf{q}\\| \\|\\mathbf{d}\\|}$$`
    },
    {
        id: 'optimization-algorithms',
        title: 'A Survey of Optimization Algorithms',
        excerpt: 'From gradient descent to evolutionary algorithms, understanding optimization landscapes.',
        date: '2024-01-28',
        category: 'math',
        image: 'math',
        content: `# A Survey of Optimization Algorithms\n\nOptimization lies at the heart of machine learning.\n\n## Gradient Descent\n\n$$\\theta_{t+1} = \\theta_t - \\eta \\nabla L(\\theta_t)$$\n\n## Adam Optimizer\n\n\`\`\`python\ndef adam_update(params, grads, m, v, t, lr=0.001):\n    m = 0.9 * m + 0.1 * grads\n    v = 0.999 * v + 0.001 * grads**2\n    return params - lr * m / (np.sqrt(v) + 1e-8)\n\`\`\``
    },
    {
        id: 'transformers-explained',
        title: 'Transformers: Attention Is All You Need',
        excerpt: 'Breaking down the transformer architecture and self-attention mechanism.',
        date: '2024-01-10',
        category: 'ml',
        image: 'ml',
        content: `# Transformers: Attention Is All You Need\n\nThe transformer architecture revolutionized NLP and beyond.\n\n## Self-Attention\n\n$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$\n\n## Positional Encoding\n\n$$PE_{(pos, 2i)} = \\sin\\left(\\frac{pos}{10000^{2i/d}}\\right)$$`
    },
    {
        id: 'building-ml-systems',
        title: 'Building Production ML Systems',
        excerpt: 'Best practices for deploying machine learning models at scale.',
        date: '2023-12-20',
        category: 'systems',
        image: 'systems',
        content: `# Building Production ML Systems\n\nMoving from prototype to production requires careful engineering.\n\n## Key Considerations\n\n### Reproducibility\n\n\`\`\`python\nimport random, numpy as np, torch\n\ndef set_seeds(seed=42):\n    random.seed(seed)\n    np.random.seed(seed)\n    torch.manual_seed(seed)\n\`\`\`\n\n### Model Serving\n\n\`\`\`python\nfrom fastapi import FastAPI\napp = FastAPI()\n\n@app.post("/predict")\nasync def predict(features: dict):\n    return {"prediction": model(features)}\n\`\`\``
    }
];

const blogIcons = {
    ai: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"></path>
    </svg>`,
    ml: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>`,
    math: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>`,
    systems: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>`
};

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
                <div class="blog-image blog-image-${post.image}">
                    <span class="blog-category-tag">${post.category}</span>
                    <div class="blog-image-icon">
                        ${blogIcons[post.image] || blogIcons.ai}
                    </div>
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
                openBlogPost(card.dataset.postId);
            });
        });
    }
    
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    
    function openBlogPost(postId) {
        const post = blogPosts.find(p => p.id === postId);
        if (!post || !postContent) return;
        
        let html = marked.parse(post.content);
        postContent.innerHTML = html;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        if (typeof renderMathInElement === 'function') {
            renderMathInElement(postContent, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false }
                ]
            });
        }
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
        content: `## Vectors and Matrices\n\nA vector $\\mathbf{x} \\in \\mathbb{R}^n$ is an ordered collection of $n$ real numbers.\n\n$$\\mathbf{a} \\cdot \\mathbf{b} = \\sum_{i=1}^{n} a_i b_i$$\n\n## Eigenvalue Decomposition\n\n$$\\mathbf{A}\\mathbf{v} = \\lambda \\mathbf{v}$$\n\n## Singular Value Decomposition\n\n$$\\mathbf{A} = \\mathbf{U}\\mathbf{\\Sigma}\\mathbf{V}^T$$`
    },
    'optimization': {
        title: 'Optimization Theory',
        content: `## Convex Optimization\n\n$$f(\\alpha x + (1-\\alpha)y) \\leq \\alpha f(x) + (1-\\alpha)f(y)$$\n\n## Gradient Descent\n\n$$\\theta_{t+1} = \\theta_t - \\eta \\nabla f(\\theta_t)$$\n\n## Lagrangian\n\n$$\\mathcal{L}(x, \\lambda) = f(x) + \\sum_i \\lambda_i g_i(x)$$`
    },
    'probability': {
        title: 'Probability Theory',
        content: `## Bayes' Theorem\n\n$$P(A|B) = \\frac{P(B|A)P(A)}{P(B)}$$\n\n## Gaussian Distribution\n\n$$p(x) = \\frac{1}{\\sqrt{2\\pi\\sigma^2}} \\exp\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)$$\n\n## KL Divergence\n\n$$D_{KL}(P \\| Q) = \\sum_x P(x) \\log \\frac{P(x)}{Q(x)}$$`
    },
    'ml-theory': {
        title: 'Machine Learning Theory',
        content: `## Cross-Entropy Loss\n\n$$\\mathcal{L} = -\\sum_i y_i \\log(\\hat{y}_i)$$\n\n## Bias-Variance Tradeoff\n\n$$\\mathbb{E}[(y - \\hat{f}(x))^2] = \\text{Bias}^2 + \\text{Variance} + \\text{Noise}$$\n\n## Regularization\n\n$$\\mathcal{L}_{reg} = \\mathcal{L} + \\lambda \\|\\theta\\|_2^2$$`
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
            
            mathNoteContainer.innerHTML = `<h3>${note.title}</h3>${marked.parse(note.content)}`;
            
            if (typeof renderMathInElement === 'function') {
                renderMathInElement(mathNoteContainer, {
                    delimiters: [
                        { left: '$$', right: '$$', display: true },
                        { left: '$', right: '$', display: false }
                    ]
                });
            }
        });
    });
}

function initImageZoom() {
    const imageContainer = document.getElementById('profileImageContainer');
    const profileImage = document.getElementById('profileImage');
    const zoomModal = document.getElementById('imageZoomModal');
    const zoomedImage = document.getElementById('zoomedImage');
    const closeZoom = document.getElementById('closeZoomModal');
    
    if (!imageContainer || !zoomModal) return;
    
    imageContainer.addEventListener('click', () => {
        if (profileImage) {
            zoomedImage.src = profileImage.src;
            zoomModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
    
    if (closeZoom) {
        closeZoom.addEventListener('click', () => {
            zoomModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    zoomModal.addEventListener('click', (e) => {
        if (e.target === zoomModal) {
            zoomModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && zoomModal.classList.contains('active')) {
            zoomModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}
