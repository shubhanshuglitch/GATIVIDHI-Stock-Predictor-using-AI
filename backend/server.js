const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stocks', require('./routes/stocks'));
app.use('/api/predictions', require('./routes/predictions'));

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Stock Market Predictor — API Server',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Stock Market Predictor API running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}`);
  console.log(`   Auth:   http://localhost:${PORT}/api/auth`);
  console.log(`   Stocks: http://localhost:${PORT}/api/stocks`);
  console.log(`   ML:     http://localhost:${PORT}/api/predictions\n`);
});
