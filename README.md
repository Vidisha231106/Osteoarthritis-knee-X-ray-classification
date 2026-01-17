# Osteoarthritis Knee X-ray Classification

A full-stack AI application for classifying knee osteoarthritis severity from X-ray images using two complementary deep learning models. The system provides both ordinal regression and multi-class classification approaches to assess Kellgren-Lawrence (KL) grades.

## Overview

This application uses two distinct deep learning models to analyze knee X-rays and classify osteoarthritis severity:

1. **CORAL Ordinal Regression Model**: EfficientNet-B0 with CORAL head for ordinal classification
2. **ResNet50 Multi-class Model**: Standard ResNet50 with softmax classification

Both models classify images into 5 categories based on the Kellgren-Lawrence grading system (0-4), representing disease progression from normal to severe osteoarthritis.

## Project Structure

```
RA_detection/
├── RA_backend/                        # Flask API Server
│   ├── app.py                         # Main Flask application with dual-model support
│   ├── RA_Ordinal_Classification/     # Model files and training code
│   │   ├── efficientnet_ordinal.pth   # CORAL model weights (PyTorch)
│   │   ├── model.weights.h5           # ResNet50 model weights (TensorFlow/Keras)
│   │   └── src/
│   │       ├── model.py               # CORAL model architecture
│   │       ├── dataset.py             # Dataset utilities
│   │       ├── train.py               # Training scripts
│   │       ├── evaluate.py            # Evaluation utilities
│   │       └── utils.py               # Helper functions
│   ├── requirements_runtime.txt       # Production dependencies
│   ├── Dockerfile                     # Docker configuration
│   └── render.yaml                    # Render deployment config
│
└── RA_frontend/                       # React + TypeScript Frontend
    ├── src/
    │   ├── App.tsx                    # Main app with 4-tab navigation
    │   ├── components/
    │   │   ├── HomePage.tsx           # Landing page
    │   │   ├── CoralAnalysisPage.tsx  # CORAL model interface
    │   │   ├── ResNetAnalysisPage.tsx # ResNet50 model interface
    │   │   ├── ComparisonPage.tsx     # Side-by-side comparison
    │   │   ├── UploadSection.tsx      # Image upload component
    │   │   ├── PreviewArea.tsx        # Image preview component
    │   │   ├── ResultsPanel.tsx       # Results display component
    │   │   ├── AnalyzeButton.tsx      # Analysis trigger button
    │   │   └── Loader.tsx             # Loading animation
    │   └── ...
    ├── package.json
    ├── vite.config.ts
    └── Dockerfile                     # Frontend Docker config
```

## Quick Start

### Prerequisites

- **Python 3.11** (3.13 not compatible with numpy 1.24.3)
- **Node.js 16+** and npm
- Both model weight files in `RA_backend/RA_Ordinal_Classification/`:
  - `efficientnet_ordinal.pth`
  - `model.weights.h5`

### 1. Start Backend Server

```bash
# Navigate to backend folder
cd RA_backend

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies (first time only)
pip install -r requirements_runtime.txt

# Start the server
python app.py
```

The backend will run on **http://localhost:5000**

**Note**: On main branch, ResNet50 is disabled by default for deployment. To enable both models locally, set environment variable:
```bash
# Windows PowerShell:
$env:ENABLE_RESNET="true"
# Windows CMD:
set ENABLE_RESNET=true
# Mac/Linux:
export ENABLE_RESNET=true
```

Or use the `both_models` branch for local development with both models enabled.

### 2. Start Frontend Development Server

Open a **new terminal** and run:

```bash
# Navigate to frontend folder
cd RA_frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

The frontend will run on **http://localhost:5173**

### 3. Access the Application

Open your browser and go to:
**http://localhost:5173**

## Application Features

### Four-Tab Interface

1. **Home Tab**: Overview of both models and application features
2. **CORAL Analysis**: Ordinal regression analysis with EfficientNet-B0 + CORAL
3. **ResNet50 Analysis**: Multi-class classification with ResNet50
4. **Compare Models**: Side-by-side comparison of both model predictions

### How to Use

1. **Select Tab**: Choose CORAL, ResNet50, or Compare Models
2. **Upload Image**: Click or drag-and-drop a knee X-ray image (PNG, JPG, JPEG)
3. **Analyze**: Click the "Analyze Image" button
4. **View Results**: 
   - Predicted KL grade (0-4)
   - Confidence scores / probability distribution
   - Severity classification (Normal/Doubtful/Mild/Moderate/Severe)
   - Model-specific insights

## API Endpoints

### Backend (http://localhost:5000)

- **`GET /health`** - Health check endpoint
  - Returns: `{"status": "healthy"}`

- **`POST /predict/coral`** - CORAL model prediction
  - Body: `multipart/form-data` with `file` field
  - Returns:
    ```json
    {
      "predicted_class": 2,
      "severity": "Mild",
      "probabilities": [0.05, 0.15, 0.45, 0.25, 0.10],
      "confidence": 0.45
    }
    ```

- **`POST /predict/resnet`** - ResNet50 model prediction
  - Body: `multipart/form-data` with `file` field
  - Returns:
    ```json
    {
      "predicted_class": 2,
      "severity": "Mild",
      "probabilities": [0.08, 0.12, 0.52, 0.20, 0.08],
      "confidence": 0.52
    }
    ```

- **`POST /predict/compare`** - Both models comparison
  - Body: `multipart/form-data` with `file` field
  - Returns:
    ```json
    {
      "coral": { "predicted_class": 2, "severity": "Mild", ... },
      "resnet": { "predicted_class": 2, "severity": "Mild", ... },
      "agreement": true
    }
    ```

## Model Architectures

### 1. CORAL Ordinal Regression Model (Primary)

**Architecture:**
- **Backbone**: EfficientNet-B0 (pretrained on ImageNet)
- **Head**: CORAL (COnsistent RAnk Logits) ordinal regression layer
- **Framework**: PyTorch
- **Input Size**: 224x224 RGB images
- **Output**: 4 cumulative logits → 5 ordinal classes (KL grades 0-4)

**Key Features:**
- **Ordinal Classification**: Respects natural ordering of disease progression
- **Adjacent Error Penalty**: Predicting Grade 2 as Grade 1 penalized less than predicting as Grade 4
- **Cumulative Probabilities**: Uses cumulative link model for interpretable predictions
- **Training Method**: CORAL loss function that maintains rank consistency

**Model File**: `efficientnet_ordinal.pth` (~18MB)

**Why CORAL?**
Medical severity grading is inherently ordinal. CORAL ensures predictions respect disease progression order, making misclassifications more clinically sensible (adjacent grades vs. distant grades).

---

### 2. ResNet50 Multi-class Classification Model

**Architecture:**
- **Backbone**: ResNet50 (pretrained on ImageNet)
- **Head**: Custom CNN layers + Softmax output (5 classes)
- **Framework**: TensorFlow/Keras
- **Input Size**: 224x224 RGB images
- **Output**: 5 softmax probabilities (one per KL grade)

**Key Features:**
- **Standard Classification**: Treats each grade as independent category
- **Softmax Output**: Provides direct probability distribution over all classes
- **Deep Residual Learning**: 50-layer network with skip connections
- **Transfer Learning**: Leverages ImageNet pretraining for medical imaging

**Model File**: `model.weights.h5` (~90MB)

**Why ResNet50?**
Provides alternative perspective using standard multi-class classification. Useful for comparison and ensemble strategies.

---

### Kellgren-Lawrence Grading System

Both models classify knee osteoarthritis into 5 grades:

| Grade | Severity | Description |
|-------|----------|-------------|
| **0** | Normal | No radiographic features of OA |
| **1** | Doubtful | Minute osteophyte, doubtful significance |
| **2** | Mild | Definite osteophytes, possible joint space narrowing |
| **3** | Moderate | Moderate osteophytes, definite joint space narrowing |
| **4** | Severe | Large osteophytes, marked joint space narrowing, severe sclerosis |

## Troubleshooting

### Backend Issues

**Model files not loading:**
- Verify both files exist in `RA_backend/RA_Ordinal_Classification/`:
  - `efficientnet_ordinal.pth` (~18MB)
  - `model.weights.h5` (~90MB)
- Check Python version (3.11 recommended, 3.13 not compatible)
- Ensure all dependencies installed: `pip install -r requirements_runtime.txt`

**ResNet50 model disabled:**
- On main branch, set `ENABLE_RESNET=true` environment variable
- Or switch to `both_models` branch: `git checkout both_models`

**Out of Memory (OOM) errors:**
- Both models require ~600MB RAM
- Use main branch with CORAL-only for <512MB environments
- Consider upgrading server/container memory allocation

**Port 5000 already in use:**
```bash
# Windows: Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### Frontend Issues

**Cannot connect to backend:**
- Verify backend running on `http://localhost:5000`
- Check `/health` endpoint: `curl http://localhost:5000/health`
- Review CORS settings in `app.py`
- Ensure frontend proxy configured in `vite.config.ts`

**Build errors:**
```bash
cd RA_frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**TypeScript errors:**
```bash
# Clear TypeScript cache
rm -rf node_modules/.vite
npm run dev
```

### Python Version Issues

**Python 3.13 incompatibility:**
- Error: `ModuleNotFoundError: No module named 'pkg_resources'`
- Solution: Use Python 3.11
  ```bash
  python3.11 -m venv venv
  venv\Scripts\activate
  pip install -r requirements_runtime.txt
  ```

## Development

### Backend Development
- Flask runs in debug mode: `app.run(debug=True)`
- Auto-reloads on code changes
- View logs in terminal for debugging

### Frontend Development
- Vite provides hot module replacement (HMR)
- Changes appear instantly without page reload
- Check browser console for errors

### Adding New Models

1. Add model weights to `RA_backend/RA_Ordinal_Classification/`
2. Update `app.py` to load and run inference
3. Create new endpoint (e.g., `/predict/model3`)
4. Add corresponding frontend page in `RA_frontend/src/components/`
5. Update `App.tsx` navigation tabs

## Performance Considerations

### Memory Usage
- **CORAL only**: ~300MB RAM
- **Both models**: ~600MB RAM
- **ResNet50 with ImageNet**: +100MB initial download

### Inference Speed
- **CORAL (PyTorch CPU)**: ~200-500ms per image
- **ResNet50 (TensorFlow CPU)**: ~300-700ms per image
- **GPU acceleration**: Not configured (CPU-only deployment)

### Optimization Tips
1. Use `ENABLE_RESNET=false` for memory-constrained environments
2. Implement image caching for repeated predictions
3. Consider model quantization for smaller footprint
4. Use batch inference for multiple images

## Branch Strategy

This repository uses two branches for different use cases:

### `main` branch (Deployment-Optimized)
- **Purpose**: Production deployment to Render (512MB free tier)
- **ResNet50**: Disabled by default (`ENABLE_RESNET=false`)
- **Memory Usage**: ~300MB (CORAL model only)
- **Use Case**: Live deployment with memory constraints

**To enable ResNet50 on main:**
```bash
export ENABLE_RESNET=true  # Linux/Mac
$env:ENABLE_RESNET="true"  # Windows PowerShell
```

### `both_models` branch (Full Features)
- **Purpose**: Local development and testing
- **ResNet50**: Always enabled
- **Memory Usage**: ~600MB (both models)
- **Use Case**: Development, comparison experiments, full-feature testing

**Switch to both_models branch:**
```bash
git checkout both_models
```

## Docker Deployment

### Backend (Production)

```bash
cd RA_backend

# Build image
docker build -t oa-backend:latest .

# Run with CORAL only (512MB environments)
docker run -p 5000:5000 -e ENABLE_RESNET=false oa-backend:latest

# Run with both models (>1GB RAM required)
docker run -p 5000:5000 -e ENABLE_RESNET=true oa-backend:latest
```

### Frontend

```bash
cd RA_frontend

# Build image
docker build -t oa-frontend:latest .

# Run
docker run -p 80:80 oa-frontend:latest
```

### Render Deployment

The application is configured for Render deployment via `render.yaml`:
- Backend service with `ENABLE_RESNET=false` for 512MB tier
- Automatic health checks on `/health` endpoint
- Environment variables configurable in Render dashboard

## Tech Stack

### Backend
- **Python 3.11**
- **Flask 3.0.0** - Web framework
- **Flask-CORS 4.0.0** - Cross-origin resource sharing
- **PyTorch** - CORAL model inference
- **TensorFlow-CPU 2.15.0** - ResNet50 model inference
- **Pillow** - Image preprocessing
- **NumPy** - Numerical operations
- **Gunicorn 21.2.0** - Production WSGI server

### Frontend
- **React 18.3.1**
- **TypeScript 5.5.3**
- **Vite** - Build tool and dev server
- **Tailwind CSS 3.4.17** - Utility-first CSS
- **Lucide React** - Icon library

## Contributing

Contributions are welcome! Areas for improvement:
- Additional model architectures (DenseNet, Vision Transformer)
- GPU acceleration support
- Model ensemble strategies
- Data augmentation experiments
- Frontend UI/UX enhancements

## References

### CORAL Ordinal Regression
- Paper: "Rank Consistent Ordinal Regression for Neural Networks" (Cao et al., 2020)
- Implementation: Based on PyTorch CORAL ordinal regression

### Kellgren-Lawrence Grading
- Kellgren, J. H., & Lawrence, J. S. (1957). "Radiological assessment of osteo-arthrosis"

## License & Disclaimer

This is a medical imaging AI tool for **educational and research purposes only**. 

⚠️ **Important Medical Disclaimer**:
- This software is NOT intended for clinical diagnosis
- Always consult qualified healthcare professionals for medical decisions
- Predictions should be verified by board-certified radiologists
- Not FDA approved or clinically validated

## Acknowledgments

- EfficientNet architecture by Google Research
- ResNet architecture by Microsoft Research
- CORAL ordinal regression methodology
- Open-source PyTorch and TensorFlow communities
