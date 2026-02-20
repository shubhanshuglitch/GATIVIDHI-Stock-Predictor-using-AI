"""
Divide and Conquer Regression
Segments data into smaller parts, fits linear regression on each segment,
and combines predictions for better accuracy on non-linear data.
"""

import numpy as np
from sklearn.linear_model import LinearRegression


def divide_and_conquer_regression(x: np.ndarray, y: np.ndarray, 
                                   min_segment_size: int = 30) -> dict:
    """
    Apply divide-and-conquer strategy to fit piecewise linear regression.
    
    Recursively splits data into segments until each segment is smaller
    than min_segment_size. Fits a separate linear regression on each segment.
    
    Args:
        x: Independent variable (e.g., day indices)
        y: Dependent variable (e.g., closing prices)
        min_segment_size: Minimum number of data points per segment
    
    Returns:
        Dictionary with predictions and segment information
    """
    segments = []
    predictions = np.zeros_like(y, dtype=float)
    
    def _divide_and_fit(start: int, end: int, depth: int = 0):
        """Recursively divide and fit regression models."""
        segment_size = end - start
        
        # Base case: segment is small enough, fit a single regression
        if segment_size <= min_segment_size or depth > 10:
            x_seg = x[start:end].reshape(-1, 1)
            y_seg = y[start:end]
            
            model = LinearRegression()
            model.fit(x_seg, y_seg)
            preds = model.predict(x_seg)
            
            predictions[start:end] = preds
            segments.append({
                'start': int(start),
                'end': int(end),
                'coefficient': float(model.coef_[0]),
                'intercept': float(model.intercept_),
                'r_squared': float(model.score(x_seg, y_seg)),
                'trend': 'UP' if model.coef_[0] > 0 else 'DOWN'
            })
            return
        
        # Divide: split at midpoint
        mid = (start + end) // 2
        _divide_and_fit(start, mid, depth + 1)
        _divide_and_fit(mid, end, depth + 1)
    
    _divide_and_fit(0, len(y))
    
    return {
        'predictions': predictions.tolist(),
        'segments': segments,
        'num_segments': len(segments)
    }


def predict_future_dc(x: np.ndarray, y: np.ndarray, 
                       forecast_days: int = 30,
                       lookback_segment: int = 60) -> dict:
    """
    Use the most recent segment's trend to forecast future values.
    
    Args:
        x: Day indices
        y: Historical closing prices
        forecast_days: Days to forecast into the future
        lookback_segment: How many recent days to use for the final segment
    
    Returns:
        Dictionary with future predictions and trend info
    """
    # Fit model on the most recent segment
    recent_x = x[-lookback_segment:].reshape(-1, 1)
    recent_y = y[-lookback_segment:]
    
    model = LinearRegression()
    model.fit(recent_x, recent_y)
    
    # Generate future x values
    last_x = x[-1]
    future_x = np.arange(last_x + 1, last_x + forecast_days + 1).reshape(-1, 1)
    future_predictions = model.predict(future_x)
    
    return {
        'future_predictions': future_predictions.tolist(),
        'trend_coefficient': float(model.coef_[0]),
        'trend_direction': 'UP' if model.coef_[0] > 0 else 'DOWN',
        'r_squared': float(model.score(recent_x, recent_y))
    }
