# Laptop Price Predictor — ML

This folder contains the data and model-building work for the Laptop Price Predictor project.

## Overview

- Purpose: explore laptop dataset, train regression models to predict laptop prices, evaluate results, and export a trained model for use by the backend.
- Main items:
  - `laptop_price.csv` — dataset used by the notebook (features + price target)
  - `model building.ipynb` — Jupyter notebook with EDA, feature engineering, modeling, evaluation, and model export steps
  - `env/` — Python virtual environment (pre-created). You can use this or create a fresh venv.

## Prerequisites

- Python 3.8+ (the included `env` is Python 3.11)
- pip
- Jupyter (notebook or lab)

## Setup

Use the provided virtualenv (optional) or create a new one.

Activate the included venv (macOS / Linux):

```bash
cd ml
source env/bin/activate
```

Or create & activate a new venv:

```bash
python3 -m venv env
source env/bin/activate
```

Install dependencies (if a `requirements.txt` exists):

```bash
pip install -r requirements.txt
```

If there is no `requirements.txt`, install commonly used packages:

```bash
pip install pandas numpy scikit-learn xgboost joblib matplotlib seaborn jupyterlab
```

Create a `requirements.txt` after installing packages:

```bash
pip freeze > requirements.txt
```

## Running the notebook

Start Jupyter Lab or Notebook and open `model building.ipynb`:

```bash
jupyter lab
# or
jupyter notebook
```

Run the notebook cells to reproduce EDA, training and evaluation. The notebook should contain steps to train candidate models and select the best one.

## Exporting the trained model for backend use

After training the final model, save it as a serialized artifact (recommended formats: `joblib` or `pickle`). Example using `joblib`:

```python
from joblib import dump

# `model` is the trained sklearn-like estimator
dump(model, 'model.joblib')
```

Move or copy the saved model into the backend utilities directory so the server can load it (example):

```bash
# from ml/
cp model.joblib ../backend/src/util/
```

In the backend, load with joblib or pickle (ensure versions are compatible):

```python
from joblib import load
model = load('src/util/model.joblib')
```

## Dataset notes

- `laptop_price.csv` contains the features used in modeling and the target column (commonly named `price`). Inspect the CSV headers in the notebook to confirm column names used by the pipeline.

## Reproducibility tips

- Pin package versions in `requirements.txt` to avoid runtime differences between training and serving environments.
- Prefer `joblib` for sklearn-compatible models; include metadata (feature order, preprocessing steps) when exporting.
- If the model uses custom preprocessing, export the entire pipeline (preprocessing + estimator) together so backend inference is simpler.

## Suggested next steps

- Add `requirements.txt` to this folder if missing.
- Convert critical notebook cells to a standalone script (e.g., `train.py`) to support CI or scheduled retraining.
- Add a small test script `predict_sample.py` that loads the exported model and runs a sample prediction (useful for smoke tests).

---
Generated README to guide local experimentation and exporting models for backend integration.
