const ethers = require("ethers");

const INFURA_NETWORK_URL = process.env.ETHEREUM_NETWORK;

const provider = new ethers.providers.JsonRpcProvider(INFURA_NETWORK_URL);

const getProvider = () => provider;

module.exports = getProvider;
