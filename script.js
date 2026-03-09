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
        visualizations: ['embedding'],
        readme: `# LLM RAG System

A production-ready Retrieval-Augmented Generation system designed for enterprise document question-answering.

## Features

- **Semantic Search**: Dense vector embeddings for meaning-based retrieval
- **Hybrid Retrieval**: Combines BM25 with dense retrieval for optimal results
- **Intelligent Reranking**: Cross-encoder reranking for improved precision
- **Streaming Responses**: Real-time token streaming for better UX

## Architecture

\`\`\`
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Ingestion │───>│   Chunking  │───>│  Embedding  │
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
                                              ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│     LLM     │<───│   Reranker  │<───│   Retriever │
└─────────────┘    └─────────────┘    └─────────────┘
\`\`\`

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## Usage

\`\`\`python
from rag import RAGPipeline

pipeline = RAGPipeline(
    embedding_model="sentence-transformers/all-MiniLM-L6-v2",
    llm_model="gpt-4",
    vector_store="chromadb"
)

# Index documents
pipeline.index_documents("./documents/")

# Query
response = pipeline.query("What is the refund policy?")
print(response.answer)
\`\`\`

## Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| chunk_size | 512 | Document chunk size |
| chunk_overlap | 50 | Overlap between chunks |
| top_k | 5 | Number of retrieved documents |
| rerank_top_k | 3 | Documents after reranking |`
    },
    {
        id: 'kg-pipeline',
        title: 'Knowledge Graph Pipeline',
        description: 'End-to-end pipeline for building knowledge graphs from unstructured text using NER, relation extraction, and entity resolution.',
        category: 'ai',
        tech: ['Neo4j', 'spaCy', 'NetworkX', 'Python'],
        github: 'https://github.com/TensorTheorist/kg-pipeline',
        image: 'kg',
        visualizations: ['embedding'],
        readme: `# Knowledge Graph Pipeline

Build knowledge graphs from unstructured text with state-of-the-art NLP.

## Pipeline Stages

1. **Named Entity Recognition** - Extract entities using transformer models
2. **Relation Extraction** - Identify relationships between entities
3. **Entity Resolution** - Merge duplicate entities
4. **Graph Construction** - Build and persist the knowledge graph

## Quick Start

\`\`\`python
from kg_pipeline import KGBuilder

builder = KGBuilder(
    ner_model="en_core_web_trf",
    relation_model="rebel-large"
)

# Process documents
kg = builder.process("./corpus/")

# Query the graph
results = kg.query("""
    MATCH (p:Person)-[:WORKS_AT]->(o:Organization)
    RETURN p.name, o.name
""")
\`\`\`

## Supported Entity Types

- Person, Organization, Location
- Product, Event, Date
- Custom entity types via fine-tuning`
    },
    {
        id: 'scheduler',
        title: 'Scheduling Optimization Engine',
        description: 'Advanced scheduling solver using constraint programming and metaheuristics for production planning and resource allocation.',
        category: 'optimization',
        tech: ['Python', 'OR-Tools', 'NumPy', 'FastAPI'],
        github: 'https://github.com/TensorTheorist/scheduler',
        image: 'scheduler',
        visualizations: ['optimization'],
        readme: `# Scheduling Optimization Engine

High-performance scheduling solver for production planning and resource allocation.

## Algorithms

- **Constraint Programming** (OR-Tools CP-SAT)
- **Genetic Algorithms** 
- **Simulated Annealing**
- **Particle Swarm Optimization**

## Problem Types

### Job Shop Scheduling
\`\`\`python
from scheduler import JobShopSolver

solver = JobShopSolver()
solver.add_job("J1", [("M1", 3), ("M2", 2), ("M3", 4)])
solver.add_job("J2", [("M2", 2), ("M1", 4), ("M3", 1)])

solution = solver.solve(time_limit=60)
print(f"Makespan: {solution.makespan}")
\`\`\`

### Resource Constrained Scheduling
\`\`\`python
from scheduler import RCPSPSolver

solver = RCPSPSolver()
solver.add_resource("workers", capacity=5)
solver.add_task("T1", duration=3, workers=2)
# ...
\`\`\`

## Performance

| Problem Size | CP-SAT | Genetic | SA |
|--------------|--------|---------|-----|
| 10x10 | 0.5s | 2s | 1s |
| 20x20 | 5s | 15s | 8s |
| 50x50 | 60s | 120s | 90s |`
    },
    {
        id: 'ml-pipeline',
        title: 'ML Pipeline Framework',
        description: 'Modular machine learning pipeline with automated feature engineering, model selection, and experiment tracking.',
        category: 'ml',
        tech: ['Python', 'scikit-learn', 'MLflow', 'Airflow'],
        github: 'https://github.com/TensorTheorist/ml-pipeline',
        image: 'pipeline',
        visualizations: ['neural', 'gradient'],
        readme: `# ML Pipeline Framework

End-to-end machine learning pipeline with experiment tracking.

## Features

- **Automated Feature Engineering**
- **Model Selection & Hyperparameter Tuning**
- **Experiment Tracking with MLflow**
- **Pipeline Orchestration with Airflow**

## Example

\`\`\`python
from ml_pipeline import Pipeline, DataLoader
from ml_pipeline.transformers import (
    MissingValueHandler,
    FeatureScaler,
    FeatureSelector
)
from ml_pipeline.models import ModelSelector

# Define pipeline
pipeline = Pipeline([
    ("load", DataLoader("data.csv")),
    ("missing", MissingValueHandler(strategy="median")),
    ("scale", FeatureScaler(method="standard")),
    ("select", FeatureSelector(k=10)),
    ("model", ModelSelector(
        models=["rf", "xgb", "lgbm"],
        cv=5,
        metric="f1"
    ))
])

# Train with experiment tracking
with mlflow.start_run():
    pipeline.fit(X_train, y_train)
    metrics = pipeline.evaluate(X_test, y_test)
    mlflow.log_metrics(metrics)
\`\`\`

## Model Support

- Random Forest, XGBoost, LightGBM
- Neural Networks (PyTorch)
- Linear models with regularization`
    },
    {
        id: 'ai-agents',
        title: 'AI Agent Framework',
        description: 'Framework for building autonomous AI agents with tool use, planning, and multi-step reasoning capabilities.',
        category: 'ai',
        tech: ['Python', 'LangChain', 'OpenAI', 'Redis'],
        github: 'https://github.com/TensorTheorist/ai-agents',
        image: 'agent',
        visualizations: [],
        readme: `# AI Agent Framework

Build autonomous AI agents with tool use and multi-step reasoning.

## Agent Types

- **ReAct Agent** - Reasoning + Acting
- **Plan-and-Execute** - Planning before execution
- **Tool-Augmented** - Agents with external tools

## Quick Start

\`\`\`python
from agents import Agent, Tool

# Define tools
@Tool
def search_web(query: str) -> str:
    """Search the web for information."""
    return web_search(query)

@Tool
def calculate(expression: str) -> float:
    """Evaluate a mathematical expression."""
    return eval(expression)

# Create agent
agent = Agent(
    model="gpt-4",
    tools=[search_web, calculate],
    memory="redis://localhost:6379"
)

# Run
result = agent.run(
    "What is the population of France multiplied by 2?"
)
\`\`\`

## Memory Systems

- **Short-term**: Conversation buffer
- **Long-term**: Vector store for semantic retrieval
- **Working memory**: Scratchpad for reasoning`
    },
    {
        id: 'inference-api',
        title: 'Model Inference API',
        description: 'High-performance model serving infrastructure with batching, caching, and auto-scaling for production ML deployment.',
        category: 'systems',
        tech: ['Python', 'FastAPI', 'Docker', 'Kubernetes', 'Redis'],
        github: 'https://github.com/TensorTheorist/inference-api',
        image: 'api',
        visualizations: [],
        readme: `# Model Inference API

Production-grade model serving with high performance.

## Features

- **Dynamic Batching** - Automatic request batching
- **Response Caching** - Redis-based caching
- **Auto-scaling** - Kubernetes HPA integration
- **Model Versioning** - A/B testing support

## Deployment

\`\`\`yaml
# docker-compose.yml
services:
  inference:
    image: inference-api:latest
    environment:
      - MODEL_PATH=/models/model.pt
      - BATCH_SIZE=32
      - CACHE_TTL=3600
    ports:
      - "8080:8080"
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
\`\`\`

## API

\`\`\`bash
# Single prediction
curl -X POST http://localhost:8080/predict \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Hello world"}'

# Batch prediction
curl -X POST http://localhost:8080/predict/batch \\
  -H "Content-Type: application/json" \\
  -d '{"texts": ["Hello", "World"]}'
\`\`\`

## Performance

- **Latency**: p50 < 10ms, p99 < 50ms
- **Throughput**: 10,000 req/s per instance`
    },
    {
        id: 'embedding-search',
        title: 'Embedding Search Engine',
        description: 'Semantic search engine using dense embeddings with HNSW indexing for fast approximate nearest neighbor search.',
        category: 'ml',
        tech: ['Python', 'Sentence-Transformers', 'FAISS', 'FastAPI'],
        github: 'https://github.com/TensorTheorist/embedding-search',
        image: 'search',
        visualizations: ['embedding'],
        readme: `# Embedding Search Engine

Fast semantic search with dense embeddings.

## Features

- **Multiple Embedding Models**
- **HNSW Indexing** for fast ANN search
- **Hybrid Search** - Dense + Sparse
- **Multi-language Support**

## Usage

\`\`\`python
from embedding_search import SearchEngine

engine = SearchEngine(
    model="sentence-transformers/all-mpnet-base-v2",
    index_type="hnsw",
    similarity="cosine"
)

# Index documents
engine.index([
    {"id": "1", "text": "Machine learning fundamentals"},
    {"id": "2", "text": "Deep learning with PyTorch"},
    # ...
])

# Search
results = engine.search(
    "neural network training",
    top_k=10
)
\`\`\`

## Benchmarks

| Dataset | Recall@10 | Latency |
|---------|-----------|---------|
| MS MARCO | 0.89 | 5ms |
| NQ | 0.85 | 4ms |
| BEIR | 0.82 | 6ms |`
    },
    {
        id: 'optim-benchmark',
        title: 'Optimization Benchmark Suite',
        description: 'Comprehensive benchmark suite for evaluating optimization algorithms on classic and real-world problems.',
        category: 'optimization',
        tech: ['Python', 'NumPy', 'Matplotlib', 'Pytest'],
        github: 'https://github.com/TensorTheorist/optim-benchmark',
        image: 'benchmark',
        visualizations: ['gradient', 'optimization'],
        readme: `# Optimization Benchmark Suite

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

\`\`\`python
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
\`\`\`

## Metrics

- Convergence rate
- Final solution quality
- Computational cost
- Statistical significance testing`
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
        image: 'ai',
        content: `# Understanding Retrieval-Augmented Generation

Retrieval-Augmented Generation (RAG) has become a cornerstone technique for building knowledge-intensive AI applications. This post explores the fundamentals and advanced techniques.

## What is RAG?

RAG combines the generative capabilities of large language models with the precision of information retrieval systems. Instead of relying solely on the knowledge encoded in model parameters, RAG systems can access external knowledge bases to provide more accurate and up-to-date responses.

## Basic Architecture

The standard RAG pipeline consists of three main stages:

1. **Indexing**: Documents are chunked and embedded into vector representations
2. **Retrieval**: Given a query, find the most relevant document chunks
3. **Generation**: Feed retrieved context to the LLM for response generation

\`\`\`python
def rag_pipeline(query: str, retriever: Retriever, llm: LLM) -> str:
    # Retrieve relevant documents
    docs = retriever.search(query, top_k=5)
    
    # Build context from retrieved documents
    context = "\\n\\n".join([doc.content for doc in docs])
    
    # Generate response with context
    prompt = f"""Use the following context to answer the question.
    
Context:
{context}

Question: {query}

Answer:"""
    
    return llm.generate(prompt)
\`\`\`

## Embedding Models

The choice of embedding model significantly impacts retrieval quality:

| Model | Dimensions | Performance |
|-------|------------|-------------|
| all-MiniLM-L6-v2 | 384 | Good |
| all-mpnet-base-v2 | 768 | Better |
| e5-large-v2 | 1024 | Best |

## Advanced Techniques

### Hybrid Retrieval

Combining dense (semantic) and sparse (keyword) retrieval often yields better results:

\`\`\`python
class HybridRetriever:
    def __init__(self, dense_retriever, sparse_retriever, alpha=0.5):
        self.dense = dense_retriever
        self.sparse = sparse_retriever
        self.alpha = alpha
    
    def search(self, query: str, top_k: int = 10):
        dense_results = self.dense.search(query, top_k * 2)
        sparse_results = self.sparse.search(query, top_k * 2)
        
        # Reciprocal Rank Fusion
        combined = self._rrf_fusion(dense_results, sparse_results)
        return combined[:top_k]
\`\`\`

### Reranking

Cross-encoder reranking improves precision at the cost of latency:

\`\`\`python
from sentence_transformers import CrossEncoder

reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

def rerank(query: str, documents: list, top_k: int = 3):
    pairs = [(query, doc.content) for doc in documents]
    scores = reranker.predict(pairs)
    
    ranked = sorted(zip(documents, scores), key=lambda x: x[1], reverse=True)
    return [doc for doc, score in ranked[:top_k]]
\`\`\`

## Evaluation Metrics

Common metrics for evaluating RAG systems:

- **Recall@K**: Fraction of relevant documents in top-K results
- **MRR**: Mean Reciprocal Rank
- **NDCG**: Normalized Discounted Cumulative Gain
- **Faithfulness**: How well the response aligns with retrieved context

## Conclusion

RAG systems bridge the gap between parametric knowledge in LLMs and the vast, ever-changing information in external knowledge bases. By understanding the components and trade-offs, you can build more effective AI applications.`
    },
    {
        id: 'optimization-algorithms',
        title: 'A Survey of Optimization Algorithms',
        excerpt: 'From gradient descent to evolutionary algorithms, understanding optimization landscapes.',
        date: '2024-01-28',
        category: 'math',
        image: 'math',
        content: `# A Survey of Optimization Algorithms

Optimization lies at the heart of machine learning. This survey covers the major classes of optimization algorithms and their applications.

## Gradient-Based Methods

### Gradient Descent

The foundation of neural network training:

$$\\theta_{t+1} = \\theta_t - \\eta \\nabla L(\\theta_t)$$

Where $\\eta$ is the learning rate and $\\nabla L$ is the gradient of the loss function.

### Momentum

Accelerates convergence by accumulating velocity:

$$v_t = \\gamma v_{t-1} + \\eta \\nabla L(\\theta_t)$$
$$\\theta_{t+1} = \\theta_t - v_t$$

### Adam Optimizer

Adaptive learning rates with momentum:

\`\`\`python
def adam_update(params, grads, m, v, t, lr=0.001, beta1=0.9, beta2=0.999, eps=1e-8):
    # Update biased first moment estimate
    m = beta1 * m + (1 - beta1) * grads
    
    # Update biased second raw moment estimate
    v = beta2 * v + (1 - beta2) * grads**2
    
    # Compute bias-corrected estimates
    m_hat = m / (1 - beta1**t)
    v_hat = v / (1 - beta2**t)
    
    # Update parameters
    params = params - lr * m_hat / (np.sqrt(v_hat) + eps)
    
    return params, m, v
\`\`\`

## Second-Order Methods

### Newton's Method

Uses the Hessian for faster convergence:

$$\\theta_{t+1} = \\theta_t - H^{-1} \\nabla L(\\theta_t)$$

### L-BFGS

Approximates the inverse Hessian efficiently:

\`\`\`python
from scipy.optimize import minimize

result = minimize(
    objective_function,
    initial_params,
    method='L-BFGS-B',
    jac=gradient_function
)
\`\`\`

## Metaheuristics

### Genetic Algorithms

Evolution-inspired optimization:

\`\`\`python
def genetic_algorithm(fitness_fn, pop_size=100, generations=100):
    population = initialize_population(pop_size)
    
    for gen in range(generations):
        # Evaluate fitness
        fitness = [fitness_fn(ind) for ind in population]
        
        # Selection
        parents = tournament_selection(population, fitness)
        
        # Crossover
        offspring = crossover(parents)
        
        # Mutation
        offspring = mutate(offspring)
        
        population = offspring
    
    return best_individual(population, fitness_fn)
\`\`\`

### Particle Swarm Optimization

Swarm intelligence for continuous optimization:

$$v_i^{t+1} = w v_i^t + c_1 r_1 (p_i - x_i^t) + c_2 r_2 (g - x_i^t)$$
$$x_i^{t+1} = x_i^t + v_i^{t+1}$$

## Comparison

| Algorithm | Convergence | Hyperparameters | Use Case |
|-----------|-------------|-----------------|----------|
| SGD | Slow | Learning rate | Deep learning |
| Adam | Fast | lr, betas | General |
| L-BFGS | Very fast | None | Small models |
| GA | Slow | Many | Non-differentiable |

## Conclusion

The choice of optimization algorithm depends on the problem structure, differentiability, and computational constraints. Understanding these trade-offs is essential for effective machine learning.`
    },
    {
        id: 'transformers-explained',
        title: 'Transformers: Attention Is All You Need',
        excerpt: 'Breaking down the transformer architecture and self-attention mechanism.',
        date: '2024-01-10',
        category: 'ml',
        image: 'ml',
        content: `# Transformers: Attention Is All You Need

The transformer architecture revolutionized NLP and has since expanded to computer vision, audio, and multimodal applications.

## Self-Attention Mechanism

The core innovation is the scaled dot-product attention:

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

Where:
- $Q$ = Query matrix
- $K$ = Key matrix  
- $V$ = Value matrix
- $d_k$ = Dimension of keys

\`\`\`python
import torch
import torch.nn.functional as F

def scaled_dot_product_attention(Q, K, V, mask=None):
    d_k = Q.size(-1)
    
    # Compute attention scores
    scores = torch.matmul(Q, K.transpose(-2, -1)) / torch.sqrt(d_k)
    
    # Apply mask if provided
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float('-inf'))
    
    # Softmax to get attention weights
    attn_weights = F.softmax(scores, dim=-1)
    
    # Apply attention to values
    output = torch.matmul(attn_weights, V)
    
    return output, attn_weights
\`\`\`

## Multi-Head Attention

Multiple attention heads capture different aspects of relationships:

\`\`\`python
class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        self.n_heads = n_heads
        self.d_k = d_model // n_heads
        
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
    
    def forward(self, Q, K, V, mask=None):
        batch_size = Q.size(0)
        
        # Linear projections and reshape for multi-head
        Q = self.W_q(Q).view(batch_size, -1, self.n_heads, self.d_k).transpose(1, 2)
        K = self.W_k(K).view(batch_size, -1, self.n_heads, self.d_k).transpose(1, 2)
        V = self.W_v(V).view(batch_size, -1, self.n_heads, self.d_k).transpose(1, 2)
        
        # Apply attention
        attn_output, _ = scaled_dot_product_attention(Q, K, V, mask)
        
        # Concatenate heads and project
        attn_output = attn_output.transpose(1, 2).contiguous().view(batch_size, -1, self.n_heads * self.d_k)
        
        return self.W_o(attn_output)
\`\`\`

## Positional Encoding

Since attention is permutation-invariant, we need positional information:

$$PE_{(pos, 2i)} = \\sin\\left(\\frac{pos}{10000^{2i/d}}\\right)$$
$$PE_{(pos, 2i+1)} = \\cos\\left(\\frac{pos}{10000^{2i/d}}\\right)$$

\`\`\`python
def positional_encoding(seq_len, d_model):
    position = torch.arange(seq_len).unsqueeze(1)
    div_term = torch.exp(torch.arange(0, d_model, 2) * (-math.log(10000.0) / d_model))
    
    pe = torch.zeros(seq_len, d_model)
    pe[:, 0::2] = torch.sin(position * div_term)
    pe[:, 1::2] = torch.cos(position * div_term)
    
    return pe
\`\`\`

## Feed-Forward Network

Each transformer layer includes a position-wise FFN:

\`\`\`python
class FeedForward(nn.Module):
    def __init__(self, d_model, d_ff, dropout=0.1):
        super().__init__()
        self.linear1 = nn.Linear(d_model, d_ff)
        self.linear2 = nn.Linear(d_ff, d_model)
        self.dropout = nn.Dropout(dropout)
    
    def forward(self, x):
        return self.linear2(self.dropout(F.gelu(self.linear1(x))))
\`\`\`

## Layer Normalization

Pre-norm vs post-norm architectures:

\`\`\`python
# Pre-norm (more stable training)
x = x + self.attention(self.norm1(x))
x = x + self.ffn(self.norm2(x))

# Post-norm (original paper)
x = self.norm1(x + self.attention(x))
x = self.norm2(x + self.ffn(x))
\`\`\`

## Conclusion

The transformer architecture's simplicity and parallelizability have made it the dominant paradigm in modern deep learning. Understanding its components is essential for working with state-of-the-art models.`
    },
    {
        id: 'building-ml-systems',
        title: 'Building Production ML Systems',
        excerpt: 'Best practices for deploying machine learning models at scale.',
        date: '2023-12-20',
        category: 'systems',
        image: 'systems',
        content: `# Building Production ML Systems

Moving from prototype to production requires careful engineering. This guide covers the essential practices.

## Reproducibility

Ensuring consistent results across environments:

\`\`\`python
import random
import numpy as np
import torch

def set_seeds(seed: int = 42):
    """Set seeds for reproducibility."""
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

# Use at the start of training
set_seeds(42)
\`\`\`

## Configuration Management

Structured configs with validation:

\`\`\`python
from pydantic import BaseModel, validator
from typing import List, Optional

class ModelConfig(BaseModel):
    model_name: str
    hidden_size: int = 768
    num_layers: int = 12
    dropout: float = 0.1
    
    @validator('dropout')
    def dropout_range(cls, v):
        if not 0 <= v <= 1:
            raise ValueError('Dropout must be between 0 and 1')
        return v

class TrainingConfig(BaseModel):
    learning_rate: float = 1e-4
    batch_size: int = 32
    max_epochs: int = 100
    early_stopping_patience: int = 5

config = TrainingConfig(learning_rate=3e-5, batch_size=16)
\`\`\`

## Model Serving

High-performance API with FastAPI:

\`\`\`python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch

app = FastAPI()

class PredictionRequest(BaseModel):
    text: str
    
class PredictionResponse(BaseModel):
    prediction: str
    confidence: float

# Load model once at startup
@app.on_event("startup")
async def load_model():
    global model, tokenizer
    model = torch.load("model.pt")
    model.eval()

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    try:
        with torch.no_grad():
            inputs = tokenizer(request.text, return_tensors="pt")
            outputs = model(**inputs)
            prediction = outputs.argmax(-1).item()
            confidence = outputs.softmax(-1).max().item()
            
        return PredictionResponse(
            prediction=str(prediction),
            confidence=confidence
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
\`\`\`

## Monitoring

Logging metrics and alerts:

\`\`\`python
import logging
from prometheus_client import Counter, Histogram, start_http_server

# Metrics
PREDICTION_COUNTER = Counter('predictions_total', 'Total predictions')
LATENCY_HISTOGRAM = Histogram('prediction_latency_seconds', 'Prediction latency')
ERROR_COUNTER = Counter('prediction_errors_total', 'Prediction errors')

# Structured logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

@LATENCY_HISTOGRAM.time()
def predict_with_monitoring(input_data):
    try:
        result = model.predict(input_data)
        PREDICTION_COUNTER.inc()
        logger.info(f"Prediction successful: {result}")
        return result
    except Exception as e:
        ERROR_COUNTER.inc()
        logger.error(f"Prediction failed: {e}")
        raise
\`\`\`

## Testing

Comprehensive test coverage:

\`\`\`python
import pytest
import numpy as np

class TestModel:
    @pytest.fixture
    def model(self):
        return load_model("model.pt")
    
    def test_prediction_shape(self, model):
        input_data = np.random.randn(1, 10)
        output = model.predict(input_data)
        assert output.shape == (1, 5)
    
    def test_prediction_range(self, model):
        input_data = np.random.randn(1, 10)
        output = model.predict(input_data)
        assert np.all(output >= 0) and np.all(output <= 1)
    
    @pytest.mark.parametrize("batch_size", [1, 8, 32])
    def test_batch_sizes(self, model, batch_size):
        input_data = np.random.randn(batch_size, 10)
        output = model.predict(input_data)
        assert output.shape[0] == batch_size
\`\`\`

## Containerization

Docker for consistent deployment:

\`\`\`dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Run with gunicorn
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "main:app"]
\`\`\`

## Conclusion

Production ML systems require attention to reproducibility, configuration, serving, monitoring, testing, and deployment. These practices ensure reliable and maintainable systems.`
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
