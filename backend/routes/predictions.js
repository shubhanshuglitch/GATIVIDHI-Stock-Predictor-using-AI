const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');

const router = express.Router();
const ML_SERVICE = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// @route   GET /api/predictions/test-ml
// @desc    Test connection to ML Service
// @access  Private
router.get('/test-ml', auth, async (req, res) => {
  try {
    console.log(`Testing connection to: ${ML_SERVICE}`);
    const response = await axios.get(`${ML_SERVICE}/`, { timeout: 10000 });
    res.json({
      message: 'Connection successful',
      target: ML_SERVICE,
      data: response.data
    });
  } catch (error) {
    console.error('Connection test failed:', error.message);
    res.status(502).json({
      message: 'Connection test failed',
      target: ML_SERVICE,
      error: error.message
    });
  }
});

// @route   POST /api/predictions/arima
// @desc    Get ARIMA predictions
// @access  Private
router.post('/arima', auth, async (req, res) => {
  try {
    console.log(`Calling ARIMA on ML Service: ${ML_SERVICE}/api/predict/arima`);
    const response = await axios.post(`${ML_SERVICE}/api/predict/arima`, req.body, { timeout: 60000 });
    res.json(response.data);
  } catch (error) {
    console.error('ARIMA prediction error details:', {
      url: `${ML_SERVICE}/api/predict/arima`,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    res.status(error.response?.status || 500).json({ 
      message: 'Error generating ARIMA prediction',
      details: error.message,
      ml_service: ML_SERVICE
    });
  }
});

// @route   POST /api/predictions/lstm
// @desc    Get LSTM predictions
// @access  Private
router.post('/lstm', auth, async (req, res) => {
  try {
    console.log(`Calling LSTM on ML Service: ${ML_SERVICE}/api/predict/lstm`);
    const response = await axios.post(`${ML_SERVICE}/api/predict/lstm`, req.body, { timeout: 120000 });
    res.json(response.data);
  } catch (error) {
    console.error('LSTM prediction error details:', {
      url: `${ML_SERVICE}/api/predict/lstm`,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    res.status(error.response?.status || 500).json({ 
      message: 'Error generating LSTM prediction',
      details: error.message,
      ml_service: ML_SERVICE
    });
  }
});

// @route   POST /api/predictions/moving-avg
// @desc    Get moving averages
// @access  Private
router.post('/moving-avg', auth, async (req, res) => {
  try {
    console.log(`Calling Moving Avg on ML Service: ${ML_SERVICE}/api/algorithms/moving-avg`);
    const response = await axios.post(`${ML_SERVICE}/api/algorithms/moving-avg`, req.body, { timeout: 30000 });
    res.json(response.data);
  } catch (error) {
    console.error('Moving avg error details:', {
      url: `${ML_SERVICE}/api/algorithms/moving-avg`,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    res.status(error.response?.status || 500).json({ 
      message: 'Error computing moving averages',
      details: error.message,
      ml_service: ML_SERVICE
    });
  }
});

// @route   POST /api/predictions/regression
// @desc    Get D&C regression predictions
// @access  Private
router.post('/regression', auth, async (req, res) => {
  try {
    console.log(`Calling Regression on ML Service: ${ML_SERVICE}/api/algorithms/regression`);
    const response = await axios.post(`${ML_SERVICE}/api/algorithms/regression`, req.body, { timeout: 45000 });
    res.json(response.data);
  } catch (error) {
    console.error('Regression error details:', {
      url: `${ML_SERVICE}/api/algorithms/regression`,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    res.status(error.response?.status || 500).json({ 
      message: 'Error computing regression',
      details: error.message,
      ml_service: ML_SERVICE
    });
  }
});

// @route   POST /api/predictions/best-trade
// @desc    Get optimal buy/sell intervals
// @access  Private
router.post('/best-trade', auth, async (req, res) => {
  try {
    console.log(`Calling Best Trade on ML Service: ${ML_SERVICE}/api/algorithms/best-trade`);
    const response = await axios.post(`${ML_SERVICE}/api/algorithms/best-trade`, req.body, { timeout: 30000 });
    res.json(response.data);
  } catch (error) {
    console.error('Best trade error details:', {
      url: `${ML_SERVICE}/api/algorithms/best-trade`,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    res.status(error.response?.status || 500).json({ 
      message: 'Error computing best trades',
      details: error.message,
      ml_service: ML_SERVICE
    });
  }
});

// @route   POST /api/predictions/evaluate
// @desc    Compare all models
// @access  Private
router.post('/evaluate', auth, async (req, res) => {
  try {
    console.log(`Calling Evaluate on ML Service: ${ML_SERVICE}/api/evaluate`);
    const response = await axios.post(`${ML_SERVICE}/api/evaluate`, req.body, { timeout: 180000 });
    res.json(response.data);
  } catch (error) {
    console.error('Evaluate error details:', {
      url: `${ML_SERVICE}/api/evaluate`,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    res.status(error.response?.status || 500).json({ 
      message: 'Error evaluating models',
      details: error.message,
      ml_service: ML_SERVICE
    });
  }
});

module.exports = router;
