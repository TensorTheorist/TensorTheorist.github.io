class KnowledgeGraph {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight || 500;
        
        this.nodes = [
            { id: 'ml', label: 'Machine Learning', group: 'core', size: 45 },
            { id: 'dl', label: 'Deep Learning', group: 'core', size: 40 },
            { id: 'llm', label: 'LLMs', group: 'ai', size: 42 },
            { id: 'optimization', label: 'Optimization', group: 'math', size: 40 },
            { id: 'scheduling', label: 'Scheduling', group: 'systems', size: 35 },
            { id: 'systems', label: 'Systems Engineering', group: 'systems', size: 38 },
            { id: 'kg', label: 'Knowledge Graphs', group: 'ai', size: 36 },
            { id: 'ds', label: 'Data Science', group: 'core', size: 35 },
            { id: 'math', label: 'Mathematics', group: 'math', size: 38 },
            { id: 'nlp', label: 'NLP', group: 'ai', size: 34 },
            { id: 'rl', label: 'Reinforcement Learning', group: 'core', size: 32 },
            { id: 'cv', label: 'Computer Vision', group: 'core', size: 32 },
            { id: 'agents', label: 'AI Agents', group: 'ai', size: 34 },
            { id: 'rag', label: 'RAG Systems', group: 'ai', size: 33 }
        ];
        
        this.links = [
            { source: 'ml', target: 'dl', strength: 0.9 },
            { source: 'ml', target: 'optimization', strength: 0.8 },
            { source: 'ml', target: 'math', strength: 0.85 },
            { source: 'ml', target: 'ds', strength: 0.7 },
            { source: 'dl', target: 'llm', strength: 0.9 },
            { source: 'dl', target: 'nlp', strength: 0.8 },
            { source: 'dl', target: 'cv', strength: 0.8 },
            { source: 'dl', target: 'rl', strength: 0.7 },
            { source: 'llm', target: 'nlp', strength: 0.85 },
            { source: 'llm', target: 'rag', strength: 0.9 },
            { source: 'llm', target: 'agents', strength: 0.85 },
            { source: 'optimization', target: 'scheduling', strength: 0.85 },
            { source: 'optimization', target: 'math', strength: 0.9 },
            { source: 'optimization', target: 'rl', strength: 0.7 },
            { source: 'scheduling', target: 'systems', strength: 0.8 },
            { source: 'systems', target: 'ml', strength: 0.6 },
            { source: 'kg', target: 'llm', strength: 0.75 },
            { source: 'kg', target: 'rag', strength: 0.85 },
            { source: 'kg', target: 'nlp', strength: 0.7 },
            { source: 'ds', target: 'math', strength: 0.7 },
            { source: 'agents', target: 'rag', strength: 0.8 },
            { source: 'agents', target: 'rl', strength: 0.75 }
        ];
        
        this.nodeInfo = {
            'ml': {
                title: 'Machine Learning',
                description: 'Core expertise in supervised, unsupervised, and semi-supervised learning algorithms.',
                projects: ['Prediction Models', 'Feature Engineering', 'Model Optimization'],
                skills: ['scikit-learn', 'XGBoost', 'LightGBM', 'Model Selection']
            },
            'dl': {
                title: 'Deep Learning',
                description: 'Neural network architectures including CNNs, RNNs, Transformers, and custom architectures.',
                projects: ['Custom Architectures', 'Transfer Learning', 'Model Compression'],
                skills: ['PyTorch', 'TensorFlow', 'Keras', 'ONNX']
            },
            'llm': {
                title: 'Large Language Models',
                description: 'Building applications with LLMs including fine-tuning, prompting, and deployment.',
                projects: ['LLM Applications', 'Fine-tuning Pipelines', 'Prompt Engineering'],
                skills: ['GPT', 'LLaMA', 'Mistral', 'LangChain']
            },
            'optimization': {
                title: 'Optimization',
                description: 'Convex and non-convex optimization, constraint satisfaction, and metaheuristics.',
                projects: ['Scheduling Engines', 'Resource Allocation', 'Cost Optimization'],
                skills: ['Linear Programming', 'Genetic Algorithms', 'Gradient Methods']
            },
            'scheduling': {
                title: 'Scheduling',
                description: 'Production scheduling, job shop scheduling, and resource allocation algorithms.',
                projects: ['Production Scheduler', 'Resource Optimizer', 'Constraint Solver'],
                skills: ['OR-Tools', 'CPLEX', 'Custom Heuristics']
            },
            'systems': {
                title: 'Systems Engineering',
                description: 'Building scalable ML systems from prototype to production.',
                projects: ['ML Pipelines', 'Inference Systems', 'Data Platforms'],
                skills: ['Docker', 'Kubernetes', 'MLflow', 'Airflow']
            },
            'kg': {
                title: 'Knowledge Graphs',
                description: 'Building and querying knowledge graphs for intelligent applications.',
                projects: ['Entity Resolution', 'Graph Embeddings', 'Query Systems'],
                skills: ['Neo4j', 'NetworkX', 'Graph Neural Networks']
            },
            'ds': {
                title: 'Data Science',
                description: 'Statistical analysis, experimentation, and data-driven decision making.',
                projects: ['A/B Testing', 'Statistical Modeling', 'Analytics Dashboards'],
                skills: ['Pandas', 'NumPy', 'Statistical Methods', 'Visualization']
            },
            'math': {
                title: 'Mathematics',
                description: 'Strong foundations in linear algebra, probability, and calculus.',
                projects: ['Algorithm Design', 'Theoretical Analysis', 'Proofs'],
                skills: ['Linear Algebra', 'Probability', 'Calculus', 'Statistics']
            },
            'nlp': {
                title: 'Natural Language Processing',
                description: 'Text processing, sentiment analysis, and language understanding.',
                projects: ['Text Classification', 'Named Entity Recognition', 'Semantic Search'],
                skills: ['Transformers', 'spaCy', 'Embeddings', 'Tokenization']
            },
            'rl': {
                title: 'Reinforcement Learning',
                description: 'Policy optimization, Q-learning, and multi-agent systems.',
                projects: ['Control Systems', 'Game AI', 'Policy Optimization'],
                skills: ['Gym', 'Stable Baselines', 'PPO', 'DQN']
            },
            'cv': {
                title: 'Computer Vision',
                description: 'Image classification, object detection, and visual understanding.',
                projects: ['Object Detection', 'Image Segmentation', 'Visual Search'],
                skills: ['OpenCV', 'YOLO', 'ResNet', 'Vision Transformers']
            },
            'agents': {
                title: 'AI Agents',
                description: 'Building autonomous AI agents that reason and take actions.',
                projects: ['Tool-using Agents', 'Multi-agent Systems', 'Autonomous Workflows'],
                skills: ['LangChain', 'AutoGPT', 'Function Calling', 'Planning']
            },
            'rag': {
                title: 'RAG Systems',
                description: 'Retrieval-augmented generation for knowledge-intensive applications.',
                projects: ['Document QA', 'Semantic Search', 'Knowledge Bases'],
                skills: ['Vector DBs', 'Embeddings', 'Chunking Strategies', 'Reranking']
            }
        };
        
        this.colorScale = {
            'core': '#58a6ff',
            'ai': '#7ee787',
            'math': '#a371f7',
            'systems': '#f78166'
        };
        
        this.init();
    }

    init() {
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('viewBox', [0, 0, this.width, this.height]);
        
        const defs = this.svg.append('defs');
        
        Object.entries(this.colorScale).forEach(([group, color]) => {
            const gradient = defs.append('radialGradient')
                .attr('id', `gradient-${group}`)
                .attr('cx', '50%')
                .attr('cy', '50%')
                .attr('r', '50%');
            
            gradient.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', color)
                .attr('stop-opacity', 0.8);
            
            gradient.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', color)
                .attr('stop-opacity', 0.3);
        });
        
        const filter = defs.append('filter')
            .attr('id', 'glow')
            .attr('x', '-50%')
            .attr('y', '-50%')
            .attr('width', '200%')
            .attr('height', '200%');
        
        filter.append('feGaussianBlur')
            .attr('stdDeviation', '3')
            .attr('result', 'coloredBlur');
        
        const feMerge = filter.append('feMerge');
        feMerge.append('feMergeNode').attr('in', 'coloredBlur');
        feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
        
        this.simulation = d3.forceSimulation(this.nodes)
            .force('link', d3.forceLink(this.links)
                .id(d => d.id)
                .distance(d => 120 - d.strength * 30))
            .force('charge', d3.forceManyBody()
                .strength(-400))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .force('collision', d3.forceCollide()
                .radius(d => d.size + 10));
        
        this.linkGroup = this.svg.append('g').attr('class', 'links');
        this.nodeGroup = this.svg.append('g').attr('class', 'nodes');
        
        this.createLinks();
        this.createNodes();
        
        this.simulation.on('tick', this.ticked.bind(this));
        
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    createLinks() {
        this.linkElements = this.linkGroup.selectAll('line')
            .data(this.links)
            .enter()
            .append('line')
            .attr('stroke', '#30363d')
            .attr('stroke-width', d => d.strength * 2)
            .attr('stroke-opacity', 0.6);
    }

    createNodes() {
        const nodeContainers = this.nodeGroup.selectAll('g')
            .data(this.nodes)
            .enter()
            .append('g')
            .attr('class', 'node')
            .style('cursor', 'pointer')
            .call(d3.drag()
                .on('start', this.dragStarted.bind(this))
                .on('drag', this.dragged.bind(this))
                .on('end', this.dragEnded.bind(this)));
        
        nodeContainers.append('circle')
            .attr('r', d => d.size)
            .attr('fill', d => `url(#gradient-${d.group})`)
            .attr('stroke', d => this.colorScale[d.group])
            .attr('stroke-width', 2)
            .attr('filter', 'url(#glow)');
        
        nodeContainers.append('text')
            .text(d => d.label)
            .attr('text-anchor', 'middle')
            .attr('dy', d => d.size + 18)
            .attr('fill', '#e6edf3')
            .attr('font-size', '12px')
            .attr('font-family', 'Inter, sans-serif')
            .attr('font-weight', '500');
        
        nodeContainers.on('click', (event, d) => this.handleNodeClick(d));
        
        nodeContainers.on('mouseenter', (event, d) => {
            d3.select(event.currentTarget).select('circle')
                .transition()
                .duration(200)
                .attr('r', d.size * 1.2)
                .attr('stroke-width', 3);
            
            this.highlightConnections(d);
        });
        
        nodeContainers.on('mouseleave', (event, d) => {
            d3.select(event.currentTarget).select('circle')
                .transition()
                .duration(200)
                .attr('r', d.size)
                .attr('stroke-width', 2);
            
            this.resetHighlight();
        });
        
        this.nodeContainers = nodeContainers;
    }

    highlightConnections(node) {
        const connectedNodes = new Set();
        connectedNodes.add(node.id);
        
        this.links.forEach(link => {
            if (link.source.id === node.id) connectedNodes.add(link.target.id);
            if (link.target.id === node.id) connectedNodes.add(link.source.id);
        });
        
        this.nodeContainers.style('opacity', d => connectedNodes.has(d.id) ? 1 : 0.3);
        
        this.linkElements
            .attr('stroke-opacity', d => 
                (d.source.id === node.id || d.target.id === node.id) ? 1 : 0.1)
            .attr('stroke', d => 
                (d.source.id === node.id || d.target.id === node.id) ? 
                this.colorScale[node.group] : '#30363d');
    }

    resetHighlight() {
        this.nodeContainers.style('opacity', 1);
        this.linkElements
            .attr('stroke-opacity', 0.6)
            .attr('stroke', '#30363d');
    }

    handleNodeClick(node) {
        const info = this.nodeInfo[node.id];
        if (!info) return;
        
        const titleEl = document.getElementById('graphInfoTitle');
        const descEl = document.getElementById('graphInfoDesc');
        const linksEl = document.getElementById('graphInfoLinks');
        
        if (titleEl) titleEl.textContent = info.title;
        if (descEl) descEl.textContent = info.description;
        
        if (linksEl) {
            linksEl.innerHTML = `
                <h4 style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 1px;">Projects</h4>
                ${info.projects.map(p => `
                    <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 6px; margin-bottom: 0.5rem; font-size: 0.9rem;">
                        <span style="color: ${this.colorScale[node.group]};">→</span>
                        <span style="color: var(--text-primary);">${p}</span>
                    </div>
                `).join('')}
                <h4 style="color: var(--text-secondary); font-size: 0.85rem; margin: 1rem 0 0.75rem; text-transform: uppercase; letter-spacing: 1px;">Skills</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${info.skills.map(s => `
                        <span style="padding: 0.25rem 0.75rem; background: rgba(88, 166, 255, 0.1); border: 1px solid rgba(88, 166, 255, 0.2); border-radius: 50px; font-size: 0.8rem; color: ${this.colorScale[node.group]}; font-family: 'JetBrains Mono', monospace;">${s}</span>
                    `).join('')}
                </div>
            `;
        }
    }

    ticked() {
        this.linkElements
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        
        this.nodeContainers
            .attr('transform', d => {
                d.x = Math.max(d.size, Math.min(this.width - d.size, d.x));
                d.y = Math.max(d.size, Math.min(this.height - d.size, d.y));
                return `translate(${d.x}, ${d.y})`;
            });
    }

    dragStarted(event) {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    dragEnded(event) {
        if (!event.active) this.simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }

    handleResize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight || 500;
        
        this.svg
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('viewBox', [0, 0, this.width, this.height]);
        
        this.simulation
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .alpha(0.3)
            .restart();
    }
}

class ProjectNetwork {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight || 300;
        
        this.projects = [
            { id: 'p1', label: 'LLM RAG', category: 'ai', x: 0.2, y: 0.3 },
            { id: 'p2', label: 'Knowledge Graph', category: 'ai', x: 0.4, y: 0.5 },
            { id: 'p3', label: 'Scheduler', category: 'optimization', x: 0.6, y: 0.3 },
            { id: 'p4', label: 'ML Pipeline', category: 'ml', x: 0.3, y: 0.7 },
            { id: 'p5', label: 'AI Agents', category: 'ai', x: 0.7, y: 0.6 },
            { id: 'p6', label: 'Inference API', category: 'systems', x: 0.8, y: 0.4 }
        ];
        
        this.connections = [
            { source: 'p1', target: 'p2' },
            { source: 'p2', target: 'p5' },
            { source: 'p3', target: 'p4' },
            { source: 'p4', target: 'p6' },
            { source: 'p5', target: 'p6' },
            { source: 'p1', target: 'p5' }
        ];
        
        this.colors = {
            'ai': '#7ee787',
            'ml': '#58a6ff',
            'optimization': '#a371f7',
            'systems': '#f78166'
        };
        
        this.init();
    }

    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.animate();
        
        window.addEventListener('resize', () => {
            this.width = this.container.clientWidth;
            this.height = this.container.clientHeight || 300;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        });
    }

    animate() {
        const time = Date.now() * 0.001;
        
        this.ctx.fillStyle = '#161b22';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.strokeStyle = 'rgba(48, 54, 61, 0.5)';
        this.ctx.lineWidth = 1;
        
        this.connections.forEach(conn => {
            const source = this.projects.find(p => p.id === conn.source);
            const target = this.projects.find(p => p.id === conn.target);
            
            const sx = source.x * this.width + Math.sin(time + source.x * 10) * 5;
            const sy = source.y * this.height + Math.cos(time + source.y * 10) * 5;
            const tx = target.x * this.width + Math.sin(time + target.x * 10) * 5;
            const ty = target.y * this.height + Math.cos(time + target.y * 10) * 5;
            
            this.ctx.beginPath();
            this.ctx.moveTo(sx, sy);
            this.ctx.lineTo(tx, ty);
            this.ctx.stroke();
        });
        
        this.projects.forEach(project => {
            const x = project.x * this.width + Math.sin(time + project.x * 10) * 5;
            const y = project.y * this.height + Math.cos(time + project.y * 10) * 5;
            const color = this.colors[project.category];
            
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, 30);
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 30, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 8, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = '#e6edf3';
            this.ctx.font = '12px Inter, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(project.label, x, y + 25);
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('knowledgeGraph')) {
        new KnowledgeGraph('knowledgeGraph');
    }
    
    if (document.getElementById('projectsNetwork')) {
        new ProjectNetwork('projectsNetwork');
    }
});
