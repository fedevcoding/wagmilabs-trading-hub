const express = require("express");
require("dotenv").config();
const FreeTrials = require("../../../models/FreeTrials.js");
const { checkSignature } = require("../../../services/checkSignature.js");
const { execTranseposeAPI } = require("../../../services/externalAPI/transpose.js");

const freeTrialRoute = express();

freeTrialRoute.post("/", async (req, res) => {
  try {
    const { signature, address, message, fromCatchMint } = req?.body || {};

    if (address == undefined || address.length === 0 || signature == undefined || signature.length < 132) {
      return res.status(400).json({ message: "Failed to authenticate.", authenticated: false });
    }

    const validSignature = await checkSignature(address, signature, message);

    // check if user has at least 50 transactions
    const requiredTransactions = 25;
    const SQL = `SELECT * FROM ethereum.transactions WHERE from_address = '${address}' OR to_address = '${address}' LIMIT ${requiredTransactions}`;
    const result = await execTranseposeAPI(SQL);
    const hasEnoughTransactions = result.length >= requiredTransactions;

    if (validSignature && hasEnoughTransactions) {
      const sevenDaysInMilliseconds = 604800000;
      await FreeTrials.create({
        address,
        expiration: Date.now() + sevenDaysInMilliseconds,
        fromCatchMint,
      });
    } else if (!hasEnoughTransactions) {
      return res.status(400).json({
        message: `Insufficient transactions, you need to have at least ${requiredTransactions} transactions to get a free trial.`,
        authenticated: false,
      });
    } else {
      return res.status(400).json({ message: "Failed to authenticate.", authenticated: false });
    }

    res.status(200).json({ authenticated: true });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({
        authenticated: false,
        message: "You already have a free trial.",
      });
    }
    console.log(e);
    res.status(400).json({
      authenticated: false,
      message: "Something went wrong while trying to login.",
    });
  }
});
module.exports = freeTrialRoute;
