import { ethers } from "ethers";
import isValidTransactionHash from "../../../utils/isValidTransactionHash.js";
const provider = new ethers.providers.InfuraProvider(
  "mainnet",
  "8ea65bb07c494d30bce16b7fd3fe4f3f"
);

// const transactionHash =
//   "0xe19beb8770d4ad9bd8fde33ef63c8f514c3125ce84ddb1523f20bffa33f066d1";
const transactionTo = process.env.ACTIVE_WALLET;

const transactionHashCheckerETHER = async (hash) => {
  if (isValidTransactionHash(hash)) {
    try {
      const transaction = await provider.getTransaction(hash);
      console.log("transaction this addreess ether", transaction?.from);
      console.log("transaction to", transaction?.to);

      if (!transaction) {
        return { message: "TRANSACTOIN-WAS-NOT-FINDED" };
      } else if (transaction) {
        if (
          transaction &&
          transaction?.to?.toLocaleLowerCase() ===
            transactionTo?.toLocaleLowerCase()
        ) {
          const newTransaction = {
            message: "TRANSACION_WAS_SENT_TO_US",
            transaction: transaction,
            symbol: "ETH",
          };
          console.log("transaction from ether");
          return newTransaction;
        } else {
          return { message: "TRANSACION_WAS_NOT_SENT_TO_US" };
        }
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  }
};

export default transactionHashCheckerETHER;
