document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initNavigation();
    
    if (document.getElementById('typingText')) {
        initTypingEffect();
        initGitHubStats();
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

    if (document.getElementById('searchResults')) {
        initSearchPage();
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


const blogPosts = [
    {
        id: 'riemann-hypothesis-intro',
        title: 'The Riemann Hypothesis: A Gentle Introduction',
        excerpt: 'Why the zeros of a single complex function encode the deepest secrets of the prime numbers.',
        date: '2026-08-31',
        tags: ['riemann', 'famous-problems', 'number-theory', 'zeta-function'],
        image: 'math',
        youtube: ''
    }
];

function formatBlogDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function tagLabel(tag) {
    return tag.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function collectBlogTags() {
    const set = new Set();
    blogPosts.forEach(p => (p.tags || []).forEach(t => set.add(t)));
    return Array.from(set).sort();
}

function initBlogSection() {
    const blogGrid = document.getElementById('blogGrid');
    if (!blogGrid) return;
    const tagRack = document.getElementById('blogTagRack');
    let activeTag = 'all';

    function renderBlogPosts() {
        const filtered = activeTag === 'all'
            ? blogPosts
            : blogPosts.filter(p => (p.tags || []).includes(activeTag));

        if (!filtered.length) {
            blogGrid.innerHTML = '<p class="blog-empty">No posts under this tag yet.</p>';
            return;
        }

        blogGrid.innerHTML = filtered.map(post => `
            <a href="blog-post.html?post=${post.id}" class="blog-card" data-post-id="${post.id}">
                <div class="blog-content">
                    <span class="blog-date">${formatBlogDate(post.date)}</span>
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <div class="blog-tag-row">
                        ${(post.tags || []).map(t => `<span class="blog-tag-pill">${tagLabel(t)}</span>`).join('')}
                    </div>
                    ${post.youtube ? `<span class="blog-youtube">▶ Watch on YouTube</span>` : ''}
                </div>
            </a>
        `).join('');
    }

    function renderTagRack() {
        if (!tagRack) return;
        const tags = ['all', ...collectBlogTags()];
        const pill = t => `
            <button class="tag-pill${t === activeTag ? ' active' : ''}" data-tag="${t}">
                ${t === 'all' ? 'All' : tagLabel(t)}
            </button>
        `;
        const pills = tags.map(pill).join('');
        tagRack.innerHTML = `<div class="tag-rack-track">${pills}${pills}</div>`;

        const rackEl = tagRack;
        const track = tagRack.querySelector('.tag-rack-track');
        requestAnimationFrame(() => {
            const half = track.scrollWidth / 2;
            if (half > rackEl.clientWidth + 4) {
                track.classList.add('scrolling');
            } else {
                track.innerHTML = pills;
            }
        });

        tagRack.addEventListener('click', (e) => {
            const btn = e.target.closest('.tag-pill');
            if (!btn) return;
            activeTag = btn.dataset.tag;
            renderTagRack();
            renderBlogPosts();
        });
    }

    renderTagRack();
    renderBlogPosts();
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
        id: 'specialized',
        title: 'Specialized',
        blurb: 'Focused areas outside the standard undergraduate/graduate track.',
        subjects: [
            { id: 'category-theory', title: 'Category Theory', textbook: 'Fong & Spivak — Seven Sketches in Compositionality', image: 'assets/textbooks/spivak-fong.png', pages: [] }
        ]
    },
    {
        id: 'competition-math',
        title: 'Competitive',
        blurb: 'Problem-solving from JEE up through the IMO and Putnam.',
        hiddenFromNotesLanding: true,
        subjects: [
            { id: 'jee', title: 'JEE', textbook: 'Cengage / Arihant / TMH', image: 'assets/textbooks/jee.jpg', pages: [] },
            { id: 'aime', title: 'AIME', textbook: 'Art of Problem Solving — AIME Volumes', image: 'assets/textbooks/aime.jpg', pages: [] },
            { id: 'imo', title: 'IMO', textbook: 'Engel — Problem-Solving Strategies', image: 'assets/textbooks/engel.jpg', pages: [] },
            { id: 'inmo', title: 'INMO', textbook: 'Mathematical Olympiad Challenges (Andreescu & Enescu)', image: 'assets/textbooks/inmo.jpg', pages: [] },
            { id: 'putnam', title: 'Putnam', textbook: 'Putnam and Beyond (Andreescu & Gelca)', image: 'assets/textbooks/putnam.jpg', pages: [] }
        ]
    }
];

function initNotesCategoryGrid() {
    const grid = document.getElementById('notesCategoryGrid');
    if (!grid) return;
    const visible = notesCategories.filter(c => !c.hiddenFromNotesLanding);
    grid.innerHTML = visible.map(cat => `
        <a href="notes-category.html?cat=${cat.id}" class="note-card note-card-cat">
            <div class="note-card-body">
                <h3 class="note-card-title">${cat.title}</h3>
                <p class="note-card-blurb">${cat.blurb}</p>
                <span class="note-card-meta">${cat.subjects.length} subject${cat.subjects.length === 1 ? '' : 's'} &rarr;</span>
            </div>
        </a>
    `).join('');
}

function setupBookRack(rack) {
    if (!rack) return;
    const track = rack.querySelector('.book-rack-track');
    if (!track) return;
    // Drop any prior duplicates so we always measure the real content.
    track.querySelectorAll('[data-dup="1"]').forEach(el => el.remove());
    track.classList.remove('scrolling');
    requestAnimationFrame(() => {
        if (track.scrollWidth > rack.clientWidth + 4 && track.children.length > 0) {
            Array.from(track.children).forEach(el => {
                const clone = el.cloneNode(true);
                clone.setAttribute('data-dup', '1');
                track.appendChild(clone);
            });
            track.classList.add('scrolling');
        }
    });
}

async function loadPageTitle(mdPath, fallback) {
    try {
        const res = await fetch(mdPath);
        if (!res.ok) return fallback;
        const text = await res.text();
        const line = text.split('\n').find(l => l.startsWith('# '));
        return line ? line.substring(2).trim() : fallback;
    } catch (_) {
        return fallback;
    }
}

async function populateFolderTitles(folderEl, catId, subId, pages) {
    if (folderEl.dataset.loaded === '1') return;
    folderEl.dataset.loaded = '1';
    const list = folderEl.querySelector('.note-page-list');
    if (!list) return;
    const sorted = [...pages].sort((a, b) => a.id.localeCompare(b.id));
    const items = await Promise.all(sorted.map(async (p, i) => {
        const mdPath = `notes/${catId}/${subId}/${p.id}.md`;
        const title = await loadPageTitle(mdPath, p.title || p.id);
        const num = String(i + 1).padStart(2, '0');
        return `<li>
            <a href="note-post.html?cat=${catId}&sub=${subId}&page=${p.id}">
                <span class="note-page-num">${num}</span>
                <span class="note-page-title">${title}</span>
            </a>
        </li>`;
    }));
    list.innerHTML = items.join('');
}

function initNotesSubjectGrid() {
    const host = document.getElementById('notesSubjectGrid');
    if (!host) return;
    const params = new URLSearchParams(window.location.search);
    const catId = params.get('cat');
    const cat = notesCategories.find(c => c.id === catId);

    const title = document.getElementById('notesCatTitle');
    const subtitle = document.getElementById('notesCatSubtitle');
    const back = document.querySelector('.notes-back');

    if (!cat) {
        if (title) title.textContent = 'Category not found';
        if (subtitle) subtitle.textContent = 'Go back to all notes.';
        host.innerHTML = '';
        return;
    }

    if (title) title.textContent = cat.title;
    if (subtitle) subtitle.textContent = cat.blurb;
    document.title = `${cat.title} | Tensor Theorist`;

    if (back) {
        if (catId === 'competition-math') {
            back.href = 'index.html';
            back.textContent = '← Home';
        } else {
            back.href = 'notes.html';
            back.textContent = '← All notes';
        }
    }

    // Swap active nav highlight if this is the Competitive category.
    if (catId === 'competition-math') {
        document.querySelectorAll('.nav-menu .nav-link').forEach(a => a.classList.remove('active'));
        const compLink = document.querySelector('.nav-menu a[href*="competition-math"]');
        if (compLink) compLink.classList.add('active');
    }

    const coverHtml = sub => `
        <div class="book-cover" title="${sub.textbook}">
            <img src="${sub.image}" alt="${sub.textbook}" onerror="const rack=this.closest('.book-rack'); this.closest('.book-cover').remove(); if(rack) setupBookRack(rack);">
        </div>
    `;
    const covers = cat.subjects.map(coverHtml).join('');

    const subjectHtml = cat.subjects.map(sub => {
        const pages = (sub.pages || []);
        const sortedPages = [...pages].sort((a, b) => a.id.localeCompare(b.id));
        const pagesInner = pages.length
            ? `<ul class="note-page-list">${sortedPages.map((p, i) => {
                const num = String(i + 1).padStart(2, '0');
                return `<li>
                    <a href="note-post.html?cat=${cat.id}&sub=${sub.id}&page=${p.id}">
                        <span class="note-page-num">${num}</span>
                        <span class="note-page-title">${p.title || p.id}</span>
                    </a>
                </li>`;
              }).join('')}</ul>`
            : `<p class="note-empty">No notes yet — coming soon.</p>`;
        return `
            <details class="subject-folder" data-sub="${sub.id}">
                <summary>
                    <span class="subject-name">${sub.title}</span>
                    <span class="subject-count">${pages.length} ${pages.length === 1 ? 'note' : 'notes'}</span>
                </summary>
                ${pagesInner}
            </details>
        `;
    }).join('');

    host.innerHTML = `
        <div class="book-rack" aria-label="Textbook covers">
            <div class="book-rack-track">${covers}</div>
        </div>
        <div class="subject-folders">${subjectHtml}</div>
    `;

    setupBookRack(host.querySelector('.book-rack'));
    window.addEventListener('resize', () => setupBookRack(host.querySelector('.book-rack')));

    host.querySelectorAll('.subject-folder').forEach(folder => {
        folder.addEventListener('toggle', () => {
            if (!folder.open) return;
            const subId = folder.dataset.sub;
            const sub = cat.subjects.find(s => s.id === subId);
            if (sub && sub.pages && sub.pages.length) {
                populateFolderTitles(folder, cat.id, sub.id, sub.pages);
            }
        });
    });
}

function buildSearchIndex() {
    const items = [];
    (typeof blogPosts !== 'undefined' ? blogPosts : []).forEach(p => {
        items.push({
            kind: 'blog',
            label: 'BLOG',
            title: p.title,
            haystack: [p.title, p.excerpt, p.id, ...(p.tags || [])].join(' ').toLowerCase(),
            crumbs: (p.tags || []).slice(0, 3).map(t => t.replace(/-/g, ' ')).join(' · '),
            href: `blog-post.html?post=${p.id}`,
            mdPath: `blog/${p.id}/index.md`,
            date: p.date || null
        });
    });
    (typeof notesCategories !== 'undefined' ? notesCategories : []).forEach(cat => {
        (cat.subjects || []).forEach(sub => {
            (sub.pages || []).forEach(pg => {
                items.push({
                    kind: 'notes',
                    label: 'NOTES',
                    title: pg.title || pg.id,
                    haystack: [pg.title, pg.id, sub.title, cat.title].join(' ').toLowerCase(),
                    crumbs: `${cat.title} · ${sub.title}`,
                    href: `note-post.html?cat=${cat.id}&sub=${sub.id}&page=${pg.id}`,
                    mdPath: `notes/${cat.id}/${sub.id}/${pg.id}.md`,
                    date: pg.date || null
                });
            });
        });
    });
    return items;
}

function parseMdDate(text) {
    const line = text.split('\n').find(l => /Published:/i.test(l));
    if (!line) return null;
    const raw = line.replace(/\*/g, '').replace(/Published:/i, '').trim();
    const t = Date.parse(raw);
    return isNaN(t) ? null : new Date(t).toISOString().slice(0, 10);
}

async function hydrateSearchBodies(items, onProgress) {
    await Promise.all(items.map(async item => {
        if (!item.mdPath) return;
        try {
            const res = await fetch(item.mdPath);
            if (!res.ok) return;
            const text = await res.text();
            item.haystack += ' ' + text.toLowerCase();
            const firstHeading = text.split('\n').find(l => l.startsWith('# '));
            if (firstHeading) item.title = firstHeading.substring(2).trim();

            // Prefer explicit *Published:* line, then HTTP Last-Modified, then existing item.date.
            const mdDate = parseMdDate(text);
            const httpLm = res.headers.get('last-modified');
            const httpDate = httpLm ? new Date(httpLm).toISOString().slice(0, 10) : null;
            const candidates = [mdDate, httpDate, item.date].filter(Boolean).sort();
            if (candidates.length) item.date = candidates[candidates.length - 1];

            if (onProgress) onProgress();
        } catch (_) { /* offline / missing — skip */ }
    }));
}

function initSearchPage() {
    const input = document.getElementById('searchInput');
    const resultsEl = document.getElementById('searchResults');
    const filterEl = document.getElementById('searchFilters');
    if (!input || !resultsEl) return;

    const index = buildSearchIndex();
    let filter = 'all';
    let bodiesReady = false;

    const urlQ = new URLSearchParams(window.location.search).get('q') || '';
    if (urlQ) input.value = urlQ;

    // Fetch every blog + note markdown so keyword search hits body text too.
    hydrateSearchBodies(index).then(() => {
        bodiesReady = true;
        render();
    });

    function score(item, terms) {
        let s = 0;
        for (const t of terms) {
            if (!item.haystack.includes(t)) return -1;
            if (item.title.toLowerCase().includes(t)) s += 3;
            s += 1;
        }
        return s;
    }

    function highlight(text, terms) {
        if (!terms.length) return text;
        const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
    }

    function render() {
        const q = input.value.trim().toLowerCase();
        const terms = q ? q.split(/\s+/) : [];
        let hits = terms.length
            ? index.map(i => ({ i, s: score(i, terms) })).filter(x => x.s >= 0)
            : index.map(i => ({ i, s: 0 }));
        if (filter !== 'all') hits = hits.filter(x => x.i.kind === filter);
        hits.sort((a, b) => {
            if (b.s !== a.s) return b.s - a.s;
            const da = a.i.date || '';
            const db = b.i.date || '';
            return db.localeCompare(da);
        });

        if (!hits.length) {
            const msg = q
                ? (bodiesReady ? 'No matches.' : 'No matches yet — still loading note bodies…')
                : 'Start typing to search…';
            resultsEl.innerHTML = `<p class="search-empty">${msg}</p>`;
            return;
        }

        resultsEl.innerHTML = hits.slice(0, 60).map(({ i }) => `
            <a class="search-result" href="${i.href}">
                <span class="search-result-tag search-result-tag-${i.kind}">[${i.label}]</span>
                <span class="search-result-body">
                    <span class="search-result-title">${highlight(i.title, terms)}</span>
                    <span class="search-result-crumbs">${i.crumbs}</span>
                </span>
            </a>
        `).join('');
    }

    input.addEventListener('input', render);
    filterEl.addEventListener('click', e => {
        const btn = e.target.closest('.search-filter-btn');
        if (!btn) return;
        filter = btn.dataset.filter;
        filterEl.querySelectorAll('.search-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        render();
    });

    render();
}
