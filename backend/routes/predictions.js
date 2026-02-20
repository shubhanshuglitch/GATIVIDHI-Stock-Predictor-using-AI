const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');

const router = express.Router();
const ML_SERVICE = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// @route   POST /api/predictions/arima
// @desc    Get ARIMA predictions
// @access  Private
router.post('/arima', auth, async (req, res) => {
  try {
    const response = await axios.post(`${ML_SERVICE}/api/predict/arima`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('ARIMA prediction error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ message: error.response?.data?.detail || error.message || 'Error generating ARIMA prediction' });
  }
});

// @route   POST /api/predictions/lstm
// @desc    Get LSTM predictions
// @access  Private
router.post('/lstm', auth, async (req, res) => {
  try {
    const response = await axios.post(`${ML_SERVICE}/api/predict/lstm`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('LSTM prediction error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ message: error.response?.data?.detail || error.message || 'Error generating LSTM prediction' });
  }
});

// @route   POST /api/predictions/moving-avg
// @desc    Get moving averages
// @access  Private
router.post('/moving-avg', auth, async (req, res) => {
  try {
    const response = await axios.post(`${ML_SERVICE}/api/algorithms/moving-avg`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Moving avg error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ message: error.response?.data?.detail || error.message || 'Error computing moving averages' });
  }
});

// @route   POST /api/predictions/regression
// @desc    Get D&C regression predictions
// @access  Private
router.post('/regression', auth, async (req, res) => {
  try {
    const response = await axios.post(`${ML_SERVICE}/api/algorithms/regression`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Regression error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ message: error.response?.data?.detail || error.message || 'Error computing regression' });
  }
});

// @route   POST /api/predictions/best-trade
// @desc    Get optimal buy/sell intervals
// @access  Private
router.post('/best-trade', auth, async (req, res) => {
  try {
    const response = await axios.post(`${ML_SERVICE}/api/algorithms/best-trade`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Best trade error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ message: error.response?.data?.detail || error.message || 'Error computing best trades' });
  }
});

// @route   POST /api/predictions/evaluate
// @desc    Compare all models
// @access  Private
router.post('/evaluate', auth, async (req, res) => {
  try {
    const response = await axios.post(`${ML_SERVICE}/api/evaluate`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Evaluate error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ message: error.response?.data?.detail || error.message || 'Error evaluating models' });
  }
});

module.exports = router;
