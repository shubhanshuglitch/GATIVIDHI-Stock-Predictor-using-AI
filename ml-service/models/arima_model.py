"""
ARIMA Model Implementation
Captures linear time series dependencies using Auto-Regressive Integrated Moving Average.
"""

import numpy as np
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
import warnings

warnings.filterwarnings('ignore')


def train_arima(data: np.ndarray, order: tuple = (5, 1, 0)) -> object:
    """
    Train an ARIMA model on the given data.
    
    Args:
        data: 1D array of historical prices
        order: ARIMA(p, d, q) parameters
    
    Returns:
        Fitted ARIMA model
    """
    model = ARIMA(data, order=order)
    fitted_model = model.fit()
    return fitted_model


def predict_arima(data: np.ndarray, forecast_days: int = 30, 
                  order: tuple = (5, 1, 0), train_ratio: float = 0.8) -> dict:
    """
    Train ARIMA and generate predictions.
    
    Args:
        data: 1D array of historical closing prices
        forecast_days: Number of future days to forecast
        order: ARIMA(p, d, q) parameters
        train_ratio: Ratio for train/test split
    
    Returns:
        Dictionary with train predictions, test predictions, and future forecast
    """
    # Split data
    split_index = int(len(data) * train_ratio)
    train_data = data[:split_index]
    test_data = data[split_index:]
    
    # Train model
    model = train_arima(train_data, order)
    
    # Predict on test set (in-sample + out-of-sample)
    test_predictions = []
    history = list(train_data)
    
    for i in range(len(test_data)):
        m = ARIMA(history, order=order)
        fitted = m.fit()
        forecast = fitted.forecast(steps=1)
        test_predictions.append(float(forecast[0]))
        history.append(test_data[i])
    
    test_predictions = np.array(test_predictions)
    
    # Forecast future values
    full_model = train_arima(data, order)
    future_forecast = full_model.forecast(steps=forecast_days)
    
    return {
        'train_data': train_data.tolist(),
        'test_actual': test_data.tolist(),
        'test_predictions': test_predictions.tolist(),
        'future_forecast': future_forecast.tolist(),
        'model_summary': str(full_model.summary()),
        'order': list(order)
    }
