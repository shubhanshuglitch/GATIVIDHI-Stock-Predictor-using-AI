const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const StockData = require('../models/StockData');

const router = express.Router();
const ML_SERVICE = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// @route   GET /api/stocks/search/:query
// @desc    Search for stock tickers
// @access  Private
router.get('/search/:query', auth, async (req, res) => {
  try {
    const { query } = req.params;
    const response = await axios.get(`${ML_SERVICE}/api/stock/search/${encodeURIComponent(query)}`, { timeout: 15000 });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ message: 'Error searching stocks' });
  }
});

// @route   GET /api/stocks/:ticker
// @desc    Get historical stock data (cached in MongoDB)
// @access  Private
router.get('/:ticker', auth, async (req, res) => {
  try {
    const { ticker } = req.params;
    const { period = '1y' } = req.query;

    // Check cache (data less than 1 hour old)
    const cached = await StockData.findOne({
      ticker: ticker.toUpperCase(),
      lastUpdated: { $gte: new Date(Date.now() - 3600000) }
    });

    if (cached) {
      return res.json({
        ticker: cached.ticker,
        info: cached.info,
        data: cached.data,
        source: 'cache',
        lastUpdated: cached.lastUpdated
      });
    }

    // Fetch from ML service
    const [dataRes, infoRes] = await Promise.all([
      axios.get(`${ML_SERVICE}/api/stock/${ticker}?period=${period}`, { timeout: 20000 }),
      axios.get(`${ML_SERVICE}/api/stock/${ticker}/info`, { timeout: 15000 }).catch(() => ({ data: {} }))
    ]);

    // Transform data for MongoDB
    const stockRecords = dataRes.data.data.map(item => ({
      date: item.Date,
      open: item.Open,
      high: item.High,
      low: item.Low,
      close: item.Close,
      volume: item.Volume
    }));

    // Upsert in MongoDB
    await StockData.findOneAndUpdate(
      { ticker: ticker.toUpperCase() },
      {
        ticker: ticker.toUpperCase(),
        info: infoRes.data,
        data: stockRecords,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({
      ticker: ticker.toUpperCase(),
      info: infoRes.data,
      data: stockRecords,
      features: dataRes.data.features,
      source: 'api',
      count: stockRecords.length
    });
  } catch (error) {
    console.error('Stock fetch error:', error.message);
    if (error.response?.status === 404) {
      return res.status(404).json({ message: `Stock ticker '${req.params.ticker}' not found` });
    }
    res.status(500).json({ message: 'Error fetching stock data' });
  }
});

// @route   GET /api/stocks/:ticker/info
// @desc    Get stock info
// @access  Private
router.get('/:ticker/info', auth, async (req, res) => {
  try {
    const { ticker } = req.params;
    const response = await axios.get(`${ML_SERVICE}/api/stock/${ticker}/info`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stock info' });
  }
});

module.exports = router;
