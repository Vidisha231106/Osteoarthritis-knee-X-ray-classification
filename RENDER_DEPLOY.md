# 🚀 Render Deployment - Quick Reference

## ⚡ Super Quick Deploy (5 Minutes)

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### 2. Deploy on Render
1. Go to https://render.com/dashboard
2. Click **New** → **Blueprint**
3. Connect your GitHub repo
4. Click **Apply**
5. ✅ Done! Both services deploy automatically

### 3. Configure Frontend
After backend deploys:
1. Go to frontend service in Render dashboard
2. Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://YOUR-BACKEND-NAME.onrender.com`
3. Click **Save** (auto-redeploys)

### 4. Test
- Backend: `https://YOUR-BACKEND.onrender.com/health`
- Frontend: `https://YOUR-FRONTEND.onrender.com`

---

## 📋 Manual Deployment Steps

### Backend
```
Name: oa-backend
Environment: Docker
Root Directory: RA_backend
Plan: Starter (or Free)
```

### Frontend
```
Name: oa-frontend
Environment: Docker  
Root Directory: RA_frontend
Plan: Starter (or Free)

Environment Variable:
VITE_API_URL = https://oa-backend.onrender.com
```

---

## 🐛 Common Issues

**Backend build fails?**
- Check logs for PyTorch installation
- May take 10+ minutes on free tier
- Try increasing build timeout in settings

**Frontend can't connect?**
- Verify `VITE_API_URL` is set
- Must use `https://` not `http://`
- Check backend `/health` endpoint works

**Cold starts?**
- Free tier sleeps after 15 min
- First request takes 30-60 seconds
- Upgrade to Starter plan ($7/mo) to stay always-on

---

## 💡 Tips

- **Free Tier**: Good for testing, has cold starts
- **Starter Plan**: $14/mo total, always-on, recommended
- **Model loads in ~10-30 seconds** on first start
- **Monitor logs** in Render dashboard

---

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full documentation.
