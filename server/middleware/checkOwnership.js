const Web3 = require("web3");
const { ethers } = require("ethers");
require("dotenv").config();
const { contractAddress, abi } = require("../config/contractData");
const allowedAddresses = require("../config/allowedAddresses");

const SIGNER_PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY;
const CHAIN_ID = process.env.CHAIN_ID;

async function checkValid(address) {
  try {
    const isAllowed = allowedAddresses.find(allowedAddress => {
      return allowedAddress.toLowerCase() === address.toLowerCase();
    });

    if (isAllowed) {
      return true;
    } else {
      const provider = new ethers.providers.InfuraProvider(CHAIN_ID == 5 ? "goerli" : "homestead", SIGNER_PRIVATE_KEY);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const isValid = await contract.hasValidPass(address);
      return isValid;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

const checkOwnership = async (req, res, next) => {
  const { address, signature, message } = req.body;

  const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETHEREUM_NETWORK));

  if (address == undefined || address.length === 0 || signature == undefined || signature.length < 132) {
    return res.status(400).json({ message: "Failed to authenticate.", authenticated: false });
  }

  const signerAddress = await web3.eth.accounts.recover(message, signature);

  if (signerAddress.toLocaleLowerCase() === address.toLocaleLowerCase()) {
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
