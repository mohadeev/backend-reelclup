import axios from "axios";
import express from "express";
const tokePrices = express.Router();

const tokenPricesFunc = async () => {
  const API_KEY = process.env.COINMARKETCAP_API_KEY;

  // Define the cryptocurrency symbols to get prices for
  const symbols = ["ETH", "BNB", "USDT"];

  // Define the CoinMarketCap API endpoint
  const endpoint = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbols.join(
    ","
  )}`;

  // Set the API request headers
  const headers = {
    "X-CMC_PRO_API_KEY": API_KEY,
  };

  // Make the API request using Axios
  try {
    const response = await axios.get(endpoint, { headers });
    // Extract the price data for each cryptocurrency
    const price = symbols.map((symbol) => {
      const quote = response.data.data[symbol].quote.USD;
      return { symbol, price: quote.price };
    });
    // console.log(price);
    return price;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default tokenPricesFunc;
