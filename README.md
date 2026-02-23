# 🚀 GATIVIDHI — AI-Driven Stock Market Prediction System

An AI-powered system that analyzes historical stock prices, detects trends, and predicts future movements using ML models (ARIMA, LSTM) and algorithmic approaches (sliding window, divide-and-conquer regression, dynamic programming).

## 📦 Architecture

```
stock-market-predictor/
├── ml-service/       → Python FastAPI (ARIMA, LSTM, algorithms)
├── backend/          → Node.js Express (JWT auth, MongoDB, API proxy)
├── frontend/         → React.js Vite (Dashboard, Chart.js)
└── docker-compose.yml → Container orchestration
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, Vite, Chart.js, React Router |
| **Backend** | Node.js, Express.js, Mongoose |
| **ML Service** | Python, FastAPI, TensorFlow, statsmodels |
| **Database** | MongoDB (local / Atlas) |
| **Auth** | JWT (JSON Web Tokens) |
| **Deployment** | Docker, Docker Compose, Nginx |

## 🚀 Quick Start (Without Docker)

### Prerequisites
- **Node.js** 18+
- **Python** 3.9+
- **MongoDB** (running on localhost:27017)

### Easy Setup (Recommended)

```powershell
# 1. Install all dependencies
.\install-deps.ps1    # PowerShell
# or
install-deps.bat      # Command Prompt

# 2. Start all services
.\start-all.ps1       # PowerShell
# or
start-all.bat         # Command Prompt

# 3. Access the app at http://localhost:5173
```

### Manual Setup

#### 1. ML Service (Python)
```bash
cd ml-service
pip install -r requirements.txt
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
# → Running on http://localhost:8000
```

#### 2. Backend (Node.js)
```bash
cd backend
npm install
npm start
# → Running on http://localhost:5000
```

#### 3. Frontend (React)
```bash
cd frontend
npm install
npm run dev
# → Running on http://localhost:5173
```

### Helper Scripts
- `.\check-status.ps1` — Check if all services are running
- `.\stop-all.ps1` — Stop all running services

📖 **For detailed deployment instructions and troubleshooting, see [DEPLOYMENT.md](DEPLOYMENT.md)**

## 🐳 Docker Deployment (Alternative)

```bash
# Build and start all services
docker-compose up --build

# Services:
#   Frontend  → http://localhost:80
#   Backend   → http://localhost:5000
#   ML Service → http://localhost:8000
#   MongoDB   → localhost:27017
```

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT |
| GET | `/api/auth/me` | Get current user |

### Stocks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stocks/:ticker` | Historical stock data |

### Predictions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/predictions/arima` | ARIMA forecast |
| POST | `/api/predictions/lstm` | LSTM deep learning |
| POST | `/api/predictions/moving-avg` | Moving averages |
| POST | `/api/predictions/regression` | D&C regression |
| POST | `/api/predictions/best-trade` | DP optimal trades |
| POST | `/api/predictions/evaluate` | Compare all models |

## 📊 ML Models & Algorithms

| Model/Algorithm | Type | Description |
|----------------|------|-------------|
| **ARIMA** | Statistical | Linear time series (p=5, d=1, q=0) |
| **LSTM** | Deep Learning | 2-layer LSTM (50 units, TensorFlow) |
| **SMA/EMA** | Sliding Window | 5/10/20/50-day moving averages |
| **D&C Regression** | Divide & Conquer | Piecewise linear regression |
| **DP Best Trade** | Dynamic Programming | Optimal k-transaction profit |

## 📈 Evaluation Metrics
- **RMSE** — Root Mean Squared Error
- **MAE** — Mean Absolute Error
- **R²** — Coefficient of Determination
- **MAPE** — Mean Absolute Percentage Error

## 🌐 Production Deployment

Ready to deploy to the internet?

### Quick Deploy (30 minutes)
See **[QUICKSTART-DEPLOY.md](QUICKSTART-DEPLOY.md)** for fastest deployment

### Detailed Guides
- **[PRODUCTION.md](PRODUCTION.md)** - Complete production deployment guide
- **[DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md)** - Step-by-step checklist
- **[SECURITY.md](SECURITY.md)** - Security best practices

### Recommended Stack (Free Tier)
- **Database:** MongoDB Atlas (Free 512MB)
- **Backend + ML:** Render (Free tier)
- **Frontend:** Vercel (Free + CDN)

**Total Cost:** $0/month (or ~$23/month for production)

---

## 📄 License
MIT
