# 🚀 Quick Start Guide - RA Detection Application

## ✅ Prerequisites Check

Before starting, ensure you have:
- ✅ Python 3.8 or higher installed
- ✅ Node.js 16+ and npm installed  
- ✅ Model file: `efficientnet_ordinal.pth` in `RA_backend/RA_Ordinal_Classification/` folder

---

## 🎯 Method 1: Automated Setup (Recommended)

### Step 1: Run Setup
Double-click `setup.bat` or run:
```bash
.\setup.bat
```

This will:
- Create Python virtual environment
- Install all backend dependencies
- Install all frontend dependencies

### Step 2: Start Backend
In Terminal 1:
```bash
.\start-backend.bat
```

**Wait for:** `* Running on http://127.0.0.1:5000`

### Step 3: Start Frontend  
In Terminal 2 (keep backend running):
```bash
.\start-frontend.bat
```

**Wait for:** `Local: http://localhost:5173/`

### Step 4: Open Application
Open browser and navigate to: **http://localhost:5173**

---

## 🔧 Method 2: Manual Setup

### Backend Setup

```bash
# 1. Navigate to backend
cd RA_backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
venv\Scripts\activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Verify model file exists
dir RA_Ordinal_Classification\efficientnet_ordinal.pth

# 6. Start server
python app.py
```

**Expected Output:**
```
✅ PyTorch model loaded successfully from C:\...\efficientnet_ordinal.pth
📱 Using device: cuda (or cpu)
🚀 Starting RA Detection API Server...
 * Running on http://127.0.0.1:5000
```

### Frontend Setup

Open a **NEW terminal** (keep backend running):

```bash
# 1. Navigate to frontend
cd RA_frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

**Expected Output:**
```
  VITE v7.3.1  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 📱 Using the Application

### 1. Upload Image
- Click the upload area or drag & drop
- Supported formats: PNG, JPG, JPEG
- Max size: 10MB

### 2. Analyze
- Click "Analyze Image" button
- Wait for processing (2-5 seconds)

### 3. View Results
- **Grade:** RA stage (0-4)
- **Severity:** Description level
- **Confidence:** Prediction confidence (%)
- **Explanation:** Detailed medical interpretation

---

## 🔍 Testing the API

### Test Backend Health
```bash
# In browser or curl
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### Test Prediction
```bash
# Using PowerShell
cd RA_backend
python test_api.py path/to/test_image.jpg
```

---

## ⚠️ Troubleshooting

### Backend Issues

**Problem:** `ModuleNotFoundError: No module named 'flask'`
```bash
cd RA_backend
venv\Scripts\activate
pip install -r requirements.txt
```

**Problem:** `Model file not found`RA_Ordinal_Classification\efficientnet_ordinal.pth`
- Check file size: Should be several MB
- Ensure you've trained the model or obtained pre-trained weights
- Copy from Temporary_Backend if missing

**Problem:** Port 5000 already in use
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change port in app.py (line ~175)
app.run(host='0.0.0.0', port=5001, debug=True)
```

### Frontend Issues

**Problem:** `Cannot GET /predict - 404 Error`
- Ensure backend is running on port 5000
- Check `vite.config.ts` proxy configuration
- Restart frontend dev server

**Problem:** Module installation fails
```bash
cd RA_frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Problem:** CORS errors
- Verify Flask-CORS is installed: `pip show flask-cors`
- Backend should show CORS enabled in logs

---

## 📊 Expected Behavior

### Successful Flow
1. **Upload** → Image preview appears
2. **Analyze** → Loading spinner shows
3. **Results** → Card appears with:
   - Stage number (0-4)
   - Severity badge (color-coded)
   - Confidence percentage
   - Medical explanation

### Error Cases
- **Invalid file type:** Red error message
- **File too large:** Size limit warning  
- **Backend offline:** Connection error message
- **Prediction failed:** Server error details

---

## 🛑 Stopping the Application

### Stop Backend
Press `CTRL + C` in backend terminal

### Stop Frontend  
Press `CTRL + C` in frontend terminal

---

## 📁 Project Structure Reference

```
RA_detection/
│
├── setup.bat                    # One-time setup script
├── start-backend.bat            # Start backend server
├── start-frontend.bat           # Start frontend app
├── README.md                    # This file
│
├── RA_backend/
│   ├── app.py                  # Flask API server
│   ├── RA_Ordinal_Classification/
│   │   ├── efficientnet_ordinal.pth  # PyTorch model weights
│   │   └── src/
│   │       ├── model.py              # Model architecture (CORAL)
│   │       ├── dataset.py
│   │       ├── train.py
│   │       └── evaluate.py
│   ├── requirements.txt        # Python dependencies
│   ├── test_api.py            # API testing script
│   └── venv/                  # Virtual environment (created by setup)
│
└── RA_frontend/
    ├── src/
    │   ├── App.tsx            # Main React component
    │   └── components/        # UI components
    ├── package.json           # Node dependencies
    ├── vite.config.ts        # Vite configuration (with proxy)
    └── node_modules/         # Dependencies (created by setup)
```

---

## 🎓 Additional Resources

### API Documentation
- Backend README: `RA_backend/README.md`
- API endpoints: http://localhost:5000/ (when running)

### Testing
```bash
# Test backend API
cd RA_backend
python test_api.py test_image.jpg

# Build frontend for production
cd RA_frontend
npm run build
```

### Logs
- Backend logs appear in terminal 1
- Frontend logs appear in terminal 2
- Browser console (F12) for frontend errors

---

## 📞 Support Checklist

If you encounter issues:

1. ✅ Check both terminals are running
2. ✅ Verify URLs:
   - Backend: http://localhost:5000/health
   - Frontend: http://localhost:5173
3. ✅ Check model file exists and is ~85MB
4. ✅ Verify Python and Node.js versions
5. ✅ Review terminal logs for errors
6. ✅ Try the test script: `python test_api.py`

---

**Need help?** Check the terminal logs first - they usually show the exact error!
