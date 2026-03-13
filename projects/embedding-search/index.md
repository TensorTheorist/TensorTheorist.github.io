# Embedding Search Engine

*Category: Machine Learning*
*GitHub: https://github.com/TensorTheorist/embedding-search*
*Technologies: Python, Sentence-Transformers, FAISS, FastAPI*

Fast semantic search with dense embeddings.

## Features

- **Multiple Embedding Models**
- **HNSW Indexing** for fast ANN search
- **Hybrid Search** - Dense + Sparse
- **Multi-language Support**

## Usage

```python
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
    {"id": "3", "text": "Natural language processing"},
])

# Search
results = engine.search(
    "neural network training",
    top_k=10
)

for result in results:
    print(f"{result.id}: {result.score:.3f}")
```

## Benchmarks

| Dataset | Recall@10 | Latency |
|---------|-----------|---------|
| MS MARCO | 0.89 | 5ms |
| NQ | 0.85 | 4ms |
| BEIR | 0.82 | 6ms |

## Embedding Models

| Model | Dimensions | Speed | Quality |
|-------|------------|-------|---------|
| all-MiniLM-L6-v2 | 384 | Fast | Good |
| all-mpnet-base-v2 | 768 | Medium | Better |
| e5-large-v2 | 1024 | Slow | Best |

## Index Configuration

```python
from embedding_search import HNSWConfig

config = HNSWConfig(
    m=16,                  # Number of connections per node
    ef_construction=200,   # Construction-time search width
    ef_search=100,         # Query-time search width
)

engine = SearchEngine(
    model="all-mpnet-base-v2",
    index_config=config
)
```

## Hybrid Search

Combine dense and sparse retrieval:

```python
from embedding_search import HybridSearchEngine

engine = HybridSearchEngine(
    dense_model="all-mpnet-base-v2",
    sparse_model="bm25",
    alpha=0.7  # Weight for dense scores
)

results = engine.search("python machine learning tutorial")
```
