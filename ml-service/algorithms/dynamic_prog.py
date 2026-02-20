"""
Dynamic Programming Algorithm
Optimizes buy/sell decisions to find maximum profit intervals.
Implements the classic "Best Time to Buy and Sell Stock" problem with at most k transactions.
"""

import numpy as np


def max_profit_single(prices: list) -> dict:
    """
    Find the maximum profit with a single buy/sell transaction.
    
    Uses Kadane's algorithm variant — O(n) time, O(1) space.
    
    Args:
        prices: List of daily stock prices
    
    Returns:
        Dictionary with max profit, buy index, sell index
    """
    if len(prices) < 2:
        return {'max_profit': 0, 'buy_index': -1, 'sell_index': -1, 'transactions': []}
    
    min_price = prices[0]
    min_index = 0
    max_profit = 0
    buy_idx = 0
    sell_idx = 0
    
    for i in range(1, len(prices)):
        if prices[i] - min_price > max_profit:
            max_profit = prices[i] - min_price
            buy_idx = min_index
            sell_idx = i
        
        if prices[i] < min_price:
            min_price = prices[i]
            min_index = i
    
    transactions = []
    if max_profit > 0:
        transactions.append({
            'buy_index': buy_idx,
            'buy_price': prices[buy_idx],
            'sell_index': sell_idx,
            'sell_price': prices[sell_idx],
            'profit': round(max_profit, 2)
        })
    
    return {
        'max_profit': round(max_profit, 2),
        'transactions': transactions
    }


def max_profit_unlimited(prices: list) -> dict:
    """
    Find maximum profit with unlimited transactions (no cooldown).
    
    Greedy approach: buy every valley, sell every peak — O(n).
    
    Args:
        prices: List of daily stock prices
    
    Returns:
        Dictionary with max profit and list of transactions
    """
    total_profit = 0
    transactions = []
    buy_idx = None
    
    for i in range(len(prices) - 1):
        if prices[i + 1] > prices[i]:
            if buy_idx is None:
                buy_idx = i
        else:
            if buy_idx is not None:
                profit = prices[i] - prices[buy_idx]
                transactions.append({
                    'buy_index': buy_idx,
                    'buy_price': prices[buy_idx],
                    'sell_index': i,
                    'sell_price': prices[i],
                    'profit': round(profit, 2)
                })
                total_profit += profit
                buy_idx = None
    
    # Handle case where price keeps going up until the end
    if buy_idx is not None:
        profit = prices[-1] - prices[buy_idx]
        transactions.append({
            'buy_index': buy_idx,
            'buy_price': prices[buy_idx],
            'sell_index': len(prices) - 1,
            'sell_price': prices[-1],
            'profit': round(profit, 2)
        })
        total_profit += profit
    
    return {
        'max_profit': round(total_profit, 2),
        'num_transactions': len(transactions),
        'transactions': transactions
    }


def max_profit_k_transactions(prices: list, k: int = 2) -> dict:
    """
    Find maximum profit with at most k transactions using Dynamic Programming.
    
    DP Table: dp[i][j] = max profit using at most i transactions up to day j
    Time: O(k * n), Space: O(k * n)
    
    Args:
        prices: List of daily stock prices
        k: Maximum number of transactions allowed
    
    Returns:
        Dictionary with max profit, transaction details
    """
    n = len(prices)
    if n < 2:
        return {'max_profit': 0, 'k': k, 'transactions': []}
    
    # If k >= n/2, unlimited transactions is optimal
    if k >= n // 2:
        return max_profit_unlimited(prices)
    
    # DP table
    dp = [[0] * n for _ in range(k + 1)]
    
    for i in range(1, k + 1):
        max_diff = -prices[0]
        for j in range(1, n):
            dp[i][j] = max(dp[i][j - 1], prices[j] + max_diff)
            max_diff = max(max_diff, dp[i - 1][j] - prices[j])
    
    max_profit = dp[k][n - 1]
    
    # Backtrack to find actual transactions
    transactions = _backtrack_transactions(dp, prices, k)
    
    return {
        'max_profit': round(max_profit, 2),
        'k': k,
        'num_transactions': len(transactions),
        'transactions': transactions
    }


def _backtrack_transactions(dp: list, prices: list, k: int) -> list:
    """Backtrack through the DP table to find the actual buy/sell points."""
    transactions = []
    n = len(prices)
    
    i, j = k, n - 1
    while i > 0 and j > 0:
        # Find where this transaction happened
        if dp[i][j] == dp[i][j - 1]:
            j -= 1
        else:
            # Found the sell point
            sell_idx = j
            sell_price = prices[j]
            
            # Find the buy point
            while j > 0:
                if dp[i][j] - dp[i - 1][j] != dp[i][sell_idx] - dp[i - 1][sell_idx]:
                    break
                if dp[i - 1][j - 1] - prices[j] == dp[i][sell_idx] - prices[sell_idx]:
                    break
                j -= 1
            
            buy_idx = j
            buy_price = prices[j]
            
            transactions.append({
                'buy_index': buy_idx,
                'buy_price': round(buy_price, 2),
                'sell_index': sell_idx,
                'sell_price': round(sell_price, 2),
                'profit': round(sell_price - buy_price, 2)
            })
            
            i -= 1
            j -= 1
    
    transactions.reverse()
    return transactions
