# 📦 Docker & Render Deployment - Complete Setup

## ✅ What Was Created

### Docker Configuration Files

#### Backend (RA_backend/)
- ✅ **Dockerfile** - Python 3.11 + PyTorch CPU + Flask + Gunicorn
- ✅ **.dockerignore** - Excludes unnecessary files from image
- ✅ **requirements_runtime.txt** - Updated with gunicorn

#### Frontend (RA_frontend/)
- ✅ **Dockerfile** - Multi-stage build (Node 18 + Nginx)
- ✅ **nginx.conf** - Production web server config
- ✅ **.dockerignore** - Excludes node_modules, etc.
- ✅ **.env.example** - Updated with VITE_API_URL

#### Root Directory
- ✅ **docker-compose.yml** - Local testing with both services
- ✅ **render.yaml** - Auto-deploy configuration for Render
- ✅ **DEPLOYMENT.md** - Complete deployment guide
- ✅ **RENDER_DEPLOY.md** - Quick reference for Render

### Code Updates
- ✅ **app.py** - Uses PORT env var, updated branding
- ✅ **AnalyzePage.tsx** - Uses VITE_API_URL env var for API calls

---

## 🎯 Next Steps for Render Deployment

### Option 1: Automatic Deploy (Recommended)

1. **Push to GitHub:**
   ```bash
   cd C:\Users\Vidisha\Desktop\Coding_Projects\RA_detection
   git add .
   git commit -m "Add Docker and Render deployment config"
   git push origin main
   ```

2. **Deploy on Render:**
   - Go to https://render.com/dashboard
   - Click **New** → **Blueprint**
   - Connect your GitHub repository
   - Select your repository
   - Click **Apply**
   - Render creates both services automatically from `render.yaml`

3. **Configure Frontend Environment:**
   - After backend deploys, copy its URL
   - Go to frontend service → Environment
   - Add/update: `VITE_API_URL` = `https://YOUR-BACKEND.onrender.com`
   - Click Save (triggers redeploy)

### Option 2: Manual Deploy

Follow step-by-step instructions in [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🧪 Test Locally First (Optional)

Before deploying, test with Docker:

```bash
# Build and start both services
docker-compose up --build

# Test:
# Frontend: http://localhost
# Backend: http://localhost:5000/health

# Stop when done
docker-compose down
```

---

## 📋 Deployment Checklist

**Before Deploy:**
- [ ] Model file exists: `RA_backend/RA_Ordinal_Classification/efficientnet_ordinal.pth`
- [ ] All changes committed to Git
- [ ] Pushed to GitHub main branch
- [ ] Render account created

**During Deploy:**
- [ ] Backend service created
- [ ] Backend builds successfully (~5-10 min)
- [ ] Backend health check passes: `/health` returns OK
- [ ] Frontend service created
- [ ] `VITE_API_URL` set to backend URL
- [ ] Frontend builds successfully (~3-5 min)

**After Deploy:**
- [ ] Visit frontend URL
- [ ] Upload test X-ray image
- [ ] Verify prediction works
- [ ] Check confidence scores display correctly
- [ ] Test Detailed Analysis tab (optional: needs Gemini key)

---

## 🔧 Environment Variables

### Backend (Auto-configured)
| Variable | Value | Set By |
|----------|-------|--------|
| `PORT` | 10000 | Render (automatic) |
| `PYTHONUNBUFFERED` | 1 | Dockerfile |

### Frontend (Manual)
| Variable | Value | Required |
|----------|-------|----------|
| `VITE_API_URL` | Backend URL | ✅ Yes |
| `VITE_GEMINI_API_KEY` | Your API key | ❌ Optional |

---

## 💰 Cost Breakdown

### Free Tier
- **Backend**: Free (with cold starts)
- **Frontend**: Free (with cold starts)
- **Total**: $0/month
- **Limitation**: Services sleep after 15 min inactivity

### Starter Plan (Recommended)
- **Backend**: $7/month
- **Frontend**: $7/month
- **Total**: $14/month
- **Benefits**: Always on, no cold starts, faster

### Standard Plan (Production)
- **Backend**: $25/month (2 GB RAM)
- **Frontend**: $25/month
- **Total**: $50/month
- **Benefits**: Best performance, custom domains

---

## 🐛 Troubleshooting

### Build Issues

**Backend build timeout:**
```
Solution: Increase build timeout in Render settings
PyTorch installation takes ~5-10 minutes
```

**Model file not found:**
```
Check: RA_backend/RA_Ordinal_Classification/efficientnet_ordinal.pth exists
If large (>100 MB), consider Git LFS or external storage
```

**Out of memory:**
```
Solution: Upgrade to Starter or Standard plan
PyTorch + model needs ~1-2 GB RAM
```

### Runtime Issues

**Frontend can't reach backend:**
```
1. Check VITE_API_URL is set correctly
2. Verify backend /health endpoint works
3. Ensure URL uses https:// (not http://)
4. Check CORS enabled in backend (already configured)
```

**Slow predictions:**
```
Free tier has limited CPU (0.5 CPU)
Upgrade to Starter (1 CPU) or Standard (2 CPU)
Consider GPU instance for real-time requirements
```

**Cold starts:**
```
Free tier: 30-60 second delay after 15 min idle
Solution: Upgrade to Starter plan ($7/mo per service)
```

---

## 📊 Expected Performance

### Build Times
- **Backend**: 5-10 minutes (first build), 2-3 min (subsequent)
- **Frontend**: 3-5 minutes (first build), 1-2 min (subsequent)

### Startup Times
- **Backend**: 10-30 seconds (model loading)
- **Frontend**: <5 seconds (Nginx)

### Inference Time
- **Free Tier**: 2-5 seconds per image
- **Starter**: 1-3 seconds per image
- **Standard**: <1 second per image

---

## 🔄 Update Workflow

After making changes:

```bash
# Commit changes
git add .
git commit -m "Update description"
git push origin main

# Render auto-detects and redeploys
# Check logs in dashboard
```

---

## 📚 Documentation Reference

| Document | Purpose |
|----------|---------|
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Complete deployment guide with all details |
| [RENDER_DEPLOY.md](./RENDER_DEPLOY.md) | Quick reference for Render |
| [docker-compose.yml](./docker-compose.yml) | Local testing configuration |
| [render.yaml](./render.yaml) | Render auto-deploy configuration |

---

## ✅ Success Criteria

Your deployment is successful when:

1. ✅ Backend health check returns: `{"status": "healthy", "model_loaded": true}`
2. ✅ Frontend loads without errors
3. ✅ Image upload works
4. ✅ Prediction returns valid results
5. ✅ Confidence scores display correctly (0-100%)
6. ✅ All three tabs work (Home, Analyze, Detailed Analysis)

---

## 🆘 Get Help

- **Render Docs**: https://render.com/docs
- **Community**: https://community.render.com
- **Docker Docs**: https://docs.docker.com
- **GitHub Issues**: Create issue in your repository

---

## 🎉 You're Ready!

Everything is configured and ready to deploy. Follow the steps above to get your application live on Render.

**Recommended Next Steps:**
1. Test locally with `docker-compose up --build` (optional)
2. Push to GitHub
3. Deploy via Render Blueprint (automatic)
4. Set `VITE_API_URL` in frontend
5. Test end-to-end
6. Share your deployed app! 🚀
