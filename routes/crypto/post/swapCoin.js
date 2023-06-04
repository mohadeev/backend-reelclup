import express from "express";
const swapCoin = express.Router();
import mongoose from "mongoose";
import abi from "./abi.js";
import { ethers } from "ethers";
import tokenSenderBNB from "./tokenSenderBNB.js";
import transactionHashChecker from "./transactionHashCheckerBNB.js";
import transactionModal from "../../../db/schema/transactionModal.js";
import transactionHashCheckerETHER from "./transactionHashCheckerETHER.js";
import transactionHashCheckerBNB from "./transactionHashCheckerBNB.js";
import axios from "axios";
import tokenPricesFunc from "./tokenPricesFunc.js";
import transactionChckerBySmrtContrct from "./transactionChckerBySmrtContrct.js";

const arrayTesters = async (hash) => [
  await transactionHashCheckerBNB(hash),
  await transactionHashCheckerETHER(hash),
  await transactionChckerBySmrtContrct(hash),
];
await transactionChckerBySmrtContrct("hash");

// console.log(
//   await arrayTesters(
//     "0x7efe592da5160a00e3c0b388572b3651acf17c4a15a49d960aba8ec4934bfa43"
//   )
// );
async function removeCollection(collectionName) {
  try {
    await mongoose.connection.db.dropCollection(collectionName);
    console.log(`Collection '${collectionName}' removed successfully.`);
  } catch (error) {
    console.error(`Error removing collection '${collectionName}':`, error);
  }
}

// Example usage
// transactionModal.find({}).then((all) => {
//   console.log(all);
//   transactionModal.deleteMany((data) => {
//     console.log("data:", data);
//   });
//   // removeCollection("transactionModal");
// });

swapCoin.post("/", async (req, res) => {
  const hash = req?.body?.hash;
  console.log(hash);
  const newArray = await arrayTesters(hash);
  console.log("newArray", newArray);
  if (hash) {
    const prices = await tokenPricesFunc();
    newArray.map((item) => {
      const itemprice = prices.find((coin) => coin?.symbol === item?.symbol);
      if (itemprice) {
        item.price = itemprice?.price;
      }
    });
    const filterOurTransacton = newArray.find(
      (Checker) => Checker?.message === "TRANSACION_WAS_SENT_TO_US"
    );
    if (filterOurTransacton?.message === "TRANSACION_WAS_SENT_TO_US") {
      await transactionModal
        .findOne({
          hash: hash,
        })
        .then(async (trns) => {
          if (trns?.hash) {
            console.log("we already send the transaction");
          } else {
            const data = await tokenSenderBNB(filterOurTransacton);
            const currentSentHash = data.transactionHash;
            console.log("data: currentSentHash", currentSentHash);
            if (currentSentHash) {
              transactionModal
                .create({
                  transactionFrom: filterOurTransacton?.transaction,
                  transactionTo: data,
                  hash: hash,
                  sendShash: currentSentHash,
                })
                .then((trnsData) => {
                  console.log("trnsData", trnsData);
                  res.json({ responsData: trnsData, error: false });
                });
            }
          }
        });
    } else {
      res.json({ message: "TRANSACTION-WAS-NOT-FINDED", error: true });
    }
  } else {
    res.json({ message: "INVALID-HASH", error: true });
  }
});

export default swapCoin;
