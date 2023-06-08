import express from "express";
import User from "../../../db/schema/userModal.js";
import channelModal from "../../../db/schema/channel.js";
const swapCoin = express.Router();
import abi from "./abi.js";
import { ethers } from "ethers";
import transferJ from "./tokenSenderBNB.js";
import transactionHashCheckerBNB from "./transactionHashCheckerBNB.js";
import transactionModal from "../../../db/schema/transactionModal.js";
import userModal from "../../../db/schema/userModal.js";

const privateKey = process.env.WALLET_PRIVTE_KEY;

// Use the Binance Smart Chain RPC URL and chain ID
const provider = new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed1.binance.org/",
  {
    chainId: 56,
  }
);

const wallet = new ethers.Wallet(privateKey, provider);
const tokenAbi = JSON.parse(abi);
const tokenAddress = "0x2f8A45dE29bbfBB0EE802B340B4f91af492C6DE7"; // Replace with your token address
const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, wallet);

// const recipientAddress = "0xfCB3D10d8017a15675be61Db1d106e0b4ea32cFb";
const gasPrice = await provider.getGasPrice();

async function tokenSenderBNB(filterOurTransacton) {
  const recipientAddress = filterOurTransacton.transaction.from;
  const nimbaPrice = process.env.NIMBAPIRICE;
  const value = filterOurTransacton.transaction.value;
  const valuepared = ethers.utils.formatEther(value._hex);
  console.log("valuepared", valuepared);
  const coinPrice = filterOurTransacton.price;
  const transactionPrice = valuepared * coinPrice * 100;
  const nimbaValue = transactionPrice / nimbaPrice;
  // console.log("Reelclup", nimbaValue);
  const nimbaUSend = Math.round(nimbaValue);
  const amountToSend = ethers.utils.parseUnits(String(nimbaUSend), 18);
  const gasLimit = await tokenContract.estimateGas.transfer(
    recipientAddress,
    amountToSend
  );
  try {
    const tx = await tokenContract.transfer(recipientAddress, amountToSend, {
      gasLimit: gasLimit,
      gasPrice: gasPrice,
    });
    const receipt = await tx.wait();
    // console.log(receipt.transactionHash);
    return receipt;
  } catch (error) {
    console.log("Error sending tokens:", error.message);
    return { error: error };
  }
}

export default tokenSenderBNB;
