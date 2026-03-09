# Model Inference API

*Category: Systems*
*GitHub: https://github.com/TensorTheorist/inference-api*
*Technologies: Python, FastAPI, Docker, Kubernetes, Redis*

Production-grade model serving with high performance.

## Features

- **Dynamic Batching** - Automatic request batching
- **Response Caching** - Redis-based caching
- **Auto-scaling** - Kubernetes HPA integration
- **Model Versioning** - A/B testing support

## Deployment

```yaml
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
```

## API

```bash
# Single prediction
curl -X POST http://localhost:8080/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello world"}'

# Batch prediction
curl -X POST http://localhost:8080/predict/batch \
  -H "Content-Type: application/json" \
  -d '{"texts": ["Hello", "World"]}'
```

## Performance

- **Latency**: p50 < 10ms, p99 < 50ms
- **Throughput**: 10,000 req/s per instance

## Architecture

```
                    ┌─────────────────┐
                    │   Load Balancer │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   Instance 1    │ │   Instance 2    │ │   Instance 3    │
│  ┌───────────┐  │ │  ┌───────────┐  │ │  ┌───────────┐  │
│  │  Batcher  │  │ │  │  Batcher  │  │ │  │  Batcher  │  │
│  └─────┬─────┘  │ │  └─────┬─────┘  │ │  └─────┬─────┘  │
│        │        │ │        │        │ │        │        │
│  ┌─────▼─────┐  │ │  ┌─────▼─────┐  │ │  ┌─────▼─────┐  │
│  │   Model   │  │ │  │   Model   │  │ │  │   Model   │  │
│  └───────────┘  │ │  └───────────┘  │ │  └───────────┘  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Redis Cache   │
                    └─────────────────┘
```

## Kubernetes Configuration

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: inference-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: inference-api
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```
