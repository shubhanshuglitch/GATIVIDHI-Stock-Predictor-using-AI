# 🚀 Stock Market Predictor - Manual Deployment Guide (Without Docker)

## Prerequisites

Before you begin, ensure you have the following installed:

### 1. **Node.js & npm**
- Download and install from [nodejs.org](https://nodejs.org/)
- Recommended version: Node.js 18+ or 20+
- Verify installation:
  ```powershell
  node --version
  npm --version
  ```

### 2. **Python**
- Download and install from [python.org](https://www.python.org/)
- Recommended version: Python 3.9, 3.10, or 3.11
- Verify installation:
  ```powershell
  python --version
  pip --version
  ```

### 3. **MongoDB**
- Download and install from [mongodb.com](https://www.mongodb.com/try/download/community)
- Or install using chocolatey: `choco install mongodb`
- MongoDB should be running on `mongodb://localhost:27017`

---

## 📦 Installation Steps

### Step 1: Install Backend Dependencies

```powershell
cd backend
npm install
```

### Step 2: Install Frontend Dependencies

```powershell
cd frontend
npm install
```

### Step 3: Install ML Service Dependencies

```powershell
cd ml-service
pip install -r requirements.txt
```

> **Note:** PyTorch installation might take some time. If you face issues, install manually:
> ```powershell
> pip install torch --index-url https://download.pytorch.org/whl/cpu
> ```

---

## ⚙️ Configuration

### Environment Files

The project already has `.env` files configured:

**backend/.env**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/stockpredictor
JWT_SECRET=stockpredictorsecretkey2024
ML_SERVICE_URL=http://localhost:8000
```

**frontend/.env**
```env
VITE_API_URL=http://localhost:5000
```

**ml-service/.env**
```env
PORT=8000
PYTHONUNBUFFERED=1
```

> ⚠️ **Important:** Make sure MongoDB is running before starting the backend!

---

## 🏃 Running the Application

### Option 1: Use the Start Scripts (Recommended)

#### Windows PowerShell:
```powershell
.\start-all.ps1
```

#### Windows Command Prompt:
```cmd
start-all.bat
```

This will start all three services in separate terminal windows.

---

### Option 2: Start Services Manually

Open **4 separate terminal windows** and run:

#### Terminal 1 - MongoDB (if not running as service)
```powershell
mongod
```

#### Terminal 2 - ML Service
```powershell
cd ml-service
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Wait until you see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

#### Terminal 3 - Backend
```powershell
cd backend
npm start
```

Wait until you see:
```
🚀 Stock Market Predictor API running on port 5000
```

#### Terminal 4 - Frontend
```powershell
cd frontend
npm run dev
```

Wait until you see:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

## 🌐 Access the Application

Once all services are running:

- **Frontend (React App):** http://localhost:5173
- **Backend API:** http://localhost:5000
- **ML Service API:** http://localhost:8000
- **API Docs (Swagger):** http://localhost:8000/docs

---

## 🔧 Troubleshooting 502 Errors

### Problem: "Error fetching stock data" or 502 Bad Gateway

#### Solution 1: Check Service URLs
Make sure all services are running on the correct ports:
- ML Service: http://localhost:8000
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

#### Solution 2: Verify ML Service is Running
```powershell
# Test ML service health
curl http://localhost:8000
# Should return: {"status":"healthy","service":"Stock Market Predictor ML Service"}
```

#### Solution 3: Verify Backend Connection to ML Service
```powershell
# Test backend health
curl http://localhost:5000
# Should return backend status
```

#### Solution 4: Check MongoDB Connection
```powershell
# Test MongoDB connection
cd backend
node test-db.js
```

#### Solution 5: Check Firewall/Antivirus
Make sure your firewall isn't blocking ports 5000, 5173, or 8000.

#### Solution 6: Clear Browser Cache
- Hard refresh: Ctrl + Shift + R
- Or clear browser cache and cookies

---

## 🛠️ Common Issues

### Issue: "Module not found"
**Solution:** Reinstall dependencies
```powershell
# Backend
cd backend
rm -rf node_modules
npm install

# Frontend
cd frontend
rm -rf node_modules
npm install

# ML Service
cd ml-service
pip install -r requirements.txt --force-reinstall
```

### Issue: "MongoDB connection failed"
**Solution:** 
1. Check if MongoDB is running:
   ```powershell
   # Windows
   Get-Service MongoDB
   # Or start manually
   mongod
   ```

2. Verify connection string in `backend/.env`:
   ```env
   MONGO_URI=mongodb://localhost:27017/stockpredictor
   ```

### Issue: "Port already in use"
**Solution:** Kill processes on the ports
```powershell
# Find process on port 5000
netstat -ano | findstr :5000
# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F

# For port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# For port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Issue: Python package installation fails
**Solution:** Use a virtual environment
```powershell
cd ml-service
python -m venv venv
.\venv\Scripts\Activate.ps1  # PowerShell
# or
.\venv\Scripts\activate.bat  # CMD
pip install -r requirements.txt
```

---

## 📊 Testing the Application

### 1. Register a New User
- Go to http://localhost:5173
- Click "Register"
- Create an account

### 2. Search for Stocks
- Login with your credentials
- Search for stocks like: AAPL, GOOGL, MSFT, TSLA
- Or Indian stocks: RELIANCE.NS, TCS.NS, INFY.NS

### 3. View Predictions
- Select a stock
- Click on different prediction models (ARIMA, LSTM)
- View charts and metrics

---

## 🔄 Production Deployment

### Build Frontend for Production
```powershell
cd frontend
npm run build
```

This creates a `dist` folder with optimized static files.

### Serve Frontend with Node.js
```powershell
npm install -g serve
serve -s dist -l 3000
```

Or use any static file server (nginx, Apache, IIS, etc.)

### Run Backend in Production
```powershell
cd backend
set NODE_ENV=production
npm start
```

### Run ML Service in Production
```powershell
cd ml-service
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## 🎯 Quick Service Status Check

Run this in PowerShell to check if all services are up:

```powershell
# Check ML Service
curl http://localhost:8000 2>$null; if($?) { Write-Host "✅ ML Service is UP" } else { Write-Host "❌ ML Service is DOWN" }

# Check Backend
curl http://localhost:5000 2>$null; if($?) { Write-Host "✅ Backend is UP" } else { Write-Host "❌ Backend is DOWN" }

# Check MongoDB
Test-NetConnection -ComputerName localhost -Port 27017 | Select-Object TcpTestSucceeded
```

---

## 📞 Support

If you encounter any issues:
1. Check all services are running
2. Verify environment variables are set correctly
3. Check firewall settings
4. Review logs in each terminal window
5. Make sure MongoDB is running

---

**Happy Trading! 📈**
