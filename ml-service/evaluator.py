"""
Model Evaluation Module
Computes RMSE, MAE, and R² score for comparing model performance.
"""

import numpy as np
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score


def compute_rmse(actual: np.ndarray, predicted: np.ndarray) -> float:
    """Compute Root Mean Squared Error."""
    return round(float(np.sqrt(mean_squared_error(actual, predicted))), 4)


def compute_mae(actual: np.ndarray, predicted: np.ndarray) -> float:
    """Compute Mean Absolute Error."""
    return round(float(mean_absolute_error(actual, predicted)), 4)


def compute_r2(actual: np.ndarray, predicted: np.ndarray) -> float:
    """Compute R² (coefficient of determination) score."""
    return round(float(r2_score(actual, predicted)), 4)


def compute_mape(actual: np.ndarray, predicted: np.ndarray) -> float:
    """Compute Mean Absolute Percentage Error."""
    mask = actual != 0
    return round(float(np.mean(np.abs((actual[mask] - predicted[mask]) / actual[mask])) * 100), 4)


def evaluate_model(actual: list | np.ndarray, predicted: list | np.ndarray, 
                   model_name: str = "Model") -> dict:
    """
    Evaluate a model's prediction performance.
    
    Args:
        actual: Actual values
        predicted: Predicted values
        model_name: Name of the model for labeling
    
    Returns:
        Dictionary with all metrics
    """
    actual = np.array(actual)
    predicted = np.array(predicted)
    
    # Ensure same length
    min_len = min(len(actual), len(predicted))
    actual = actual[:min_len]
    predicted = predicted[:min_len]
    
    return {
        'model': model_name,
        'rmse': compute_rmse(actual, predicted),
        'mae': compute_mae(actual, predicted),
        'r2': compute_r2(actual, predicted),
        'mape': compute_mape(actual, predicted),
        'num_samples': min_len
    }


def compare_models(evaluations: list) -> dict:
    """
    Compare multiple model evaluations and rank them.
    
    Args:
        evaluations: List of evaluation dictionaries from evaluate_model()
    
    Returns:
        Dictionary with comparison table and best model per metric
    """
    best = {
        'best_rmse': min(evaluations, key=lambda x: x['rmse']),
        'best_mae': min(evaluations, key=lambda x: x['mae']),
        'best_r2': max(evaluations, key=lambda x: x['r2']),
        'best_mape': min(evaluations, key=lambda x: x['mape']),
    }
    
    return {
        'models': evaluations,
        'best_rmse_model': best['best_rmse']['model'],
        'best_mae_model': best['best_mae']['model'],
        'best_r2_model': best['best_r2']['model'],
        'best_mape_model': best['best_mape']['model'],
        'recommendation': best['best_r2']['model']  # R² is best overall indicator
    }
