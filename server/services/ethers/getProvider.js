const ethers = require("ethers");

const SIGNER_PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY;

const provider = new ethers.providers.InfuraProvider("homestead", SIGNER_PRIVATE_KEY);

const getProvider = () => {
  return provider;
};

module.exports = getProvider;
