"""
Data Collection Module
Fetches historical stock data from Yahoo Finance API using yfinance.
"""

import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta


def fetch_stock_data(ticker: str, period: str = "2y", interval: str = "1d") -> pd.DataFrame:
    """
    Fetch historical stock data for a given ticker symbol.
    
    Args:
        ticker: Stock ticker symbol (e.g., 'AAPL', 'GOOGL')
        period: Data period (e.g., '1y', '2y', '5y', 'max')
        interval: Data interval (e.g., '1d', '1wk', '1mo')
    
    Returns:
        DataFrame with columns: Date, Open, High, Low, Close, Volume
    """
    try:
        stock = yf.Ticker(ticker)
        df = stock.history(period=period, interval=interval)
        
        if df.empty:
            raise ValueError(f"No data found for ticker '{ticker}'")
        
        df = df.reset_index()
        df = df[['Date', 'Open', 'High', 'Low', 'Close', 'Volume']]
        df['Date'] = pd.to_datetime(df['Date']).dt.strftime('%Y-%m-%d')
        df = df.round(2)
        
        return df
    except Exception as e:
        raise ValueError(f"Error fetching data for '{ticker}': {str(e)}")


def fetch_stock_data_by_dates(ticker: str, start_date: str, end_date: str) -> pd.DataFrame:
    """
    Fetch historical stock data between specific dates.
    
    Args:
        ticker: Stock ticker symbol
        start_date: Start date in 'YYYY-MM-DD' format
        end_date: End date in 'YYYY-MM-DD' format
    
    Returns:
        DataFrame with OHLCV data
    """
    try:
        stock = yf.Ticker(ticker)
        df = stock.history(start=start_date, end=end_date)
        
        if df.empty:
            raise ValueError(f"No data found for ticker '{ticker}' in the given date range")
        
        df = df.reset_index()
        df = df[['Date', 'Open', 'High', 'Low', 'Close', 'Volume']]
        df['Date'] = pd.to_datetime(df['Date']).dt.strftime('%Y-%m-%d')
        df = df.round(2)
        
        return df
    except Exception as e:
        raise ValueError(f"Error fetching data: {str(e)}")


def get_stock_info(ticker: str) -> dict:
    """
    Get basic stock information.
    
    Args:
        ticker: Stock ticker symbol
    
    Returns:
        Dictionary with stock info (name, sector, market cap, etc.)
    """
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        return {
            "symbol": ticker.upper(),
            "name": info.get("longName", "N/A"),
            "sector": info.get("sector", "N/A"),
            "industry": info.get("industry", "N/A"),
            "marketCap": info.get("marketCap", 0),
            "currency": info.get("currency", "USD"),
            "exchange": info.get("exchange", "N/A"),
            "currentPrice": info.get("currentPrice", info.get("regularMarketPrice", 0)),
            "previousClose": info.get("previousClose", 0),
            "fiftyTwoWeekHigh": info.get("fiftyTwoWeekHigh", 0),
            "fiftyTwoWeekLow": info.get("fiftyTwoWeekLow", 0),
        }
    except Exception as e:
        raise ValueError(f"Error fetching info for '{ticker}': {str(e)}")
