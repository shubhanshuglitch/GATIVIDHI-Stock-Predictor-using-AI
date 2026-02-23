# 🚀 Production Deployment Checklist

Use this checklist to ensure smooth deployment to production.

## Pre-Deployment Checklist

### ✅ Code Preparation
- [ ] All code is committed to Git
- [ ] `.env` files are in `.gitignore`
- [ ] Frontend builds without errors (`npm run build`)
- [ ] Backend runs without errors (`npm start`)
- [ ] ML service runs without errors (`uvicorn app:app`)
- [ ] All tests pass (if you have tests)
- [ ] No sensitive data in code

### ✅ Environment Setup
- [ ] MongoDB Atlas account created
- [ ] MongoDB cluster created (M0 Free tier)
- [ ] Database user created with strong password
- [ ] Network access configured (0.0.0.0/0 or specific IPs)
- [ ] MongoDB connection string obtained
- [ ] GitHub account ready
- [ ] Render account created (or Railway/Heroku)
- [ ] Vercel account created

### ✅ Security
- [ ] Strong JWT secret generated (32+ characters)
- [ ] MongoDB password is strong
- [ ] No hardcoded secrets in code
- [ ] CORS configured properly
- [ ] Environment variables prepared

---

## Deployment Steps

### 1. Push to GitHub
- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub (`git push`)
- [ ] Repository is public or connected to deployment platforms

### 2. Deploy Database (MongoDB Atlas)
- [ ] Cluster running and accessible
- [ ] Connection string copied
- [ ] Database user has read/write permissions
- [ ] Test connection from local machine

### 3. Deploy ML Service
Platform: ________________ (Render/Railway/Heroku)

- [ ] Service created on platform
- [ ] GitHub repo connected
- [ ] Root directory set to `ml-service`
- [ ] Build command: `pip install -r requirements.txt`
- [ ] Start command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
- [ ] Environment variables set:
  - [ ] `PORT=8000`
  - [ ] `PYTHONUNBUFFERED=1`
- [ ] Service deployed successfully
- [ ] Health check passes: `https://your-ml-service.com/`
- [ ] **ML Service URL:** ________________________________

### 4. Deploy Backend
Platform: ________________ (Render/Railway/Heroku)

- [ ] Service created on platform
- [ ] GitHub repo connected
- [ ] Root directory set to `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Environment variables set:
  - [ ] `PORT=5000`
  - [ ] `NODE_ENV=production`
  - [ ] `MONGO_URI=mongodb+srv://...`
  - [ ] `JWT_SECRET=...` (strong random string)
  - [ ] `ML_SERVICE_URL=https://your-ml-service.com`
  - [ ] `FRONTEND_URL=https://your-frontend.com` (update after frontend)
- [ ] Service deployed successfully
- [ ] Health check passes: `https://your-backend.com/`
- [ ] **Backend URL:** ________________________________

### 5. Deploy Frontend
Platform: ________________ (Vercel/Netlify)

- [ ] Project imported from GitHub
- [ ] Root directory set to `frontend`
- [ ] Framework detected as Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variable set:
  - [ ] `VITE_API_URL=https://your-backend.com`
- [ ] Service deployed successfully
- [ ] Site loads correctly
- [ ] **Frontend URL:** ________________________________

### 6. Final Configuration
- [ ] Update backend `FRONTEND_URL` with actual frontend URL
- [ ] Backend redeployed with new FRONTEND_URL
- [ ] CORS working (test from frontend)

---

## Post-Deployment Testing

### Frontend Tests
- [ ] Website loads at your URL
- [ ] No console errors (F12 → Console)
- [ ] Registration works
- [ ] Login works
- [ ] Stock search works
- [ ] Stock data loads
- [ ] Predictions work (ARIMA)
- [ ] Predictions work (LSTM)
- [ ] Predictions work (Moving Averages)
- [ ] Predictions work (D&C Regression)
- [ ] Predictions work (Best Trade)
- [ ] Charts display correctly
- [ ] Logout works

### Backend Tests
Test these endpoints:
- [ ] `GET https://your-backend.com/` - Health check
- [ ] `POST /api/auth/register` - User registration
- [ ] `POST /api/auth/login` - User login
- [ ] `GET /api/stocks/AAPL` - Stock data (with auth)

### ML Service Tests
- [ ] `GET https://your-ml-service.com/` - Health check
- [ ] `GET /api/stock/search/apple` - Stock search
- [ ] `GET /api/stock/AAPL` - Stock data

### Database Tests
- [ ] Users are being created in MongoDB
- [ ] Stock data is being cached
- [ ] Check MongoDB Atlas → Collections

---

## Performance Optimization

### For Free Tier (Render)
- [ ] Set up UptimeRobot to prevent services from sleeping
- [ ] Monitor: https://uptimerobot.com
- [ ] Add monitor for ML service (ping every 14 min)
- [ ] Add monitor for backend (ping every 14 min)

### Caching
- [ ] Stock data caches for 1 hour (built-in)
- [ ] Consider adding Redis for better caching (optional)

---

## Monitoring Setup

### Uptime Monitoring
- [ ] UptimeRobot configured for all services
- [ ] Email alerts enabled
- [ ] Check interval set to 5-14 minutes

### Error Tracking (Optional)
- [ ] Sentry account created
- [ ] Sentry integrated in frontend
- [ ] Sentry integrated in backend

### Analytics (Optional)
- [ ] Vercel Analytics enabled
- [ ] Google Analytics added (optional)

---

## Security Verification

### SSL/HTTPS
- [ ] All services use HTTPS
- [ ] No mixed content warnings
- [ ] Certificates valid

### Environment Variables
- [ ] No secrets in code
- [ ] All secrets in platform environment variables
- [ ] `.env` files not committed to Git

### Access Control
- [ ] JWT authentication working
- [ ] Protected routes require authentication
- [ ] MongoDB has strong password
- [ ] API rate limiting enabled (optional)

---

## Documentation

- [ ] README updated with deployment info
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Known issues documented

---

## Backup & Recovery

- [ ] MongoDB automated backups enabled (Atlas feature)
- [ ] Environment variables backed up securely
- [ ] Code in GitHub (automatic backup)
- [ ] Deployment configuration saved

---

## URLs & Credentials (Keep Secure!)

| Service | URL | Notes |
|---------|-----|-------|
| **Frontend** | https://________________________ | Vercel/Netlify |
| **Backend** | https://________________________ | Render/Railway |
| **ML Service** | https://________________________ | Render/Railway |
| **MongoDB** | mongodb+srv://________________ | Atlas |
| **GitHub** | https://github.com/____________ | Repository |

### Credentials (Store Securely!)
```
MongoDB User: ________________
MongoDB Pass: ________________
JWT Secret:   ________________
```

⚠️ **Important:** Store credentials in a password manager, not in plain text!

---

## Troubleshooting Common Issues

### ❌ Frontend shows "Cannot connect to backend"
- [ ] Check VITE_API_URL is set correctly
- [ ] Verify backend is running
- [ ] Check browser console for errors

### ❌ Backend shows "MongoDB connection failed"
- [ ] Verify MONGO_URI is correct
- [ ] Check MongoDB Atlas IP whitelist
- [ ] Ensure database user has permissions

### ❌ "502 Bad Gateway" errors
- [ ] ML service might be sleeping (free tier)
- [ ] Check ML_SERVICE_URL in backend
- [ ] Wait 60 seconds for service to wake

### ❌ CORS errors
- [ ] Update backend FRONTEND_URL
- [ ] Redeploy backend after changing env vars
- [ ] Clear browser cache

---

## Maintenance Schedule

### Daily
- [ ] Check uptime monitors
- [ ] Review error logs

### Weekly
- [ ] Check MongoDB storage usage
- [ ] Review request patterns
- [ ] Check for security alerts

### Monthly
- [ ] Update npm packages (`npm audit`)
- [ ] Review MongoDB Atlas metrics
- [ ] Check service costs
- [ ] Rotate secrets (optional)

### Quarterly
- [ ] Full security audit
- [ ] Performance optimization review
- [ ] Update dependencies

---

## Success Criteria ✅

Your deployment is successful when:
- ✅ All services are online and responding
- ✅ Users can register and login
- ✅ Stock search and data loading works
- ✅ All prediction models work
- ✅ No console errors
- ✅ HTTPS enabled on all services
- ✅ Monitoring is set up
- ✅ Performance is acceptable

---

## Next Steps After Deployment

1. **Share your app** - Give the URL to users
2. **Monitor usage** - Check logs and metrics
3. **Gather feedback** - Improve based on user input
4. **Add features** - Continue development
5. **Optimize** - Improve performance over time

---

## 🎉 Deployment Complete!

**Your live app:** https://________________________________

**Admin Dashboard:**
- Render: https://dashboard.render.com
- Vercel: https://vercel.com/dashboard
- MongoDB: https://cloud.mongodb.com

---

**Date Deployed:** ________________  
**Version:** 1.0.0  
**Deployed By:** ________________
