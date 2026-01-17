# 🚀 Deployment Guide: Render

## Prerequisites
- GitHub account
- Render account (sign up at https://render.com)
- Git repository pushed to GitHub

## Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Add Docker configuration for Render deployment"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Render

### Option A: Automatic Deploy (Using render.yaml)

1. Go to https://render.com/dashboard
2. Click **New** → **Blueprint**
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml` and create both services
5. Click **Apply** to deploy both backend and frontend

### Option B: Manual Deploy

#### Deploy Backend First:
1. Go to https://render.com/dashboard
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `oa-backend`
   - **Environment**: `Docker`
   - **Branch**: `main`
   - **Root Directory**: `RA_backend`
   - **Plan**: `Starter` (free tier) or `Standard` for better performance
5. Click **Create Web Service**
6. Wait for deployment (~5-10 minutes for first build)
7. **Copy the backend URL** (e.g., `https://oa-backend.onrender.com`)

#### Deploy Frontend:
1. Click **New** → **Web Service**
2. Connect the same repository
3. Configure:
   - **Name**: `oa-frontend`
   - **Environment**: `Docker`
   - **Branch**: `main`
   - **Root Directory**: `RA_frontend`
   - **Plan**: `Starter`
4. **Add Environment Variable**:
   - Key: `VITE_API_URL`
   - Value: `https://oa-backend.onrender.com` (your backend URL from step 7)
5. **(Optional)** Add Gemini API key:
   - Key: `VITE_GEMINI_API_KEY`
   - Value: Your Gemini API key
6. Click **Create Web Service**

## Step 3: Verify Deployment

1. **Check Backend**:
   - Visit: `https://oa-backend.onrender.com/health`
   - Should return: `{"status": "healthy", "model_loaded": true}`

2. **Check Frontend**:
   - Visit: `https://oa-frontend.onrender.com`
   - Upload a test knee X-ray image
   - Verify prediction works

## Important Notes

### Free Tier Limitations
- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down takes ~30-60 seconds (cold start)
- For production, upgrade to **Starter** ($7/month) or higher plans

### Backend Performance
- Model loading takes ~10-30 seconds on first start
- Upgrade to **Standard** plan ($25/month) for:
  - Faster instance (2 GB RAM)
  - No cold starts
  - Better performance

### Model File Size
- If model file is large (>100 MB), consider:
  - Using Git LFS (Large File Storage)
  - Uploading model to cloud storage and downloading at runtime
  - Using Render Persistent Disk

## Troubleshooting

### Backend fails to start
- Check logs in Render dashboard
- Ensure PyTorch installs correctly (may take 5-10 min)
- Verify model file exists at `RA_Ordinal_Classification/efficientnet_ordinal.pth`

### Frontend can't connect to backend
- Verify `VITE_API_URL` environment variable is set correctly
- Check CORS is enabled in backend (already configured)
- Ensure backend URL uses `https://` (not `http://`)

### Slow predictions
- Free tier has limited CPU
- Upgrade to Standard plan for better performance
- Consider using GPU instance for faster inference

## Update Deployment

After making changes:

```bash
git add .
git commit -m "Update description"
git push origin main
```

Render will automatically rebuild and redeploy both services.

## Local Testing with Docker

Before deploying, test locally:

```bash
# Build and run both services
docker-compose up --build

# Frontend: http://localhost:80
# Backend: http://localhost:5000
```

Stop containers:
```bash
docker-compose down
```

## Cost Estimation

**Free Tier (both services)**: $0/month
- Cold starts after 15 min inactivity
- 750 hours/month shared across services

**Starter Plan (recommended)**: $14/month ($7 × 2 services)
- No cold starts
- Always running
- Better performance

**Standard Plan (production)**: $50/month ($25 × 2 services)
- 2 GB RAM per service
- Best performance
- Custom domains included

## Environment Variables Summary

### Backend (oa-backend)
- `PORT`: Auto-set by Render (default: 10000)
- `PYTHONUNBUFFERED`: 1 (already in Dockerfile)

### Frontend (oa-frontend)
- `VITE_API_URL`: Your backend URL (e.g., `https://oa-backend.onrender.com`)
- `VITE_GEMINI_API_KEY`: (Optional) Your Gemini API key

## Next Steps After Deployment

1. ✅ Test with multiple X-ray images
2. ✅ Monitor logs for errors
3. ✅ Set up custom domain (optional)
4. ✅ Configure SSL certificate (automatic with Render)
5. ✅ Enable monitoring/alerts in Render dashboard
6. ✅ Consider upgrading to paid plan for better performance

## Support

- Render Documentation: https://render.com/docs
- GitHub Issues: Create issues in your repository
- Render Community: https://community.render.com
