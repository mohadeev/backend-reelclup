import axios from "axios";
import express from "express";
const tokePrices = express.Router();
import Web3 from "web3";
import { ethers } from "ethers";
import gasFee from "./gasFee.js";
// const url = "https://mainnet.infura.io/v3/8ea65bb07c494d30bce16b7fd3fe4f3f";
// var web3 = new Web3(url);

// web3.eth.getGasPrice().then((result) => {
//   // console.log(web3.utils.fromWei(result, "ether"));
//   // const gasPrice = await web3.eth.getGasPrice();
//   const gasPriceWei = web3.utils.toBN(result);
//   const gasPriceEther = web3.utils.fromWei(gasPriceWei, "ether");
//   const gasPriceUSD = parseFloat(gasPriceEther) * 1659.62;
//   console.log(gasPriceUSD, "gasPriceEther");
// });
// console.log(await gasFee());

tokePrices.get("/", async (req, res) => {
  const API_KEY = process.env.COINMARKETCAP_API_KEY;

  // Define the cryptocurrency symbols to get prices for
  const symbols = [
    {
      id: "122239483894vh98",
      symbol: "BNB",
      mainValue: "BNB",
      chain: 56,
      img: "/images/bnb-icon.jpg",
      smartContract: false,
    },
    {
      id: "7654K830SDN2LK3",
      symbol: "USDT",
      mainValue: "BEP20",
      chain: 56,
    },
    // {
    //   id: "2988VH89AA0203V",
    //   symbol: "BTC",
    //   img: "/images/Bitcoin.svg.png",
    // },
    {
      id: "290392NZX.12903X",
      symbol: "ETH",
      chain: 1,
      mainValue: "ETH",
      img: "/images/124-1245793_ethereum-eth-icon-ethereum-png-transparent-png.png",
      smartContract: false,
    },
    // {
    //   id: "K830SDdfghN2LK3",
    //   symbol: "USDT",
    //   mainValue: "ERC20",
    //   chain: 1,
    // },
    // {
    //   id: "34903MSDSK32LK3",
    //   chain: 56,
    //   img: "/images/Solana_logo.png",
    //   symbol: "SOL",
    //   mainValue: "SOL",
    //   smartContract: true,
    // },
  ];
  const mainPrice = symbols.map(({ symbol }) => symbol);
  console.log(mainPrice);
  const endpoint = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${mainPrice.join(
    ","
  )}`;

  const headers = {
    "X-CMC_PRO_API_KEY": API_KEY,
  };

  axios
    .get(endpoint, { headers })
    .then((response) => {
      // Extract the price data for each cryptocurrency
      const data = response.data.data;
      const prices = symbols.map(({ symbol, mainValue }) => {
        let quote = 0;
        quote = data[symbol].quote.USD;
        return { symbol, price: quote.price, mainValue };
      });
      res.json({ responseData: prices, error: false });
    })
    .catch((error) => {
      console.error(error);
    });
});

export default tokePrices;
