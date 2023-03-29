const { ethers } = require("ethers");
require("dotenv").config();
const { contractAddress, abi } = require("../config/contractData");
const allowedAddresses = require("../config/allowedAddresses");
const { checkSignature } = require("../services/checkSignature");
const FreeTrials = require("../models/FreeTrials");

const SIGNER_PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY;
const CHAIN_ID = process.env.CHAIN_ID;

async function checkValid(address) {
  try {
    const isAllowed = allowedAddresses.find(allowedAddress => {
      return allowedAddress.toLowerCase() === address.toLowerCase();
    });

    if (isAllowed) {
      return true;
    } else if (!isAllowed) {
      const provider = new ethers.providers.InfuraProvider(CHAIN_ID == 5 ? "goerli" : "homestead", SIGNER_PRIVATE_KEY);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const passData = await contract.hasValidPass(address);

      const isValid = passData[0];
      const passType = Number(passData[1]);
      const expiration = Number(passData[2]);
      if (isValid) {
        return isValid;
      } else {
        const data = await FreeTrials.findOne({ address });

        if (!data) return false;

        const { expiration } = data;

        if (expiration < Date.now()) return false;
        return true;
      }
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

const checkOwnership = async (req, res, next) => {
  const { address, signature, message } = req.body;

  if (address == undefined || address.length === 0 || signature == undefined || signature.length < 132) {
    return res.status(400).json({ message: "Failed to authenticate.", authenticated: false });
  }

  const validSignature = await checkSignature(address, signature, message);

  if (validSignature) {
    const isValid = await checkValid(address);
    if (isValid) {
      next();
    } else {
      return res
        .status(400)
        .json({ message: "Seems you do not have a wagmi labs pass in your wallet", authenticated: false });
    }
  } else {
    return res.status(400).json({ message: "Failed to authenticate.", authenticated: false });
  }
};

module.exports = checkOwnership;
