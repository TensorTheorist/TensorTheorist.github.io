# Building Production ML Systems

*Published: December 20, 2023*
*Category: Systems*

Moving from prototype to production requires careful engineering. This guide covers the essential practices.

## Reproducibility

Ensuring consistent results across environments:

```python
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
```

## Configuration Management

Structured configs with validation:

```python
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
```

## Model Serving

High-performance API with FastAPI:

```python
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
```

## Monitoring

Logging metrics and alerts:

```python
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
```

## Testing

Comprehensive test coverage:

```python
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
```

## Containerization

Docker for consistent deployment:

```dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Run with gunicorn
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "main:app"]
```

## CI/CD Pipeline

Automated testing and deployment:

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run tests
        run: pytest tests/ -v

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: ./deploy.sh
```

## Conclusion

Production ML systems require attention to reproducibility, configuration, serving, monitoring, testing, and deployment. These practices ensure reliable and maintainable systems.
