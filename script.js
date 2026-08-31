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

    if (document.getElementById('notesCategoryGrid')) {
        initNotesCategoryGrid();
    }

    if (document.getElementById('notesSubjectGrid')) {
        initNotesSubjectGrid();
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
        'Math Writer & Educator',
        'Popular Math on YouTube',
        'Riemann Hypothesis Explorer',
        'Collatz Conjecture Enthusiast',
        'Number Theory Storyteller'
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
        id: 'millennium-problems-overview',
        title: 'The Seven Millennium Problems: A Tour',
        excerpt: 'A short guide to the seven problems the Clay Institute put a million dollars behind — and why they matter.',
        date: '2026-08-31',
        category: 'famous-problems',
        image: 'math',
        youtube: ''
    },
    {
        id: 'riemann-hypothesis-intro',
        title: 'The Riemann Hypothesis: A Gentle Introduction',
        excerpt: 'Why the zeros of a single complex function encode the deepest secrets of the prime numbers.',
        date: '2026-08-31',
        category: 'riemann',
        image: 'math',
        youtube: ''
    },
    {
        id: 'collatz-conjecture',
        title: 'The Collatz Conjecture: 3n + 1 and the Simplest Unsolved Problem',
        excerpt: 'Pick any number. Halve it if even, triple-plus-one if odd. Do we always reach 1?',
        date: '2026-08-24',
        category: 'collatz',
        image: 'math',
        youtube: ''
    },
    {
        id: 'primes-and-zeta',
        title: 'Primes, the Zeta Function, and Euler’s Product Formula',
        excerpt: 'How Euler tied prime numbers to an infinite series, and why it changed number theory forever.',
        date: '2026-08-17',
        category: 'number-theory',
        image: 'math',
        youtube: ''
    },
    {
        id: 'why-math-is-beautiful',
        title: 'Why Math Is Beautiful (And Why Nobody Told You)',
        excerpt: 'A popular-math essay on the aesthetics of proof, symmetry, and unexpected connections.',
        date: '2026-08-10',
        category: 'popular',
        image: 'math',
        youtube: ''
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
                    ${post.youtube ? `<span class="blog-youtube">▶ Watch on YouTube</span>` : ''}
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

const notesCategories = [
    {
        id: 'algebra',
        title: 'Algebra',
        blurb: 'Structures — groups, rings, fields, modules, and everything built on top of them.',
        subjects: [
            { id: 'abstract-algebra', title: 'Abstract Algebra', textbook: 'Dummit & Foote — Abstract Algebra', image: 'assets/textbooks/dummit-foote.jpeg',
              pages: [
                  { id: 'groups-intuition', title: 'Groups: the intuition first' }
              ] },
            { id: 'module-theory', title: 'Module Theory', textbook: 'Lang — Algebra (Ch. III)', image: 'assets/textbooks/lang-algebra.jpg', pages: [] },
            { id: 'galois-theory', title: 'Galois Theory', textbook: 'Milne — Fields and Galois Theory', image: 'assets/textbooks/milne-galois.jpg', pages: [] },
            { id: 'commutative-algebra', title: 'Commutative Algebra', textbook: 'Atiyah & Macdonald', image: 'assets/textbooks/atiyah-macdonald.jpg', pages: [] },
            { id: 'homological-algebra', title: 'Homological Algebra', textbook: 'Weibel — An Introduction to Homological Algebra', image: 'assets/textbooks/weibel.jpg', pages: [] },
            { id: 'algebraic-number-theory', title: 'Algebraic Number Theory', textbook: 'Neukirch — Algebraic Number Theory', image: 'assets/textbooks/neukirch.jpg', pages: [] }
        ]
    },
    {
        id: 'analysis',
        title: 'Analysis',
        blurb: 'Limits, measure, and the geometry of function spaces.',
        subjects: [
            { id: 'real-analysis', title: 'Real Analysis', textbook: 'Rudin — Principles of Mathematical Analysis', image: 'assets/textbooks/baby-rudin.jpg', pages: [] },
            { id: 'complex-analysis', title: 'Complex Analysis', textbook: 'Ahlfors — Complex Analysis', image: 'assets/textbooks/ahlfors.jpg', pages: [] },
            { id: 'measure-theory', title: 'Measure Theory', textbook: 'Folland — Real Analysis', image: 'assets/textbooks/folland.jpg', pages: [] },
            { id: 'functional-analysis', title: 'Functional Analysis', textbook: 'Rudin — Functional Analysis', image: 'assets/textbooks/rudin-fa.jpg', pages: [] },
            { id: 'harmonic-analysis', title: 'Harmonic Analysis', textbook: 'Stein & Shakarchi — Fourier Analysis', image: 'assets/textbooks/stein-fourier.jpg', pages: [] }
        ]
    },
    {
        id: 'topology',
        title: 'Topology',
        blurb: 'Shape without distance — open sets, continuity, and invariants.',
        subjects: [
            { id: 'point-set-topology', title: 'Point-Set Topology', textbook: 'Munkres — Topology', image: 'assets/textbooks/munkres.jpg', pages: [] },
            { id: 'algebraic-topology', title: 'Algebraic Topology', textbook: 'Hatcher — Algebraic Topology', image: 'assets/textbooks/hatcher.jpg', pages: [] },
            { id: 'differential-topology', title: 'Differential Topology', textbook: 'Guillemin & Pollack', image: 'assets/textbooks/guillemin-pollack.jpg', pages: [] },
            { id: 'geometric-topology', title: 'Geometric Topology', textbook: 'Thurston — Three-Dimensional Geometry and Topology', image: 'assets/textbooks/thurston.jpg', pages: [] }
        ]
    },
    {
        id: 'number-theory',
        title: 'Number Theory',
        blurb: 'Integers and the deep structure hiding inside them.',
        subjects: [
            { id: 'elementary-number-theory', title: 'Elementary Number Theory', textbook: 'Hardy & Wright — An Introduction to the Theory of Numbers', image: 'assets/textbooks/hardy-wright.jpg', pages: [] },
            { id: 'analytic-number-theory', title: 'Analytic Number Theory', textbook: 'Apostol — Introduction to Analytic Number Theory', image: 'assets/textbooks/apostol.jpg', pages: [] },
            { id: 'algebraic-number-theory-nt', title: 'Algebraic Number Theory', textbook: 'Marcus — Number Fields', image: 'assets/textbooks/marcus.jpg', pages: [] },
            { id: 'transcendence-theory', title: 'Transcendence Theory', textbook: 'Baker — Transcendental Number Theory', image: 'assets/textbooks/baker.jpg', pages: [] }
        ]
    },
    {
        id: 'competition-math',
        title: 'Competition Math',
        blurb: 'Problem-solving from JEE up through the IMO and Putnam.',
        subjects: [
            { id: 'jee', title: 'JEE', textbook: 'Cengage / Arihant / TMH', image: 'assets/textbooks/jee.jpg', pages: [] },
            { id: 'aime', title: 'AIME', textbook: 'Art of Problem Solving — AIME Volumes', image: 'assets/textbooks/aime.jpg', pages: [] },
            { id: 'imo', title: 'IMO', textbook: 'Engel — Problem-Solving Strategies', image: 'assets/textbooks/engel.jpg', pages: [] },
            { id: 'inmo', title: 'INMO', textbook: 'Mathematical Olympiad Challenges (Andreescu & Enescu)', image: 'assets/textbooks/inmo.jpg', pages: [] },
            { id: 'putnam', title: 'Putnam', textbook: 'Putnam and Beyond (Andreescu & Gelca)', image: 'assets/textbooks/putnam.jpg', pages: [] }
        ]
    }
];

function renderNoteCard(inner, href) {
    return `<a href="${href}" class="note-card">${inner}</a>`;
}

function initNotesCategoryGrid() {
    const grid = document.getElementById('notesCategoryGrid');
    if (!grid) return;
    grid.innerHTML = notesCategories.map(cat => `
        <a href="notes-category.html?cat=${cat.id}" class="note-card note-card-cat">
            <div class="note-card-body">
                <h3 class="note-card-title">${cat.title}</h3>
                <p class="note-card-blurb">${cat.blurb}</p>
                <span class="note-card-meta">${cat.subjects.length} subjects &rarr;</span>
            </div>
        </a>
    `).join('');
}

function initNotesSubjectGrid() {
    const host = document.getElementById('notesSubjectGrid');
    if (!host) return;
    const params = new URLSearchParams(window.location.search);
    const catId = params.get('cat');
    const cat = notesCategories.find(c => c.id === catId);

    const tag = document.getElementById('notesCatTag');
    const title = document.getElementById('notesCatTitle');
    const subtitle = document.getElementById('notesCatSubtitle');

    if (!cat) {
        if (title) title.textContent = 'Category not found';
        if (subtitle) subtitle.textContent = 'Go back to all notes.';
        host.innerHTML = '';
        return;
    }

    if (tag) tag.textContent = 'Study Notebook';
    if (title) title.textContent = cat.title;
    if (subtitle) subtitle.textContent = cat.blurb;
    document.title = `${cat.title} Notes | Tensor Theorist`;

    // Rotating book rack — duplicate the covers so the CSS marquee wraps seamlessly.
    const coverHtml = sub => `
        <div class="book-cover" title="${sub.textbook}">
            <img src="${sub.image}" alt="${sub.textbook}" onerror="this.style.display='none'; this.parentElement.classList.add('no-image');">
            <span class="book-cover-fallback">${sub.title}</span>
        </div>
    `;
    const covers = cat.subjects.map(coverHtml).join('');

    // Collapsible subject list.
    const subjectHtml = cat.subjects.map(sub => {
        const pages = (sub.pages || []);
        const pagesInner = pages.length
            ? `<ul class="note-page-list">${pages.map(p => `
                <li><a href="note-post.html?cat=${cat.id}&sub=${sub.id}&page=${p.id}">${p.title}</a></li>
              `).join('')}</ul>`
            : `<p class="note-empty">No notes yet — coming soon.</p>`;
        return `
            <details class="subject-folder">
                <summary>
                    <span class="subject-name">${sub.title}</span>
                    <span class="subject-book">${sub.textbook}</span>
                    <span class="subject-count">${pages.length} ${pages.length === 1 ? 'note' : 'notes'}</span>
                </summary>
                ${pagesInner}
            </details>
        `;
    }).join('');

    host.innerHTML = `
        <div class="book-rack" aria-label="Textbook covers">
            <div class="book-rack-track">${covers}${covers}</div>
        </div>
        <div class="subject-folders">${subjectHtml}</div>
    `;
}
