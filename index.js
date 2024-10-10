require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Crypto = require('./models/Crypto');
const fetchCryptoData = require('./services/fetchCryptoData');
const connectDB = require('./db');
const cron = require('node-cron');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: 'http://localhost:3001', // Allow frontend origin
  }));
const PORT = process.env.PORT || 3000;
const COINGECKO_API_URL = process.env.COINGECKO_API_URL;
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;

connectDB();

cron.schedule('0 */2 * * *', () => {
  console.log('Fetching cryptocurrency data...');
  fetchCryptoData();
});

// API to get the latest cryptocurrency stats from CoinGecko
app.get('/stats', async (req, res) => {
  const { coin } = req.query;

  try {
    const { data } = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
      params: {
        ids: coin,
        vs_currency: 'usd',
      },
      headers: {
        'X-Cg-Pro-Api-Key': COINGECKO_API_KEY,
      },
    });
    
    if (!data) {
      return res.status(404).json({ message: "No data found" });
    }
    // Return the real-time data from CoinGecko
    res.json({
        price: data[0].current_price,
        marketCap: data[0].market_cap,
        "change24h": data[0].price_change_percentage_24h,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// API to get the standard deviation of the price
app.get('/deviation', async (req, res) => {
  const { coin } = req.query;

  try {
    console.log(`Calculating deviation for: ${coin}`);

    // Fetch the latest 100 prices for the requested coin from MongoDB (if 100 not available then all otherwise latest 100)
    const prices = await Crypto.find({ coin }).sort({ timestamp: -1 }).limit(100).select('price');

    if (prices.length === 0) {
      console.log(`No price data found for ${coin}`);
      return res.status(404).json({ message: "No data found" });
    }

    const priceValues = prices.map(p => p.price);
    const mean = priceValues.reduce((acc, curr) => acc + curr, 0) / priceValues.length;
    const variance = priceValues.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0) / priceValues.length;
    const stdDeviation = Math.sqrt(variance).toFixed(2);

    console.log(`Standard deviation for ${coin}: ${stdDeviation}`);

    res.json({ deviation: stdDeviation });
  } catch (error) {
    console.error(`Error calculating deviation for ${coin}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

