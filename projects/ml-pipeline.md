# ML Pipeline Framework

*Category: Machine Learning*
*GitHub: https://github.com/TensorTheorist/ml-pipeline*
*Technologies: Python, scikit-learn, MLflow, Airflow*

End-to-end machine learning pipeline with experiment tracking.

## Features

- **Automated Feature Engineering**
- **Model Selection & Hyperparameter Tuning**
- **Experiment Tracking with MLflow**
- **Pipeline Orchestration with Airflow**

## Example

```python
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
```

## Model Support

- Random Forest, XGBoost, LightGBM
- Neural Networks (PyTorch)
- Linear models with regularization

## Configuration

```yaml
# config.yaml
pipeline:
  name: customer_churn
  version: 1.0.0

data:
  source: s3://bucket/data.parquet
  target_column: churned

preprocessing:
  missing_strategy: median
  scaling: standard
  feature_selection:
    method: mutual_info
    k: 20

model:
  type: ensemble
  base_models:
    - random_forest
    - xgboost
  meta_model: logistic_regression
```

## MLflow Integration

All experiments are tracked with:
- Parameters
- Metrics (accuracy, F1, AUC-ROC)
- Model artifacts
- Feature importance plots
