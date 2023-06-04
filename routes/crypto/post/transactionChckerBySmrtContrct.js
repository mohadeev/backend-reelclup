import { ethers } from "ethers";
import USDTABI from "./USDTABI.js";
import isValidTransactionHash from "../../../utils/isValidTransactionHash.js";
const provider = new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed1.binance.org:443"
);

// const transactionHash =
//   "0xf431fd427a01ed142cfc58fd7954833a29902142f4e18dfcae92eeb78f9bb16f";
const transactionTo = process.env.ACTIVE_WALLET;

const transactionChckerBySmrtContrct = async (transactionHash) => {
  // console.log("value", transaction.value);
  if (isValidTransactionHash(transactionHash)) {
    const transaction = await provider.getTransaction(transactionHash);
    try {
      const receipt = await provider.getTransactionReceipt(transactionHash);
      // console.log("receipt", receipt);
      if (receipt && receipt?.logs?.length >= 1) {
        const transferEvent = receipt?.logs[0];
        // const contractAddress = transferEvent?.address;
        const topics = transferEvent.topics;
        const from = ethers.utils.getAddress("0x" + topics[1].slice(26));
        const to = ethers.utils.getAddress("0x" + topics[2].slice(26));
        const value = transferEvent?.data;
        const usdtBigNumber = ethers.BigNumber.from(value);
        transaction.value = usdtBigNumber;
        transaction.from = from;
        // console.log("value", transaction.value);
        // const usdtAmount = ethers.utils.formatUnits(usdtBigNumber, 18);
        if (to?.toLocaleLowerCase() === transactionTo?.toLocaleLowerCase()) {
          console.log("transaction sent to us ");
          return {
            message: "TRANSACION_WAS_SENT_TO_US",
            transaction: transaction,
            symbol: "USDT",
            to: from,
          };
        }
      } else {
        console.log("No token transfer event found in the logs.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
};

export default transactionChckerBySmrtContrct;
