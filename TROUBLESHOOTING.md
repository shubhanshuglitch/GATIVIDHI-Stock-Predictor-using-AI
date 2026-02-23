# 🔧 Troubleshooting Guide - Stock Market Predictor

## Quick Diagnostics

### Check if all services are running
```powershell
.\check-status.ps1
```

---

## Common Issues & Solutions

### ❌ Error 502 - Bad Gateway

**Symptoms:**
- "Error fetching stock data"
- Stock search doesn't work
- Predictions fail

**Causes & Solutions:**

#### 1. ML Service (Port 8000) is not running
```powershell
# Check if it's running
curl http://localhost:8000

# If it fails, start ML service
cd ml-service
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

#### 2. Backend can't connect to ML Service
Check `backend/.env`:
```env
ML_SERVICE_URL=http://localhost:8000
```
Should be `http://localhost:8000` NOT `http://ml-service:8000` (Docker URL)

#### 3. Services started in wrong order
**Correct Order:**
1. MongoDB (must be running first)
2. ML Service (port 8000)
3. Backend (port 5000) 
4. Frontend (port 5173)

**Solution:** Use the start script:
```powershell
.\start-all.ps1
```

---

### ❌ MongoDB Connection Failed

**Symptoms:**
- Backend crashes on startup
- "MongoNetworkError"
- "ECONNREFUSED 127.0.0.1:27017"

**Solutions:**

#### 1. MongoDB is not running
```powershell
# Check if MongoDB service exists
Get-Service MongoDB

# Start MongoDB service
Start-Service MongoDB

# Or start manually
mongod
```

#### 2. MongoDB not installed
Download and install from: https://www.mongodb.com/try/download/community

#### 3. Wrong connection string
Check `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017/stockpredictor
```

---

### ❌ Port Already in Use

**Symptoms:**
- "EADDRINUSE: address already in use"
- "Port 5000 is already in use"

**Solution: Find and kill the process**

```powershell
# Find process on port 5000
netstat -ano | findstr :5000

# Kill process (replace <PID> with actual process ID)
taskkill /PID <PID> /F

# Or use the stop-all script
.\stop-all.ps1
```

---

### ❌ Module Not Found / Import Error

**Symptoms:**
- "Cannot find module 'express'"
- "ModuleNotFoundError: No module named 'fastapi'"

**Solutions:**

#### Backend (Node.js)
```powershell
cd backend
rm -rf node_modules
npm install
```

#### Frontend (React)
```powershell
cd frontend
rm -rf node_modules
npm install
```

#### ML Service (Python)
```powershell
cd ml-service
pip install -r requirements.txt --force-reinstall
```

Or use the install script:
```powershell
.\install-deps.ps1
```

---

### ❌ Stock Data Not Loading

**Symptoms:**
- Search returns empty results
- "Stock ticker not found"
- API timeout errors

**Solutions:**

#### 1. Check ML Service logs
Look for yfinance errors in the ML service terminal

#### 2. Test stock search directly
```powershell
# Test ML service directly
curl http://localhost:8000/api/stock/search/apple
```

#### 3. Internet connection required
yfinance downloads data from Yahoo Finance - check internet connection

#### 4. Use valid ticker symbols
Try these known working tickers:
- US: AAPL, GOOGL, MSFT, TSLA, AMZN
- India: RELIANCE.NS, TCS.NS, INFY.NS

---

### ❌ Frontend Shows Blank Page

**Symptoms:**
- White screen
- "Cannot GET /"
- React errors in console

**Solutions:**

#### 1. Rebuild frontend
```powershell
cd frontend
npm run dev
```

#### 2. Clear browser cache
- Ctrl + Shift + R (hard refresh)
- Or clear browser cache completely

#### 3. Check console for errors
- Open DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

#### 4. Verify API URL
Check `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

---

### ❌ CORS Errors

**Symptoms:**
- "Access-Control-Allow-Origin" error
- API calls fail from browser
- Network tab shows CORS error

**Solution:**

Backend should have CORS enabled. Check `backend/server.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

---

### ❌ JWT Authentication Fails

**Symptoms:**
- "Unauthorized" errors
- Redirected to login constantly
- Token invalid errors

**Solutions:**

#### 1. Clear local storage
```javascript
// In browser console
localStorage.clear()
```

#### 2. Re-register/login
- Create a new account
- Login again

#### 3. Check JWT secret
Check `backend/.env`:
```env
JWT_SECRET=stockpredictorsecretkey2024
```

---

### ❌ Predictions Taking Too Long / Timeout

**Symptoms:**
- LSTM prediction hangs
- Request timeout after 30s
- No response from ML service

**Solutions:**

#### 1. Reduce epochs for LSTM
In the frontend, try fewer epochs (5 instead of 10)

#### 2. Use shorter time period
Use "6mo" or "1y" instead of "2y" or "5y"

#### 3. Increase timeout
In `backend/routes/stocks.js`, increase timeout:
```javascript
{ timeout: 60000 }  // 60 seconds
```

---

### ❌ Python Package Installation Fails

**Symptoms:**
- pip install fails
- PyTorch installation error
- Dependency conflicts

**Solutions:**

#### 1. Use virtual environment
```powershell
cd ml-service
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

#### 2. Install PyTorch separately
```powershell
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install -r requirements.txt
```

#### 3. Update pip
```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

---

## Service Restart Procedure

If things are really broken, restart everything in order:

```powershell
# 1. Stop all services
.\stop-all.ps1

# 2. Check status (should all be DOWN)
.\check-status.ps1

# 3. Start MongoDB (if not running as service)
mongod

# 4. Start all services
.\start-all.ps1

# 5. Verify status (should all be UP)
.\check-status.ps1
```

---

## Get Help

### Check Logs
Each service runs in its own terminal - check the output for errors

### Test Endpoints Manually

#### ML Service Health
```powershell
curl http://localhost:8000
# Should return: {"status":"healthy","service":"Stock Market Predictor ML Service"}
```

#### Backend Health
```powershell
curl http://localhost:5000
# Should return status and service info
```

#### MongoDB Connection
```powershell
cd backend
node test-db.js
```

---

## Prevention Tips

1. ✅ **Always start MongoDB first**
2. ✅ **Wait for each service to fully start before starting the next**
3. ✅ **Use the provided scripts** (`start-all.ps1`)
4. ✅ **Keep terminals open** to see error messages
5. ✅ **Check `.\check-status.ps1`** before using the app

---

**Still having issues?** Check the detailed deployment guide: [DEPLOYMENT.md](DEPLOYMENT.md)
