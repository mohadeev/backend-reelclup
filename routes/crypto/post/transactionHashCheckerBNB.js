import { ethers } from "ethers";
import transactionModal from "../../../db/schema/transactionModal.js";
import getReceiverAddress from "./transactionChckerBySmrtContrct.js";
import isValidTransactionHash from "../../../utils/isValidTransactionHash.js";
const provider = new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed1.ninicoin.io/"
);

// const transactionHash =
//   "0xef23e378834969d1fc88a41e04855fc497342318fadd700b995f629cc2b5ae8b";
const transactionTo = process.env.ACTIVE_WALLET;

const transactionHashCheckerBNB = async (hash) => {
  if (isValidTransactionHash(hash)) {
    try {
      const transaction = await provider.getTransaction(hash);
      console.log("bnb value here", transaction);
      if (!transaction) {
        return { message: "TRANSACTOIN-WAS-NOT-FINDED" };
      } else if (transaction) {
        if (
          transaction &&
          transaction?.to?.toLocaleLowerCase() ===
            transactionTo?.toLocaleLowerCase()
        ) {
          return {
            message: "TRANSACION_WAS_SENT_TO_US",
            transaction: transaction,
            symbol: "BNB",
          };
        } else {
          return { message: "TRANSACION_WAS_NOT_SENT_TO_US" };
        }
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  }
};

export default transactionHashCheckerBNB;
