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
```

## Quick Start

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
pip install -r requirements.txt

# Start the server
python app.py
```

The backend will run on **http://localhost:5000**

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

## How to Use

1. **Upload Image**: Click or drag-and-drop an X-ray image (PNG, JPG, JPEG)
2. **Analyze**: Click the "Analyze Image" button
3. **View Results**: See the predicted RA stage, severity level, and confidence score

## API Endpoints

### Backend (http://localhost:5000)

- `GET /health` - Check server status
- `POST /predict` - Upload image for prediction

### Frontend Proxy

The frontend development server automatically proxies `/predict` and `/health` requests to the backend.

## Model Information

- **Architecture**: EfficientNet-B0 with CORAL Ordinal Regression Head
- **Framework**: PyTorch
- **Input**: 224x224 RGB images
- **Output**: 5 classes (Stages 0-4) of Rheumatoid Arthritis
  - Stage 0: Normal
  - Stage 1: Doubtful/Minimal
  - Stage 2: Mild
  - Stage 3: Moderate
  - Stage 4: Severe
- **Training Method**: CORAL (COnsistent RAnk Logits) ordinal regression
  - Respects natural ordering of disease progression
  - Adjacent stage errors penalized less than distant stage errors

## Troubleshooting

### Backend Issues

**Model not loading:**
- Verify `Best_EfficientNetB3.h5` is in the `RA_backend/` folder
- Check file size is ~85MB
- Ensure TensorFlow is installed correctly

**Port 5000 already in use:**
- Change port in `app.py` (line with `app.run()`)
- Update proxy in `RA_frontend/vite.config.ts`

### Frontend Issues

**Cannot connect to backend:**
- Ensure backend server is running on port 5000
- Check console for CORS or network errors
- Verify proxy configuration in `vite.config.ts`

**Module not found errors:**
```bash
cd RA_frontend
rm -rf node_modules package-lock.json
npm install
```

## Development

### Backend Development
- Flask runs in debug mode by default
- Changes to `app.py` auto-reload the server

### Frontend Development
- Vite provides hot module replacement
- Changes appear instantly in the browser

## Production Deployment

### Backend
```bash
# Use production WSGI server
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend
```bash
cd RA_frontend
npm run build
# Deploy the 'dist' folder to your hosting service
```

## Tech Stack

### Backend
- Python 3.x
- Flask (Web framework)
- PyTorch (Deep learning)
- TorchVision (Image preprocessing)
- Pillow (Image processing)
- NumPy (Numerical operations)

### Frontend
- React 18
- TypeScript
- Vite (Build tool)
- Tailwind CSS (Styling)
- Lucide React (Icons)

## License & Disclaimer

This is a medical imaging AI tool for educational and research purposes. Always consult qualified healthcare professionals for medical decisions.
