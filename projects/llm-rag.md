# LLM RAG System

*Category: AI*
*GitHub: https://github.com/TensorTheorist/llm-rag*
*Technologies: Python, LangChain, ChromaDB, FastAPI, Docker*

A production-ready Retrieval-Augmented Generation system designed for enterprise document question-answering.

## Features

- **Semantic Search**: Dense vector embeddings for meaning-based retrieval
- **Hybrid Retrieval**: Combines BM25 with dense retrieval for optimal results
- **Intelligent Reranking**: Cross-encoder reranking for improved precision
- **Streaming Responses**: Real-time token streaming for better UX

## Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Ingestion │───>│   Chunking  │───>│  Embedding  │
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
                                              ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│     LLM     │<───│   Reranker  │<───│   Retriever │
└─────────────┘    └─────────────┘    └─────────────┘
```

## Installation

```bash
pip install -r requirements.txt
```

## Usage

```python
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
```

## Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| chunk_size | 512 | Document chunk size |
| chunk_overlap | 50 | Overlap between chunks |
| top_k | 5 | Number of retrieved documents |
| rerank_top_k | 3 | Documents after reranking |

## Performance Benchmarks

The system achieves:
- **Recall@5**: 0.92 on internal benchmark
- **MRR**: 0.87
- **Latency**: p50 < 200ms, p99 < 500ms
