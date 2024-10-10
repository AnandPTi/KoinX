const axios = require('axios');
const Crypto = require('../models/Crypto');

const coins = ['bitcoin', 'matic-network', 'ethereum'];

const fetchCryptoData = async () => {
  try {
    for (const coin of coins) {
      const { data } = await axios.get(
        `${process.env.COINGECKO_API_URL}/coins/markets`, 
        { 
          params: { vs_currency: 'usd', ids: coin },
          headers: { 'X-Cg-Pro-Api-Key': process.env.COINGECKO_API_KEY } 
        }
      );

      const cryptoData = {
        coin,
        price: data[0].current_price,
        marketCap: data[0].market_cap,
        change24h: data[0].price_change_percentage_24h
      };

      await Crypto.create(cryptoData);
      console.log(`Stored data for ${coin}`);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

module.exports = fetchCryptoData;
