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
    
    if (document.getElementById('blogGrid')) {
        initBlogSection();
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
    
    updateHljsTheme();
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateHljsTheme();
        });
    }
}

function updateHljsTheme() {
    const theme = document.documentElement.getAttribute('data-theme');
    const darkStylesheet = document.getElementById('hljs-dark');
    const lightStylesheet = document.getElementById('hljs-light');
    
    if (darkStylesheet && lightStylesheet) {
        if (theme === 'light') {
            darkStylesheet.disabled = true;
            lightStylesheet.disabled = false;
        } else {
            darkStylesheet.disabled = false;
            lightStylesheet.disabled = true;
        }
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
        github: 'https://github.com/TensorTheorist/llm-rag',
        image: 'rag',
        visualizations: ['embedding']
    },
    {
        id: 'kg-pipeline',
        title: 'Knowledge Graph Pipeline',
        description: 'End-to-end pipeline for building knowledge graphs from unstructured text using NER, relation extraction, and entity resolution.',
        category: 'ai',
        tech: ['Neo4j', 'spaCy', 'NetworkX', 'Python'],
        github: 'https://github.com/TensorTheorist/kg-pipeline',
        image: 'kg',
        visualizations: ['embedding']
    },
    {
        id: 'scheduler',
        title: 'Scheduling Optimization Engine',
        description: 'Advanced scheduling solver using constraint programming and metaheuristics for production planning and resource allocation.',
        category: 'optimization',
        tech: ['Python', 'OR-Tools', 'NumPy', 'FastAPI'],
        github: 'https://github.com/TensorTheorist/scheduler',
        image: 'scheduler',
        visualizations: ['optimization']
    },
    {
        id: 'ml-pipeline',
        title: 'ML Pipeline Framework',
        description: 'Modular machine learning pipeline with automated feature engineering, model selection, and experiment tracking.',
        category: 'ml',
        tech: ['Python', 'scikit-learn', 'MLflow', 'Airflow'],
        github: 'https://github.com/TensorTheorist/ml-pipeline',
        image: 'pipeline',
        visualizations: ['neural', 'gradient']
    },
    {
        id: 'ai-agents',
        title: 'AI Agent Framework',
        description: 'Framework for building autonomous AI agents with tool use, planning, and multi-step reasoning capabilities.',
        category: 'ai',
        tech: ['Python', 'LangChain', 'OpenAI', 'Redis'],
        github: 'https://github.com/TensorTheorist/ai-agents',
        image: 'agent',
        visualizations: []
    },
    {
        id: 'inference-api',
        title: 'Model Inference API',
        description: 'High-performance model serving infrastructure with batching, caching, and auto-scaling for production ML deployment.',
        category: 'systems',
        tech: ['Python', 'FastAPI', 'Docker', 'Kubernetes', 'Redis'],
        github: 'https://github.com/TensorTheorist/inference-api',
        image: 'api',
        visualizations: []
    },
    {
        id: 'embedding-search',
        title: 'Embedding Search Engine',
        description: 'Semantic search engine using dense embeddings with HNSW indexing for fast approximate nearest neighbor search.',
        category: 'ml',
        tech: ['Python', 'Sentence-Transformers', 'FAISS', 'FastAPI'],
        github: 'https://github.com/TensorTheorist/embedding-search',
        image: 'search',
        visualizations: ['embedding']
    },
    {
        id: 'optim-benchmark',
        title: 'Optimization Benchmark Suite',
        description: 'Comprehensive benchmark suite for evaluating optimization algorithms on classic and real-world problems.',
        category: 'optimization',
        tech: ['Python', 'NumPy', 'Matplotlib', 'Pytest'],
        github: 'https://github.com/TensorTheorist/optim-benchmark',
        image: 'benchmark',
        visualizations: ['gradient', 'optimization']
    }
];

const projectIcons = {
    rag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <circle cx="12" cy="15" r="3"></circle>
        <path d="M12 12v-2M12 18v2"></path>
    </svg>`,
    kg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="6" cy="6" r="3"></circle>
        <circle cx="18" cy="6" r="3"></circle>
        <circle cx="6" cy="18" r="3"></circle>
        <circle cx="18" cy="18" r="3"></circle>
        <line x1="9" y1="6" x2="15" y2="6"></line>
        <line x1="6" y1="9" x2="6" y2="15"></line>
        <line x1="18" y1="9" x2="18" y2="15"></line>
        <line x1="9" y1="18" x2="15" y2="18"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>`,
    scheduler: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
        <rect x="7" y="14" width="3" height="3" fill="currentColor" opacity="0.3"></rect>
        <rect x="14" y="14" width="3" height="3" fill="currentColor" opacity="0.3"></rect>
    </svg>`,
    pipeline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="5" cy="12" r="3"></circle>
        <circle cx="19" cy="12" r="3"></circle>
        <circle cx="12" cy="5" r="2"></circle>
        <circle cx="12" cy="19" r="2"></circle>
        <path d="M8 12h8M12 7v10"></path>
        <path d="M7.5 9.5L10 7M16.5 9.5L14 7M7.5 14.5L10 17M16.5 14.5L14 17"></path>
    </svg>`,
    agent: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="8" r="5"></circle>
        <path d="M3 21v-2a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2"></path>
        <circle cx="12" cy="8" r="2"></circle>
        <path d="M12 3v2M9 5.5l1 1M15 5.5l-1 1"></path>
    </svg>`,
    api: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
        <polyline points="7 8 9 10 7 12"></polyline>
        <line x1="11" y1="12" x2="17" y2="12"></line>
    </svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        <path d="M8 8l6 6M14 8l-6 6" opacity="0.3"></path>
    </svg>`,
    benchmark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
        <polyline points="3 17 9 11 13 15 21 7"></polyline>
        <polyline points="17 7 21 7 21 11"></polyline>
    </svg>`,
    ai: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"></path>
    </svg>`,
    ml: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>`,
    optimization: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>`,
    systems: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>`
};

function initProjectsSection() {
    const projectsGrid = document.getElementById('projectsGrid');
    const filterBtns = document.querySelectorAll('.project-filters .filter-btn');
    
    if (!projectsGrid) return;
    
    function renderProjects(filter = 'all') {
        const filteredProjects = filter === 'all' 
            ? projects 
            : projects.filter(p => p.category === filter);
        
        projectsGrid.innerHTML = filteredProjects.map(project => `
            <a href="project.html?id=${project.id}" class="project-card" data-project-id="${project.id}">
                <div class="project-body">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">
                        ${project.tech.map(t => `<span class="tech-badge">${t}</span>`).join('')}
                    </div>
                </div>
            </a>
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

const blogPosts = [
    {
        id: 'understanding-rag',
        title: 'Understanding Retrieval-Augmented Generation',
        excerpt: 'A deep dive into RAG systems, from basic retrieval to advanced hybrid approaches.',
        date: '2024-02-15',
        category: 'ai',
        image: 'ai'
    },
    {
        id: 'optimization-algorithms',
        title: 'A Survey of Optimization Algorithms',
        excerpt: 'From gradient descent to evolutionary algorithms, understanding optimization landscapes.',
        date: '2024-01-28',
        category: 'math',
        image: 'math'
    },
    {
        id: 'transformers-explained',
        title: 'Transformers: Attention Is All You Need',
        excerpt: 'Breaking down the transformer architecture and self-attention mechanism.',
        date: '2024-01-10',
        category: 'ml',
        image: 'ml'
    },
    {
        id: 'building-ml-systems',
        title: 'Building Production ML Systems',
        excerpt: 'Best practices for deploying machine learning models at scale.',
        date: '2023-12-20',
        category: 'systems',
        image: 'systems'
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
    
    if (!blogGrid) return;
    
    function renderBlogPosts(filter = 'all') {
        const filteredPosts = filter === 'all' 
            ? blogPosts 
            : blogPosts.filter(p => p.category === filter);
        
        blogGrid.innerHTML = filteredPosts.map(post => `
            <a href="blog-post.html?post=${post.id}" class="blog-card" data-post-id="${post.id}">
                <div class="blog-content">
                    <span class="blog-date">${formatDate(post.date)}</span>
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                </div>
            </a>
        `).join('');
    }
    
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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
