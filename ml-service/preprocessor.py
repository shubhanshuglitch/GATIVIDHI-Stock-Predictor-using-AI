"""
Data Preprocessing Module
Handles missing values, normalization, feature engineering, and train/test splitting.
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler


def handle_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    """Fill missing values using forward-fill then backward-fill."""
    df = df.copy()
    df = df.ffill().bfill()
    return df


def normalize_data(data: np.ndarray) -> tuple:
    """
    Normalize data using MinMaxScaler to [0, 1] range.
    
    Returns:
        (normalized_data, scaler) — scaler is needed for inverse transform
    """
    scaler = MinMaxScaler(feature_range=(0, 1))
    normalized = scaler.fit_transform(data.reshape(-1, 1))
    return normalized, scaler


def add_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Feature engineering: add technical indicators and derived features.
    
    Features added:
        - Daily Return (%)
        - Volatility (20-day rolling std)
        - Price Range (High - Low)
        - Price Ratio (Close / Open)
        - SMA_10, SMA_20 (Simple Moving Averages)
        - EMA_10 (Exponential Moving Average)
        - RSI_14 (Relative Strength Index)
    """
    df = df.copy()
    
    # Daily return
    df['Daily_Return'] = df['Close'].pct_change() * 100
    
    # Volatility (20-day rolling standard deviation of returns)
    df['Volatility'] = df['Daily_Return'].rolling(window=20).std()
    
    # Price range
    df['Price_Range'] = df['High'] - df['Low']
    
    # Price ratio
    df['Price_Ratio'] = df['Close'] / df['Open']
    
    # Simple Moving Averages
    df['SMA_10'] = df['Close'].rolling(window=10).mean()
    df['SMA_20'] = df['Close'].rolling(window=20).mean()
    
    # Exponential Moving Average
    df['EMA_10'] = df['Close'].ewm(span=10, adjust=False).mean()
    
    # RSI (Relative Strength Index) - 14 day
    delta = df['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / loss
    df['RSI_14'] = 100 - (100 / (1 + rs))
    
    # Fill NaN values created by rolling operations
    df = df.bfill().ffill()
    
    return df


def split_data(data: np.ndarray, train_ratio: float = 0.8) -> tuple:
    """
    Split data into training and testing sets.
    
    Args:
        data: Input data array
        train_ratio: Ratio of training data (default: 0.8)
    
    Returns:
        (train_data, test_data)
    """
    split_index = int(len(data) * train_ratio)
    train = data[:split_index]
    test = data[split_index:]
    return train, test


def create_sequences(data: np.ndarray, sequence_length: int = 60) -> tuple:
    """
    Create sequences for LSTM model.
    
    Args:
        data: Normalized data array
        sequence_length: Number of time steps to look back (default: 60)
    
    Returns:
        (X, y) where X has shape (samples, sequence_length, 1) and y has shape (samples,)
    """
    X, y = [], []
    for i in range(sequence_length, len(data)):
        X.append(data[i - sequence_length:i, 0])
        y.append(data[i, 0])
    
    X = np.array(X)
    y = np.array(y)
    X = np.reshape(X, (X.shape[0], X.shape[1], 1))
    
    return X, y


def preprocess_for_model(df: pd.DataFrame, column: str = 'Close', 
                         sequence_length: int = 60, train_ratio: float = 0.8) -> dict:
    """
    Full preprocessing pipeline for ML models.
    
    Args:
        df: Raw stock data DataFrame
        column: Target column for prediction
        sequence_length: Lookback window for LSTM
        train_ratio: Train/test split ratio
    
    Returns:
        Dictionary with all preprocessed data components
    """
    # Handle missing values
    df = handle_missing_values(df)
    
    # Extract target column
    values = df[column].values
    
    # Normalize
    normalized, scaler = normalize_data(values)
    
    # Split
    train_size = int(len(normalized) * train_ratio)
    train_data = normalized[:train_size]
    test_data = normalized[train_size - sequence_length:]  # Include lookback for test sequences
    
    # Create sequences
    X_train, y_train = create_sequences(train_data, sequence_length)
    X_test, y_test = create_sequences(test_data, sequence_length)
    
    return {
        'X_train': X_train,
        'y_train': y_train,
        'X_test': X_test,
        'y_test': y_test,
        'scaler': scaler,
        'train_size': train_size,
        'raw_values': values,
        'normalized': normalized
    }
