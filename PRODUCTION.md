# 🌐 Production Deployment Guide

Deploy your Stock Market Predictor to the internet using free/affordable cloud platforms.

## 📋 Table of Contents
- [Quick Deploy (Recommended)](#quick-deploy-recommended)
- [Architecture Overview](#architecture-overview)
- [Database Setup (MongoDB Atlas)](#1-database-setup-mongodb-atlas)
- [Deploy ML Service](#2-deploy-ml-service-python)
- [Deploy Backend](#3-deploy-backend-nodejs)
- [Deploy Frontend](#4-deploy-frontend-react)
- [Custom Domain Setup](#custom-domain-setup-optional)
- [Monitoring & Maintenance](#monitoring--maintenance)

---

## Quick Deploy (Recommended)

### 🎯 Recommended Platform Stack (All Free Tier)

| Service | Platform | Why |
|---------|----------|-----|
| **Database** | MongoDB Atlas | Free 512MB cluster |
| **ML Service** | Render | Free tier supports Python |
| **Backend** | Render | Free tier, auto-deploys |
| **Frontend** | Vercel | Free, CDN, auto-deploys |

**Total Cost:** $0/month (with limitations) or ~$20/month for production-ready

---

## Architecture Overview

```
Internet
    ↓
[Vercel: Frontend (React)]
    ↓ (API calls)
[Render: Backend (Node.js)] ←→ [MongoDB Atlas]
    ↓ (ML predictions)
[Render: ML Service (Python/FastAPI)]
```

---

## 1. Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free
3. Create a new cluster (M0 Sandbox - FREE)
4. Choose a cloud provider and region (closest to your users)

### Step 2: Configure Database Access
1. Go to **Database Access** → Add New Database User
   - Username: `stockapp`
   - Password: Generate a secure password
   - Permissions: Read and write to any database

### Step 3: Whitelist IP Addresses
1. Go to **Network Access** → Add IP Address
2. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ For production, restrict to your server IPs

### Step 4: Get Connection String
1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string:
   ```
   mongodb+srv://stockapp:<password>@cluster0.xxxxx.mongodb.net/stockpredictor?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password

✅ **Save this connection string - you'll need it for backend deployment**

---

## 2. Deploy ML Service (Python)

### Option A: Render (Recommended - Free Tier)

#### Step 1: Prepare for Deployment
Create `ml-service/render.yaml`:
```yaml
services:
  - type: web
    name: stock-ml-service
    runtime: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PYTHONUNBUFFERED
        value: 1
```

#### Step 2: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/stock-market-predictor.git
git push -u origin main
```

#### Step 3: Deploy on Render
1. Go to [render.com](https://render.com) → Sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `stock-ml-service`
   - **Root Directory:** `ml-service`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free
5. Click **"Create Web Service"**

#### Step 4: Get ML Service URL
- After deployment, copy your service URL:
  ```
  https://stock-ml-service.onrender.com
  ```

✅ **Save this URL - you'll need it for backend deployment**

⚠️ **Note:** Free tier services spin down after 15 minutes of inactivity. First request may be slow.

---

### Option B: Railway (Paid - Better Performance)

1. Go to [railway.app](https://railway.app)
2. Sign up and create new project
3. Click **"Deploy from GitHub"**
4. Select repository and set root directory: `ml-service`
5. Railway auto-detects Python and builds
6. Add environment variables:
   - `PORT`: 8000
   - `PYTHONUNBUFFERED`: 1
7. Get your URL: `https://stock-ml-service.up.railway.app`

**Cost:** ~$5-10/month

---

## 3. Deploy Backend (Node.js)

### Option A: Render (Recommended - Free Tier)

#### Step 1: Deploy on Render
1. On Render dashboard, click **"New +"** → **"Web Service"**
2. Connect same GitHub repository
3. Configure:
   - **Name:** `stock-backend`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

#### Step 2: Set Environment Variables
Click **"Environment"** and add:
```
PORT=5000
MONGO_URI=mongodb+srv://stockapp:yourpassword@cluster0.xxxxx.mongodb.net/stockpredictor
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
ML_SERVICE_URL=https://stock-ml-service.onrender.com
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

#### Step 3: Get Backend URL
- After deployment, copy your service URL:
  ```
  https://stock-backend.onrender.com
  ```

✅ **Save this URL - you'll need it for frontend deployment**

---

### Option B: Railway

1. Create new service in same Railway project
2. Select `backend` directory
3. Add environment variables (same as above)
4. Railway auto-deploys
5. Get URL: `https://stock-backend.up.railway.app`

---

## 4. Deploy Frontend (React)

### Option A: Vercel (Recommended - Free & Fast)

#### Step 1: Build Configuration
The `frontend/vite.config.js` is already configured correctly.

#### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) → Sign up
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

#### Step 3: Set Environment Variables
Add environment variable:
```
VITE_API_URL=https://stock-backend.onrender.com
```

#### Step 4: Deploy
Click **"Deploy"** - Vercel will build and deploy automatically

#### Step 5: Get Frontend URL
```
https://your-app.vercel.app
```

#### Step 6: Update Backend CORS
Go back to Render (backend) and update environment variable:
```
FRONTEND_URL=https://your-app.vercel.app
```

✅ **Your app is now live!**

---

### Option B: Netlify (Alternative to Vercel)

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `frontend/dist` folder (after running `npm run build`)
3. Or connect to GitHub for auto-deployments
4. Set environment variable: `VITE_API_URL`
5. Configure build:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`

---

### Option C: Render (All-in-One Platform)

Deploy frontend on same Render account:
1. New → Static Site
2. Connect repository
3. Root Directory: `frontend`
4. Build Command: `npm install && npm run build`
5. Publish Directory: `dist`

---

## Custom Domain Setup (Optional)

### For Frontend (Vercel)
1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `stockpredict.com`)
3. Update DNS records with your domain provider:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

### For Backend (Render)
1. Go to Service Settings → Custom Domain
2. Add domain (e.g., `api.stockpredict.com`)
3. Update DNS:
   ```
   Type: CNAME
   Name: api
   Value: your-service.onrender.com
   ```

---

## Security Checklist ✅

Before going live, ensure:

- [ ] **MongoDB Atlas** is using strong password
- [ ] **JWT_SECRET** is a long random string (not default)
- [ ] **CORS** is configured with your exact frontend URL
- [ ] **MongoDB Network Access** restricted to server IPs (optional)
- [ ] **Environment variables** are set correctly on all platforms
- [ ] **HTTPS** is enabled (automatic on Vercel/Render)
- [ ] **API rate limiting** is enabled (add if needed)

---

## Performance Optimization

### 1. Free Tier Limitations

**Render Free Tier:**
- Services spin down after 15 minutes of inactivity
- First request takes 30-60 seconds to wake up
- 750 hours/month limit

**Solutions:**
- Use uptime monitoring (UptimeRobot) to ping every 14 minutes
- Upgrade to paid tier ($7/month per service)
- Use Railway/Fly.io for better performance

### 2. Frontend Optimization

Already configured in `vite.config.js`:
```javascript
build: {
  outDir: 'dist',
  sourcemap: false,  // Disable for production
  minify: 'terser',   // Minify code
}
```

### 3. Backend Optimization

Add to `backend/server.js`:
```javascript
// Enable compression
const compression = require('compression');
app.use(compression());

// Cache control
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300');
  next();
});
```

---

## Monitoring & Maintenance

### 1. Uptime Monitoring

**UptimeRobot (Free)**
1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Add monitor for each service:
   - `https://stock-ml-service.onrender.com`
   - `https://stock-backend.onrender.com`
   - `https://your-app.vercel.app`
3. Set check interval: 5 minutes
4. Get alerts via email when services are down

### 2. Logs

**Render:** View logs in service dashboard
**Vercel:** View logs in deployment details
**MongoDB Atlas:** Monitor in Metrics tab

### 3. Error Tracking (Optional)

Use [Sentry](https://sentry.io) for error tracking:
```bash
npm install @sentry/react @sentry/node
```

---

## Environment Variables Summary

### ML Service (Render/Railway)
```env
PORT=8000
PYTHONUNBUFFERED=1
```

### Backend (Render/Railway)
```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/stockpredictor
JWT_SECRET=super-secret-random-string-min-32-chars
ML_SERVICE_URL=https://stock-ml-service.onrender.com
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (Vercel/Netlify)
```env
VITE_API_URL=https://stock-backend.onrender.com
```

---

## Deployment Checklist

- [ ] 1. Create MongoDB Atlas cluster
- [ ] 2. Get MongoDB connection string
- [ ] 3. Deploy ML Service to Render
- [ ] 4. Deploy Backend to Render (with all env vars)
- [ ] 5. Deploy Frontend to Vercel (with API URL)
- [ ] 6. Update backend FRONTEND_URL with Vercel URL
- [ ] 7. Test the application
- [ ] 8. Set up uptime monitoring
- [ ] 9. Configure custom domain (optional)
- [ ] 10. Set up SSL (automatic)

---

## Troubleshooting Production Issues

### Frontend can't connect to Backend (CORS Error)
✅ Update backend `FRONTEND_URL` environment variable with exact Vercel URL

### Backend can't connect to ML Service (502 Error)
✅ Verify `ML_SERVICE_URL` in backend environment variables
✅ Check ML service is running on Render

### Database connection failed
✅ Verify `MONGO_URI` is correct
✅ Check MongoDB Atlas IP whitelist includes 0.0.0.0/0

### Services are slow (Render free tier)
✅ Services spin down after inactivity
✅ Set up UptimeRobot to ping every 14 minutes
✅ Or upgrade to paid tier

---

## Alternative Platforms

### All-in-One Platforms
- **Heroku** (~$16/month) - Easy but paid
- **DigitalOcean App Platform** (~$12/month)
- **AWS Amplify** (pay-as-you-go)

### Serverless Options
- **Vercel** (Frontend + API Routes)
- **Netlify Functions** (Frontend + Serverless functions)
- **AWS Lambda** (Backend/ML as serverless)

### VPS Hosting (Advanced)
- **DigitalOcean Droplet** ($6/month) - Full control
- **Linode** ($5/month)
- **AWS EC2** (pay-as-you-go)

---

## Cost Breakdown

### Free Tier (All Free)
| Service | Platform | Cost |
|---------|----------|------|
| Database | MongoDB Atlas M0 | $0 |
| ML Service | Render Free | $0 |
| Backend | Render Free | $0 |
| Frontend | Vercel | $0 |
| **Total** | | **$0/month** |

⚠️ Limitations: Services spin down, slower performance

---

### Production Tier (Recommended)
| Service | Platform | Cost |
|---------|----------|------|
| Database | MongoDB Atlas M10 | $9 |
| ML Service | Render Starter | $7 |
| Backend | Render Starter | $7 |
| Frontend | Vercel Pro | $0-20 |
| **Total** | | **$23-43/month** |

✅ No spin down, better performance, scaling

---

## Need Help?

### Resources
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

### Support
- Check logs for errors
- Verify environment variables
- Test each service independently
- Check CORS configuration

---

**🎉 Congratulations! Your Stock Market Predictor is now live on the internet!**

Access your app at: `https://your-app.vercel.app`
