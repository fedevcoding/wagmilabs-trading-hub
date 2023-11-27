const { ethers } = require("ethers");
require("dotenv").config();
const { contractAddress, abi, osDropContractAddress } = require("../config/contractData");
const { allowedAddresses } = require("../config/allowedAddresses");
const { checkSignature } = require("../services/checkSignature");

const SIGNER_PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY;
const CHAIN_ID = process.env.CHAIN_ID;

const osDropExpiration = new Date("2023-09-28T00:00:00.000Z").getTime();

// passtypes: 0 = wagmi pass, 1 = basic sub, 2 = pro sub, 3 = free trial, 4 = allowed/partnership, 5 = free access, 6 email pro
async function checkValid(address) {
  try {
    let passType;
    let expiration;
    const provider = new ethers.providers.InfuraProvider(CHAIN_ID == 5 ? "goerli" : null, SIGNER_PRIVATE_KEY);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const contract2 = new ethers.Contract(osDropContractAddress, abi, provider);
    const passData = await contract.hasValidPass(address);
    const isValid = passData[0];
    if (isValid) {
      passType = Number(passData[1]);
      expiration = Number(passData[2]);
      return [passType, expiration];
    }
    const currentdate = Date.now();
    const isAllowed = allowedAddresses.find(allowedAddress => {
      return allowedAddress.address.toLowerCase() === address.toLowerCase() && allowedAddress.expiration > currentdate;
    });
    if (isAllowed) {
      const { expiration } = isAllowed;
      passType = 4;
      return [passType, expiration];
    }

    const isOsDrop = await contract2.balanceOf(address);
    if (isOsDrop > 0 && osDropExpiration > Date.now()) {
      passType = 4;
      return [passType, osDropExpiration];
    }

    // const addressInEmail = (await client.query(`SELECT * FROM mails WHERE address = '${address}'`)).rows[0];
    // if (addressInEmail) {
    //   const msAmount = 2592000000;

    //   const { timestamp } = addressInEmail;
    //   const expiration = parseInt(timestamp) + msAmount;
    //   if (expiration > Date.now()) {
    //     return [6, expiration];
    //   }
    // }

    passType = 5;
    expiration = 1998388898000;
    return [passType, expiration];
  } catch (err) {
    console.log(err);
    return [false, 0, 0];
  }
}

const checkOwnership = async (req, res, next) => {
  const { address, signature, message } = req.body;

  if (address == undefined || address.length === 0 || signature == undefined || signature.length < 132) {
    return res.status(400).json({ message: "Failed to authenticate.", authenticated: false });
  }

  const validSignature = await checkSignature(address, signature, message);

  if (validSignature) {
    const [passType, expiration] = await checkValid(address);

    // if (isValid) {
    req.ownershipData = { address, passType, expiration };
    next();
    // } else {
    // return res.status(400).json({ message: "Seems you do not have an active subscription.", authenticated: false });
    // }
  } else {
    return res.status(400).json({ message: "Failed to authenticate.", authenticated: false });
  }
};

module.exports = checkOwnership;
