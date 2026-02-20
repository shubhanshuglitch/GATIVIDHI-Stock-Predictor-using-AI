const mongoose = require('mongoose');

const StockDataSchema = new mongoose.Schema({
  ticker: {
    type: String,
    required: true,
    uppercase: true,
    index: true
  },
  info: {
    name: String,
    sector: String,
    industry: String,
    marketCap: Number,
    currency: String,
    currentPrice: Number
  },
  data: [{
    date: String,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number
  }],
  predictions: {
    arima: {
      forecast: [Number],
      metrics: Object,
      updatedAt: Date
    },
    lstm: {
      forecast: [Number],
      metrics: Object,
      updatedAt: Date
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// TTL index: auto-delete after 24 hours to keep data fresh
StockDataSchema.index({ lastUpdated: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('StockData', StockDataSchema);
