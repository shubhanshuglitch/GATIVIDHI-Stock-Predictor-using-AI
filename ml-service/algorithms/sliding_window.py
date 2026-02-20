"""
Sliding Window Algorithm
Computes Simple Moving Average (SMA) and Exponential Moving Average (EMA)
for short-term trend detection.
"""

import numpy as np
import pandas as pd


def simple_moving_average(prices: list, window: int = 20) -> list:
    """
    Compute Simple Moving Average using sliding window.
    
    SMA = sum of prices in window / window size
    
    Args:
        prices: List of stock prices
        window: Window size (default: 20)
    
    Returns:
        List of SMA values (None for positions before window is filled)
    """
    if len(prices) < window:
        return [None] * len(prices)
    
    sma = []
    window_sum = sum(prices[:window])
    
    # Fill initial positions with None
    for i in range(window - 1):
        sma.append(None)
    
    # First SMA value
    sma.append(round(window_sum / window, 2))
    
    # Slide the window
    for i in range(window, len(prices)):
        window_sum = window_sum - prices[i - window] + prices[i]
        sma.append(round(window_sum / window, 2))
    
    return sma


def exponential_moving_average(prices: list, span: int = 20) -> list:
    """
    Compute Exponential Moving Average.
    
    EMA gives more weight to recent prices.
    Multiplier = 2 / (span + 1)
    
    Args:
        prices: List of stock prices
        span: EMA span period (default: 20)
    
    Returns:
        List of EMA values
    """
    if len(prices) == 0:
        return []
    
    multiplier = 2 / (span + 1)
    ema = [prices[0]]
    
    for i in range(1, len(prices)):
        new_ema = (prices[i] * multiplier) + (ema[-1] * (1 - multiplier))
        ema.append(round(new_ema, 2))
    
    return ema


def compute_all_moving_averages(prices: list) -> dict:
    """
    Compute moving averages for multiple window sizes.
    
    Windows: 5-day, 10-day, 20-day, 50-day
    
    Args:
        prices: List of stock closing prices
    
    Returns:
        Dictionary with SMA and EMA for each window size
    """
    windows = [5, 10, 20, 50]
    result = {}
    
    for w in windows:
        result[f'SMA_{w}'] = simple_moving_average(prices, w)
        result[f'EMA_{w}'] = exponential_moving_average(prices, w)
    
    return result


def detect_crossover_signals(prices: list, short_window: int = 10, 
                              long_window: int = 50) -> list:
    """
    Detect golden cross (bullish) and death cross (bearish) signals.
    
    Golden Cross: Short-term SMA crosses ABOVE long-term SMA → BUY signal
    Death Cross: Short-term SMA crosses BELOW long-term SMA → SELL signal
    
    Args:
        prices: List of stock prices
        short_window: Short-term SMA window
        long_window: Long-term SMA window
    
    Returns:
        List of signal dictionaries with index, type, and price
    """
    short_sma = simple_moving_average(prices, short_window)
    long_sma = simple_moving_average(prices, long_window)
    
    signals = []
    
    for i in range(1, len(prices)):
        if short_sma[i] is None or long_sma[i] is None or \
           short_sma[i-1] is None or long_sma[i-1] is None:
            continue
        
        # Golden Cross (bullish)
        if short_sma[i-1] <= long_sma[i-1] and short_sma[i] > long_sma[i]:
            signals.append({
                'index': i,
                'type': 'BUY',
                'price': prices[i],
                'description': f'Golden Cross: SMA{short_window} crossed above SMA{long_window}'
            })
        
        # Death Cross (bearish)
        elif short_sma[i-1] >= long_sma[i-1] and short_sma[i] < long_sma[i]:
            signals.append({
                'index': i,
                'type': 'SELL',
                'price': prices[i],
                'description': f'Death Cross: SMA{short_window} crossed below SMA{long_window}'
            })
    
    return signals
