# Quick Deploy Guide - Stock Market Predictor

This is the **fastest way** to get your app online.

## 🎯 Quick Deploy (30 minutes)

### Prerequisites
- GitHub account
- Vercel account (sign up with GitHub)
- Render account (sign up with GitHub)
- MongoDB Atlas account (free)

---

## Step-by-Step Deployment

### 1️⃣ Setup MongoDB (5 min)

1. **Go to:** https://www.mongodb.com/cloud/atlas
2. **Sign up** for free
3. **Create new cluster** → Choose M0 (Free)
4. **Database Access** → Add user (username: `stockapp`, generate password)
5. **Network Access** → Allow access from anywhere (0.0.0.0/0)
6. **Connect** → Get connection string:
   ```
   mongodb+srv://stockapp:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/stockpredictor
   ```
7. **Save this URL** - you'll need it!

---

### 2️⃣ Push to GitHub (5 min)

```bash
# In your project directory
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub.com then run:
git remote add origin https://github.com/YOUR_USERNAME/stock-market-predictor.git
git branch -M main
git push -u origin main
```

---

### 3️⃣ Deploy Backend + ML Service on Render (10 min)

1. **Go to:** https://render.com → Sign up with GitHub

2. **Deploy ML Service:**
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repo
   - **Name:** `stock-ml-service`
   - **Root Directory:** `ml-service`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free
   - Click **"Create Web Service"**
   - **Copy the URL** (e.g., `https://stock-ml-service.onrender.com`)

3. **Deploy Backend:**
   - Click **"New +"** → **"Web Service"**
   - Same GitHub repo
   - **Name:** `stock-backend`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
   - **Environment Variables** → Add these:
     ```
     PORT=5000
     NODE_ENV=production
     MONGO_URI=mongodb+srv://stockapp:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/stockpredictor
     JWT_SECRET=your-super-secret-key-change-this-to-random-32-chars
     ML_SERVICE_URL=https://stock-ml-service.onrender.com
     FRONTEND_URL=https://your-app.vercel.app
     ```
   - Click **"Create Web Service"**
   - **Copy the URL** (e.g., `https://stock-backend.onrender.com`)

---

### 4️⃣ Deploy Frontend on Vercel (5 min)

1. **Go to:** https://vercel.com → Sign up with GitHub

2. **Deploy:**
   - Click **"Add New"** → **"Project"**
   - Import your GitHub repo
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
   - **Environment Variables:**
     ```
     VITE_API_URL=https://stock-backend.onrender.com
     ```
   - Click **"Deploy"**
   - **Copy the URL** (e.g., `https://stock-predictor.vercel.app`)

3. **Update Backend:**
   - Go back to Render → Backend service → Environment
   - Update `FRONTEND_URL` to your Vercel URL
   - Service will auto-redeploy

---

### 5️⃣ Test Your App (5 min)

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Register a new account
3. Search for a stock (e.g., AAPL, GOOGL, MSFT)
4. Try predictions!

---

## 🎉 You're Live!

**Your app is now deployed:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://stock-backend.onrender.com`
- ML Service: `https://stock-ml-service.onrender.com`

---

## ⚠️ Important Notes

### Free Tier Limitations
- **Render free services sleep after 15 min** of inactivity
- First request after sleep takes 30-60 seconds
- Set up uptime monitoring to keep services awake

### Keep Services Awake (Optional)
1. Go to https://uptimerobot.com (free)
2. Add monitors for your Render services
3. Set check interval to 14 minutes

---

## 💰 Costs

**Free Option:**
- Everything is FREE
- Services may be slow on first request
- Perfect for testing/demo

**Paid Option ($23/month):**
- Render Starter plan: $7/service × 2 = $14
- MongoDB M10: $9
- Vercel: Free
- **Total: $23/month**
- No sleep mode, faster, production-ready

---

## 🔧 Troubleshooting

### "Cannot connect to backend"
✓ Check `VITE_API_URL` in Vercel environment variables
✓ Make sure backend is deployed and running

### "502 Bad Gateway"
✓ ML Service might be sleeping (free tier)
✓ Wait 60 seconds for service to wake up
✓ Check ML_SERVICE_URL in backend environment

### "Database connection failed"
✓ Check MongoDB Atlas is running
✓ Verify MONGO_URI is correct
✓ Ensure IP whitelist includes 0.0.0.0/0

---

## 📚 More Help

- **Detailed Guide:** See [PRODUCTION.md](PRODUCTION.md)
- **Troubleshooting:** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Local Setup:** See [DEPLOYMENT.md](DEPLOYMENT.md)

---

**Need help?** Check the logs in Render/Vercel dashboards
