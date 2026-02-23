# 🚀 QUICK REFERENCE - Internet Deployment

## 📋 TL;DR - Deploy in 30 Minutes

### Step 1: MongoDB (5 min)
1. Go to https://mongodb.com/cloud/atlas → Sign up
2. Create M0 cluster (FREE)
3. Add database user
4. Allow all IPs (0.0.0.0/0)
5. Copy connection string

### Step 2: GitHub (5 min)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/stock-predictor.git
git push -u origin main
```

### Step 3: Deploy ML + Backend on Render (10 min)
1. https://render.com → Sign up
2. New Web Service → Connect GitHub
3. **ML Service:**
   - Root: `ml-service`
   - Start: `uvicorn app:app --host 0.0.0.0 --port $PORT`
4. **Backend:**
   - Root: `backend`
   - Start: `npm start`
   - Add env vars (see below)

### Step 4: Deploy Frontend on Vercel (5 min)
1. https://vercel.com → Sign up
2. Import from GitHub
3. Root: `frontend`
4. Add env: `VITE_API_URL=https://your-backend.onrender.com`

### Step 5: Update & Test (5 min)
1. Update backend `FRONTEND_URL` with Vercel URL
2. Test your app!

---

## 🔑 Environment Variables Quick Copy

### Backend (Render)
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/stockpredictor
JWT_SECRET=GENERATE-A-LONG-RANDOM-STRING-32-CHARS-MIN
ML_SERVICE_URL=https://stock-ml-service.onrender.com
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (Vercel)
```env
VITE_API_URL=https://stock-backend.onrender.com
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **QUICKSTART-DEPLOY.md** | 30-min deployment guide |
| **PRODUCTION.md** | Detailed production deployment |
| **DEPLOYMENT-CHECKLIST.md** | Step-by-step checklist |
| **ARCHITECTURE.md** | System architecture diagram |
| **SECURITY.md** | Security best practices |
| **DEPLOYMENT.md** | Local deployment (no Docker) |
| **TROUBLESHOOTING.md** | Fix common issues |

---

## 💰 Cost Options

**FREE:** $0/month (services sleep after 15 min)
**PAID:** $23/month (always on, production-ready)

---

## 🆘 Common Issues

**CORS Error?** → Update backend `FRONTEND_URL`
**502 Error?** → ML service sleeping (wait 60s)
**Can't connect DB?** → Check `MONGO_URI` and IP whitelist

---

## 📞 Support & Help

- Read docs above
- Check logs in Render/Vercel dashboards
- Verify all env variables are set correctly

---

**🎉 That's it! Your app is now on the internet!**
