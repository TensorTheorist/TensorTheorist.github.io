# Knowledge Graph Pipeline

*Category: AI*
*GitHub: https://github.com/TensorTheorist/kg-pipeline*
*Technologies: Neo4j, spaCy, NetworkX, Python*

Build knowledge graphs from unstructured text with state-of-the-art NLP.

## Pipeline Stages

1. **Named Entity Recognition** - Extract entities using transformer models
2. **Relation Extraction** - Identify relationships between entities
3. **Entity Resolution** - Merge duplicate entities
4. **Graph Construction** - Build and persist the knowledge graph

## Quick Start

```python
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
```

## Supported Entity Types

- Person, Organization, Location
- Product, Event, Date
- Custom entity types via fine-tuning

## Graph Statistics

Example output on a corporate document corpus:
- **Entities**: 15,000+
- **Relations**: 45,000+
- **Entity Types**: 12
- **Relation Types**: 28

## Visualization

The pipeline includes built-in visualization tools:

```python
from kg_pipeline.viz import GraphVisualizer

viz = GraphVisualizer(kg)
viz.render_subgraph(
    center_entity="Acme Corp",
    depth=2,
    output="graph.html"
)
```
