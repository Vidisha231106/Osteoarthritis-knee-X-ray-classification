# RA Detection - Full Stack Application

Complete application for detecting Rheumatoid Arthritis stages from X-ray images using AI.

## Project Structure

```
RA_detection/
├── RA_backend/          # Flask API Server
│   ├── app.py          # Main Flask application
│   ├── RA_Ordinal_Classification/
│   │   ├── efficientnet_ordinal.pth  # Trained PyTorch model
│   │   └── src/
│   │       ├── model.py              # Model architecture
│   │       ├── dataset.py
│   │       ├── train.py
│   │       └── evaluate.py
│   ├── requirements.txt
│   └── README.md
│
└── RA_frontend/        # React + TypeScript Frontend
    ├── src/
    │   ├── App.tsx
    │   ├── components/
    │   └── ...
    ├── package.json
    └── vite.config.ts
# Osteoarthritis Knee X‑ray Classification (RA_detection)

Comprehensive full‑stack repository for classifying knee X‑ray images using two AI models: a PyTorch CORAL ordinal model and a Keras ResNet50 multiclass model. The project contains a Flask backend and a React + TypeScript frontend.

**This README** summarizes the project, the two models, how to run locally (both models), deployment notes (memory‑constrained environments), branch strategy, and troubleshooting tips.

**Project layout (top-level)**

```
RA_detection/
├── RA_backend/                         # Flask API server, models, Dockerfile
│   ├── app.py                          # Main Flask application & endpoints
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── RA_Ordinal_Classification/     # CORAL ordinal model (PyTorch)
│   │   ├── efficientnet_ordinal.pth   # Trained PyTorch model (ordinal)
│   │   └── src/                       # training/eval utilities
│   └── model.weights.h5               # ResNet50 weights (Keras) OR in RA_Ordinal_Classification
├── RA_frontend/                        # React + TypeScript + Vite frontend
│   └── src/
└── README.md                           # <-- this file
```

**Branches**
- `main` — deployment‑safe branch: ResNet50 is optional (controlled by `ENABLE_RESNET=false`) to avoid OOM on tiny hosting plans.
- `both_models` — development branch: both CORAL (PyTorch) and ResNet50 (TensorFlow/Keras) load unconditionally for local development (not intended for low‑RAM deployment).

**High level**
- Backend: Flask API exposing endpoints for CORAL, ResNet50, and comparison.
- Frontend: React + TypeScript app with 4 views (Home, CORAL Analysis, ResNet50 Analysis, Compare Models).
- Models:
  - CORAL ordinal regression model using EfficientNet backbone implemented in PyTorch (file: `RA_backend/RA_Ordinal_Classification/efficientnet_ordinal.pth`). Produces ordinal outputs over 5 stages (0..4).
  - ResNet50-based multiclass model implemented with TensorFlow/Keras (weights file: `RA_backend/model.weights.h5`). Produces softmax probabilities for the same 5 classes.

**Important system requirements**
- Recommended Python: 3.11 (some scientific packages are incompatible with Python 3.13).
- Flask 3.x, PyTorch (CPU), and TensorFlow CPU (2.15.0 tested). If running both models locally you need both frameworks installed — memory usage will be significantly higher.

**Environment variables (backend)**
- `PORT` — port the Flask app listens on (default: `5000`).
- `ENABLE_RESNET` — set to `false` on memory‑constrained deployments to skip loading the ResNet50 model. `main` defaults this to `false` in `render.yaml` for Render free tier.

**Local development (both models)**
1. Ensure Python 3.11 is active.
2. Create and activate virtualenv:

```powershell
cd RA_backend
python -m venv .venv
.venv\\Scripts\\activate
```

3. Install backend dependencies (this repo pins tested versions in `RA_backend/requirements.txt`):

```powershell
pip install -r requirements.txt
```

4. Ensure model files are present:
- `RA_backend/RA_Ordinal_Classification/efficientnet_ordinal.pth` — PyTorch CORAL ordinal model
- `RA_backend/model.weights.h5` — Keras ResNet50 weights (may be a full model or weights-only; see Troubleshooting)

5. Run backend (loads both models on the `both_models` branch):

```powershell
# on both_models branch
python app.py
```

6. Start frontend (in a separate terminal):

```bash
cd RA_frontend
npm install
npm run dev
```

Visit the frontend (default Vite port) to upload X‑rays and compare model outputs.

**Running in low‑memory deployment (Render free tier / Docker small instance)**
- Use the `main` branch which includes the `ENABLE_RESNET` guard. In `render.yaml` we set `ENABLE_RESNET=false` to avoid loading TensorFlow/ResNet and keep memory usage small.
- To deploy with only CORAL, ensure `ENABLE_RESNET=false` in the environment or Render settings.

**Model details**
- CORAL Ordinal Model (PyTorch)
  - Path: `RA_backend/RA_Ordinal_Classification/efficientnet_ordinal.pth`
  - Architecture: EfficientNet backbone + CORAL ordinal head
  - Output: Cumulative probabilities for 5 ordered classes (stages 0–4). The CORAL approach respects ordering and typically gives better ordinal performance than naive multiclass cross‑entropy.

- ResNet50 Multiclass Model (TensorFlow/Keras)
  - Path: `RA_backend/model.weights.h5` (sometimes stored under `RA_Ordinal_Classification` depending on commit history)
  - Architecture: ResNet50 backbone + custom top layers
  - Output: Softmax probabilities across 5 classes (0–4)
  - Note: Some `.h5` files contain an entire saved Keras model; others contain weights only. The backend tries to `keras.models.load_model()` first and, on failure, reconstructs the architecture and calls `load_weights()`.

**API endpoints (backend)**
- `GET /health` — healthcheck
- `POST /predict/coral` — run CORAL model on uploaded image
- `POST /predict/resnet` — run ResNet50 model on uploaded image (may be disabled on deployment)
- `POST /predict/compare` — run both models and return side‑by‑side results

**Docker / Production**
- A `Dockerfile` is provided in `RA_backend` for building a containerized backend. For production, use a WSGI server (gunicorn) and ensure sufficient memory when enabling both models.

Example (build & run):

```powershell
# from RA_backend
docker build -t oa-backend:latest .
# run with both models (local machine must have enough RAM)
docker run --rm -p 5000:5000 -e PORT=5000 oa-backend:latest
```

**Troubleshooting**
- Python version: if you get import/installation issues for `numpy` or `setuptools`, switch to Python 3.11 and recreate the virtualenv.
- ResNet loading errors: the backend attempts to load a full model first; if `model.weights.h5` is weights‑only, ensure the expected architecture code exists and the weights file matches that architecture.
- Out of memory (OOM): if the process fails on startup with OOM, set `ENABLE_RESNET=false` or use the `main` branch for deployment.

**Branch workflow**
- For deployment (Render/free tier): use `main` — more memory‑efficient.
- For local full experiments and comparison: use `both_models` (contains both models loaded unconditionally).

**Contributing & Notes**
- This repository is intended for research/educational use. If you add new model checkpoints, document their paths and training details in `RA_backend/README.md` or this file.

**License & Disclaimer**
This project is for educational and research purposes only. It is not a medical device. Do not use the predictions for clinical decision making; always consult qualified healthcare professionals.

