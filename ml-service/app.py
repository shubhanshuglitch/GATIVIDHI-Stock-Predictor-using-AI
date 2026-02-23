"""
FastAPI Application — ML Microservice
Exposes stock data, predictions, algorithmic analysis, and model evaluation endpoints.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import numpy as np
import pandas as pd

from data_collector import fetch_stock_data, fetch_stock_data_by_dates, get_stock_info
from preprocessor import (
    handle_missing_values, add_features, normalize_data,
    split_data, create_sequences, preprocess_for_model
)
from models.arima_model import predict_arima
from models.lstm_model import train_lstm, predict_lstm, forecast_future
from algorithms.sliding_window import compute_all_moving_averages, detect_crossover_signals
from algorithms.divide_conquer import divide_and_conquer_regression, predict_future_dc
from algorithms.dynamic_prog import max_profit_single, max_profit_unlimited, max_profit_k_transactions
from evaluator import evaluate_model, compare_models

app = FastAPI(
    title="Stock Market Predictor — ML Service",
    description="AI-driven stock market prediction microservice",
    version="1.0.0"
)

# Logging
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Pydantic Models ──────────────────────────────────────────────────────────

class PredictionRequest(BaseModel):
    ticker: str
    period: str = "2y"
    forecast_days: int = 30

class ARIMARequest(PredictionRequest):
    order_p: int = 5
    order_d: int = 1
    order_q: int = 0

class LSTMRequest(PredictionRequest):
    epochs: int = 10
    batch_size: int = 32
    sequence_length: int = 60

class MovingAvgRequest(BaseModel):
    ticker: str
    period: str = "1y"

class RegressionRequest(BaseModel):
    ticker: str
    period: str = "1y"
    min_segment_size: int = 30
    forecast_days: int = 30

class TradeRequest(BaseModel):
    ticker: str
    period: str = "1y"
    max_transactions: int = 2

class EvaluateRequest(BaseModel):
    ticker: str
    period: str = "2y"


# ── Stock Data Endpoints ─────────────────────────────────────────────────────

@app.get("/api/stock/search/{query}")
async def search_stocks(query: str):
    """Search for stock tickers matching a query."""
    try:
        import yfinance as yf
        
        # Use yfinance search
        results = []
        try:
            search = yf.Search(query)
            quotes = search.quotes if hasattr(search, 'quotes') else []
            for q in quotes[:10]:
                results.append({
                    "symbol": q.get("symbol", ""),
                    "name": q.get("shortname") or q.get("longname", ""),
                    "exchange": q.get("exchange", ""),
                    "type": q.get("quoteType", ""),
                })
        except Exception:
            pass
        
        # If yfinance search didn't work, fall back to a curated list
        if not results:
            STOCK_LIST = [
                {"symbol": "RELIANCE.NS", "name": "Reliance Industries", "exchange": "NSE", "type": "EQUITY"},
                {"symbol": "TCS.NS", "name": "Tata Consultancy Services", "exchange": "NSE", "type": "EQUITY"},
                {"symbol": "INFY.NS", "name": "Infosys", "exchange": "NSE", "type": "EQUITY"},
                {"symbol": "HDFCBANK.NS", "name": "HDFC Bank", "exchange": "NSE", "type": "EQUITY"},
                {"symbol": "ITC.NS", "name": "ITC Limited", "exchange": "NSE", "type": "EQUITY"},
                {"symbol": "SBIN.NS", "name": "State Bank of India", "exchange": "NSE", "type": "EQUITY"},
                {"symbol": "BAJFINANCE.NS", "name": "Bajaj Finance", "exchange": "NSE", "type": "EQUITY"},
                {"symbol": "WIPRO.NS", "name": "Wipro", "exchange": "NSE", "type": "EQUITY"},
                {"symbol": "TATAMOTORS.NS", "name": "Tata Motors", "exchange": "NSE", "type": "EQUITY"},
                {"symbol": "ASIANPAINT.NS", "name": "Asian Paints", "exchange": "NSE", "type": "EQUITY"},
                {"symbol": "MARUTI.NS", "name": "Maruti Suzuki", "exchange": "NSE", "type": "EQUITY"},
                {"symbol": "HINDUNILVR.NS", "name": "Hindustan Unilever", "exchange": "NSE", "type": "EQUITY"},
                {"symbol": "KOTAKBANK.NS", "name": "Kotak Mahindra Bank", "exchange": "NSE", "type": "EQUITY"},
                {"symbol": "LT.NS", "name": "Larsen & Toubro", "exchange": "NSE", "type": "EQUITY"},
                {"symbol": "SUNPHARMA.NS", "name": "Sun Pharmaceutical", "exchange": "NSE", "type": "EQUITY"},
                {"symbol": "AAPL", "name": "Apple Inc.", "exchange": "NASDAQ", "type": "EQUITY"},
                {"symbol": "GOOGL", "name": "Alphabet Inc.", "exchange": "NASDAQ", "type": "EQUITY"},
                {"symbol": "MSFT", "name": "Microsoft Corporation", "exchange": "NASDAQ", "type": "EQUITY"},
                {"symbol": "TSLA", "name": "Tesla Inc.", "exchange": "NASDAQ", "type": "EQUITY"},
                {"symbol": "AMZN", "name": "Amazon.com Inc.", "exchange": "NASDAQ", "type": "EQUITY"},
            ]
            q_upper = query.upper()
            results = [s for s in STOCK_LIST if q_upper in s["symbol"].upper() or q_upper in s["name"].upper()][:10]
        
        return {"query": query, "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/stock/{ticker}")
async def get_stock_data(ticker: str, period: str = "1y"):
    """Fetch historical stock data."""
    try:
        df = fetch_stock_data(ticker, period)
        df_features = add_features(df.copy())
        
        return {
            "ticker": ticker.upper(),
            "period": period,
            "count": len(df),
            "data": df.to_dict(orient="records"),
            "features": df_features.to_dict(orient="records")
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.get("/api/stock/{ticker}/info")
async def get_info(ticker: str):
    """Get stock info (name, sector, market cap, etc.)."""
    try:
        info = get_stock_info(ticker)
        return info
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ── Prediction Endpoints ─────────────────────────────────────────────────────

@app.post("/api/predict/arima")
async def predict_with_arima(req: ARIMARequest):
    """Generate predictions using ARIMA model."""
    try:
        df = fetch_stock_data(req.ticker, req.period)
        prices = df['Close'].values
        
        result = predict_arima(
            prices,
            forecast_days=req.forecast_days,
            order=(req.order_p, req.order_d, req.order_q)
        )
        
        # Evaluate
        metrics = evaluate_model(
            result['test_actual'],
            result['test_predictions'],
            model_name="ARIMA"
        )
        
        return {
            "ticker": req.ticker.upper(),
            "model": "ARIMA",
            "order": [req.order_p, req.order_d, req.order_q],
            "dates": df['Date'].tolist(),
            "train_data": result['train_data'],
            "test_actual": result['test_actual'],
            "test_predictions": result['test_predictions'],
            "future_forecast": result['future_forecast'],
            "forecast_days": req.forecast_days,
            "metrics": metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/predict/lstm")
async def predict_with_lstm(req: LSTMRequest):
    """Generate predictions using LSTM deep learning model."""
    try:
        df = fetch_stock_data(req.ticker, req.period)
        prices = df['Close'].values
        
        # Preprocess
        processed = preprocess_for_model(
            df, column='Close',
            sequence_length=req.sequence_length
        )
        
        # Train LSTM
        model, history = train_lstm(
            processed['X_train'], processed['y_train'],
            processed['X_test'], processed['y_test'],
            epochs=req.epochs,
            batch_size=req.batch_size,
            sequence_length=req.sequence_length
        )
        
        # Predict on test set
        test_predictions = predict_lstm(model, processed['X_test'], processed['scaler'])
        
        # Actual test values
        test_actual = processed['scaler'].inverse_transform(
            processed['y_test'].reshape(-1, 1)
        ).flatten()
        
        # Forecast future
        last_seq = processed['normalized'][-req.sequence_length:].flatten()
        future = forecast_future(model, last_seq, processed['scaler'], req.forecast_days)
        
        # Evaluate
        metrics = evaluate_model(test_actual, test_predictions, model_name="LSTM")
        
        # Training history
        train_loss = [float(x) for x in history.history['loss']]
        val_loss = [float(x) for x in history.history['val_loss']]
        
        return {
            "ticker": req.ticker.upper(),
            "model": "LSTM",
            "dates": df['Date'].tolist(),
            "test_actual": test_actual.tolist(),
            "test_predictions": test_predictions.tolist(),
            "future_forecast": future,
            "forecast_days": req.forecast_days,
            "metrics": metrics,
            "training": {
                "epochs_trained": len(train_loss),
                "final_loss": train_loss[-1],
                "final_val_loss": val_loss[-1],
                "train_loss": train_loss,
                "val_loss": val_loss
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Algorithm Endpoints ──────────────────────────────────────────────────────

@app.post("/api/algorithms/moving-avg")
async def moving_averages(req: MovingAvgRequest):
    """Compute moving averages and crossover signals."""
    try:
        df = fetch_stock_data(req.ticker, req.period)
        prices = df['Close'].tolist()
        dates = df['Date'].tolist()
        
        averages = compute_all_moving_averages(prices)
        signals = detect_crossover_signals(prices)
        
        return {
            "ticker": req.ticker.upper(),
            "dates": dates,
            "prices": prices,
            "moving_averages": averages,
            "signals": signals
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/algorithms/regression")
async def dc_regression(req: RegressionRequest):
    """Divide-and-conquer piecewise regression."""
    try:
        df = fetch_stock_data(req.ticker, req.period)
        prices = df['Close'].values
        x = np.arange(len(prices))
        
        # D&C regression on historical data
        result = divide_and_conquer_regression(x, prices, req.min_segment_size)
        
        # Future forecast
        future = predict_future_dc(x, prices, req.forecast_days)
        
        # Evaluate D&C predictions
        metrics = evaluate_model(prices, result['predictions'], "D&C Regression")
        
        return {
            "ticker": req.ticker.upper(),
            "dates": df['Date'].tolist(),
            "actual_prices": prices.tolist(),
            "predictions": result['predictions'],
            "segments": result['segments'],
            "num_segments": result['num_segments'],
            "future_forecast": future['future_predictions'],
            "future_trend": future['trend_direction'],
            "metrics": metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/algorithms/best-trade")
async def best_trade(req: TradeRequest):
    """Find optimal buy/sell intervals using dynamic programming."""
    try:
        df = fetch_stock_data(req.ticker, req.period)
        prices = df['Close'].tolist()
        dates = df['Date'].tolist()
        
        # Single transaction
        single = max_profit_single(prices)
        
        # K transactions
        k_trans = max_profit_k_transactions(prices, req.max_transactions)
        
        # Unlimited transactions
        unlimited = max_profit_unlimited(prices)
        
        # Add dates to transactions
        for result in [single, k_trans, unlimited]:
            for t in result.get('transactions', []):
                if 'buy_index' in t and t['buy_index'] >= 0:
                    t['buy_date'] = dates[t['buy_index']]
                if 'sell_index' in t and t['sell_index'] >= 0:
                    t['sell_date'] = dates[t['sell_index']]
        
        return {
            "ticker": req.ticker.upper(),
            "dates": dates,
            "prices": prices,
            "single_transaction": single,
            "k_transactions": k_trans,
            "unlimited_transactions": unlimited
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Evaluation Endpoint ──────────────────────────────────────────────────────

@app.post("/api/evaluate")
async def evaluate_all(req: EvaluateRequest):
    """Compare all models on the same data."""
    try:
        df = fetch_stock_data(req.ticker, req.period)
        prices = df['Close'].values
        dates = df['Date'].tolist()
        evaluations = []
        
        # 1. ARIMA
        try:
            arima_result = predict_arima(prices, forecast_days=30)
            arima_metrics = evaluate_model(
                arima_result['test_actual'],
                arima_result['test_predictions'],
                "ARIMA"
            )
            evaluations.append(arima_metrics)
        except:
            pass
        
        # 2. D&C Regression
        try:
            x = np.arange(len(prices))
            dc_result = divide_and_conquer_regression(x, prices, 30)
            dc_metrics = evaluate_model(prices, dc_result['predictions'], "D&C Regression")
            evaluations.append(dc_metrics)
        except:
            pass
        
        # 3. LSTM
        try:
            processed = preprocess_for_model(df, column='Close', sequence_length=60)
            model, _ = train_lstm(
                processed['X_train'], processed['y_train'],
                processed['X_test'], processed['y_test'],
                epochs=5, batch_size=32, sequence_length=60
            )
            test_preds = predict_lstm(model, processed['X_test'], processed['scaler'])
            test_actual = processed['scaler'].inverse_transform(
                processed['y_test'].reshape(-1, 1)
            ).flatten()
            lstm_metrics = evaluate_model(test_actual, test_preds, "LSTM")
            evaluations.append(lstm_metrics)
        except:
            pass
        
        comparison = compare_models(evaluations) if evaluations else {"error": "No models could be evaluated"}
        
        return {
            "ticker": req.ticker.upper(),
            "comparison": comparison
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Health Check ──────────────────────────────────────────────────────────────

@app.get("/")
async def health_check():
    return {"status": "healthy", "service": "Stock Market Predictor ML Service"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
