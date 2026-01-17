# RA Detection Backend API

Flask-based REST API for Rheumatoid Arthritis detection from X-ray images using a trained EfficientNet-B0 + CORAL Ordinal Regression model.

## Setup

### 1. Install Dependencies

```bash
# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install required packages
pip install -r requirements.txt
```

### 2. Model File

The trained PyTorch model is located at:
```
RA_backend/
├── app.py
├── RA_Ordinal_Classification/
│   ├── efficientnet_ordinal.pth  ← Trained model
│   └── src/
│       ├── model.py              ← Model architecture
│       └── ...
├── requirements.txt
└── README.md
```

### 3. Run the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
```bash
GET /health
```
Returns server health status and model loading status.

### Predict
```bash
POST /predict
Content-Type: multipart/form-data
Body: file=<image_file>
```

**Response Example:**
```json
{
  "grade": 2,
  "severity": "Mild",
  "confidence": 85.67,
  "explanation": "Mild rheumatoid arthritis detected. Evidence of periarticular osteoporosis, slight joint space narrowing, and possible early erosions at the joint margins.",
  "probabilities": {
    "stage_0": 0.02,
    "stage_1": 0.08,
    "stage_2": 0.86,
    "stage_3": 0.03,
    "stage_4": 0.01
  },
  "model_type": "CORAL Ordinal Regression",
  "ordinal_outputs": [0.95, 0.88, 0.12, 0.03]
}
```

## Testing the API

### Using cURL
```bash
curl -X POST -F "file=@path/to/xray.jpg" http://localhost:5000/predict
```

### Using Python
```python
import requests

url = "http://localhost:5000/predict"
files = {"file": open("xray.jpg", "rb")}
response = requests.post(url, files=files)
print(response.json())
```

## Model Information

- **Architecture:** EfficientNet-B0 + CORAL Ordinal Head
- **Framework:** PyTorch
- **Input Size:** 224x224 RGB
- **Classes:** 5 stages (0-4) of Rheumatoid Arthritis
  - 0: Normal
  - 1: Doubtful/Minimal
  - 2: Mild
  - 3: Moderate
  - 4: Severe
- **Training Method:** CORAL (COnsistent RAnk Logits) for ordinal regression
  - Respects natural ordering of disease stages
  - Penalizes adjacent stage errors less than distant stage errors

## CORAL Ordinal Regression

Unlike standard classification, this model uses ordinal regression which:
- Treats stages as ordered categories (Stage 0 < Stage 1 < Stage 2...)
- Produces 4 cumulative probabilities: P(stage > 0), P(stage > 1), P(stage > 2), P(stage > 3)
- Final prediction counts how many thresholds are passed
- More clinically meaningful for progressive diseases

## Troubleshooting

### Model not loading
- Ensure `RA_Ordinal_Classification/efficientnet_ordinal.pth` exists
- Check file permissions
- Verify PyTorch version compatibility

### CORS issues
- The API includes CORS support for frontend integration
- Adjust CORS settings in `app.py` if needed

### Port already in use
Change the port in `app.py`:
```python
app.run(host='0.0.0.0', port=5001, debug=True)  # Changed to 5001
```

## Lightweight Install Option

If you don't need training tools and only want to run the pre-trained model for inference, you can use the lightweight requirements file:

```bash
pip install -r requirements_runtime.txt
```

Note: `requirements_runtime.txt` installs only minimal runtime packages. You still must install PyTorch manually (see below).

## Manual PyTorch Installation (Windows examples)

PyTorch wheels depend on OS and CUDA version. Choose the appropriate command from the PyTorch website: https://pytorch.org/get-started/locally/

Common examples:

CPU-only (Windows):
```bash
pip install --index-url https://download.pytorch.org/whl/cpu torch torchvision
```

CUDA 11.8 (example):
```bash
pip install --index-url https://download.pytorch.org/whl/cu118 torch torchvision
```

After installing PyTorch, install the lightweight requirements:
```bash
pip install -r requirements_runtime.txt
```

If you prefer not to install PyTorch, consider converting the `.pth` model to ONNX and using `onnxruntime` for inference (extra work required).

