# 📊 Deployment Architecture

## Production Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         🌐 INTERNET                             │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    🎨 FRONTEND (Vercel)                         │
│                   https://your-app.vercel.app                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • React.js + Vite                                       │  │
│  │  • Chart.js for visualizations                           │  │
│  │  • React Router for navigation                           │  │
│  │  • Deployed on Vercel CDN (global)                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                        HTTPS API calls
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   🔧 BACKEND (Render/Railway)                   │
│                 https://stock-backend.onrender.com              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • Node.js + Express                                     │  │
│  │  • JWT Authentication                                    │  │
│  │  • API Routing                                           │  │
│  │  • Caching Layer                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
           │                               │
           │ MongoDB                       │ ML Predictions
           │ Queries                       │ HTTPS calls
           │                               │
           ▼                               ▼
┌──────────────────────────┐  ┌──────────────────────────────────┐
│  💾 DATABASE             │  │  🤖 ML SERVICE                   │
│  (MongoDB Atlas)         │  │  (Render/Railway)                │
│                          │  │                                  │
│  • Users Collection      │  │  https://ml-service.onrender.com │
│  • Stock Data Cache      │  │                                  │
│  • Predictions History   │  │  • Python + FastAPI              │
│  • 512MB Free Tier       │  │  • ARIMA Model                   │
│  • Auto Backups          │  │  • LSTM Neural Network           │
│                          │  │  • yfinance Data Collector       │
└──────────────────────────┘  │  • Algorithms:                   │
                              │    - Sliding Window (SMA/EMA)    │
                              │    - D&C Regression              │
                              │    - DP Best Trade               │
                              └──────────────────────────────────┘
```

---

## Data Flow

### 1. User Searches for Stock
```
User → Frontend → Backend → ML Service → Yahoo Finance
                     ↓
                 MongoDB (cache)
                     ↓
                 Frontend (display)
```

### 2. User Requests Prediction
```
User (selects model) → Frontend → Backend → ML Service
                                              ↓
                                     Process with ML Model
                                              ↓
                                     Return predictions
                                              ↓
                                   Backend → Frontend
                                              ↓
                                     Display chart
```

### 3. User Authentication
```
User (login) → Frontend → Backend → MongoDB (verify)
                            ↓
                       Generate JWT
                            ↓
                   Frontend (store token)
                            ↓
              All future API calls include JWT
```

---

## Deployment Platforms

### Option 1: Free Tier (Recommended for Demo)

| Component | Platform | Cost | Performance |
|-----------|----------|------|-------------|
| Frontend | Vercel | $0 | ⭐⭐⭐⭐⭐ Fast (CDN) |
| Backend | Render Free | $0 | ⭐⭐⭐ (spins down) |
| ML Service | Render Free | $0 | ⭐⭐⭐ (spins down) |
| Database | MongoDB Atlas M0 | $0 | ⭐⭐⭐⭐ |

**Pros:**
- ✅ Completely free
- ✅ Easy to set up
- ✅ Good for learning/demo

**Cons:**
- ❌ Services sleep after 15 min
- ❌ First request is slow (30-60s)
- ❌ Limited resources

---

### Option 2: Production Tier (Recommended for Real Use)

| Component | Platform | Cost | Performance |
|-----------|----------|------|-------------|
| Frontend | Vercel Pro | $20 | ⭐⭐⭐⭐⭐ |
| Backend | Render Starter | $7 | ⭐⭐⭐⭐⭐ |
| ML Service | Render Starter | $7 | ⭐⭐⭐⭐⭐ |
| Database | MongoDB Atlas M10 | $9 | ⭐⭐⭐⭐⭐ |

**Total: ~$23-43/month**

**Pros:**
- ✅ Always on (no sleeping)
- ✅ Fast response times
- ✅ Better resources
- ✅ Production ready
- ✅ Auto-scaling

**Cons:**
- ❌ Costs money

---

### Option 3: All-in-One (Alternative)

| Platform | Services | Cost | Difficulty |
|----------|----------|------|------------|
| **Heroku** | All-in-one | ~$16/mo | Easy |
| **Railway** | All services | ~$15/mo | Easy |
| **DigitalOcean** | App Platform | ~$12/mo | Medium |
| **AWS** | Multiple services | Variable | Hard |

---

## Environment Variables by Service

### Frontend (Vercel)
```
VITE_API_URL=https://stock-backend.onrender.com
```

### Backend (Render)
```
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/stockpredictor
JWT_SECRET=super-secret-random-string-32-chars-minimum
ML_SERVICE_URL=https://stock-ml-service.onrender.com
FRONTEND_URL=https://your-app.vercel.app
```

### ML Service (Render)
```
PORT=8000
PYTHONUNBUFFERED=1
```

---

## Network Ports

| Service | Port | Protocol | Public |
|---------|------|----------|--------|
| Frontend | 80/443 | HTTPS | ✅ Yes |
| Backend | 5000 → 443 | HTTPS | ✅ Yes |
| ML Service | 8000 → 443 | HTTPS | ✅ Yes |
| MongoDB | 27017 | MongoDB | ❌ Internal |

---

## Security Layers

```
┌──────────────────────────────────────────┐
│  1. HTTPS/SSL (Automatic on platforms)  │
├──────────────────────────────────────────┤
│  2. JWT Token Authentication             │
├──────────────────────────────────────────┤
│  3. CORS (Cross-Origin Protection)       │
├──────────────────────────────────────────┤
│  4. MongoDB Authentication               │
├──────────────────────────────────────────┤
│  5. Environment Variables (Secrets)      │
├──────────────────────────────────────────┤
│  6. Rate Limiting (Optional)             │
└──────────────────────────────────────────┘
```

---

## Performance Optimization

### Caching Strategy
```
User Request
    ↓
Check MongoDB cache (1 hour)
    ↓
If cached → Return immediately
    ↓
If not → Fetch from Yahoo Finance
    ↓
Store in MongoDB
    ↓
Return to user
```

### CDN Distribution (Vercel)
```
Frontend deployed to global CDN
    ↓
User in India → Served from Asia edge
User in USA → Served from US edge
User in EU → Served from EU edge
    ↓
Fast load times worldwide
```

---

## Monitoring Setup

### Uptime Monitoring (UptimeRobot)
```
Monitor 1: Frontend (every 5 min)
Monitor 2: Backend (every 5 min)
Monitor 3: ML Service (every 5 min)
    ↓
If down → Send email alert
    ↓
For free tier: Ping every 14 min to prevent sleep
```

### Error Tracking (Optional - Sentry)
```
Frontend Error → Sentry Dashboard
Backend Error → Sentry Dashboard
    ↓
Get notified of crashes
Track bugs in real-time
```

---

## Scaling Strategy

### Vertical Scaling (Upgrade Resources)
```
Free Tier → Starter ($7/mo)
    ↓
More RAM, CPU, no sleeping
    ↓
Better for production
```

### Horizontal Scaling (Multiple Instances)
```
Backend → 2+ instances (load balanced)
ML Service → 2+ instances
    ↓
Handle more users
Better reliability
```

---

## Deployment Time Estimate

| Task | Time |
|------|------|
| MongoDB Atlas setup | 5 min |
| Push code to GitHub | 5 min |
| Deploy ML Service | 10 min |
| Deploy Backend | 10 min |
| Deploy Frontend | 5 min |
| Testing & fixes | 10-30 min |
| **Total** | **45-65 min** |

*First time might take longer - these are estimates for smooth deployment*

---

## Cost Comparison

### Monthly Costs

#### Free Option
```
Frontend:     $0
Backend:      $0
ML Service:   $0
Database:     $0
─────────────────
Total:        $0/month
```

#### Production Option
```
Frontend:     $20 (Vercel Pro) or $0 (Hobby)
Backend:      $7  (Render Starter)
ML Service:   $7  (Render Starter)
Database:     $9  (MongoDB M10)
─────────────────
Total:        $23-43/month
```

#### Enterprise Option
```
Frontend:     $20+ (Vercel Pro)
Backend:      $25+ (Render Pro)
ML Service:   $25+ (Render Pro)
Database:     $57+ (MongoDB M20)
Monitoring:   $10+ (Advanced tools)
─────────────────
Total:        $137+/month
```

---

## Backup & Recovery

### Automatic Backups
- ✅ Code: GitHub (automatic)
- ✅ Database: MongoDB Atlas (continuous)
- ✅ Deployments: Platform snapshots

### Manual Backups
- Environment variables (save securely)
- Configuration files (in Git)
- Database exports (monthly)

---

## Quick Links

### Development
- Local Frontend: http://localhost:5173
- Local Backend: http://localhost:5000
- Local ML Service: http://localhost:8000

### Production
- Frontend: https://your-app.vercel.app
- Backend: https://stock-backend.onrender.com
- ML Service: https://stock-ml-service.onrender.com
- Swagger Docs: https://stock-ml-service.onrender.com/docs

### Dashboards
- Render: https://dashboard.render.com
- Vercel: https://vercel.com/dashboard
- MongoDB: https://cloud.mongodb.com
- GitHub: https://github.com/your-username/stock-market-predictor

---

**Need help?** Check the deployment guides:
- [QUICKSTART-DEPLOY.md](QUICKSTART-DEPLOY.md) - Fast 30-min deployment
- [PRODUCTION.md](PRODUCTION.md) - Detailed production guide
- [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md) - Step-by-step checklist
