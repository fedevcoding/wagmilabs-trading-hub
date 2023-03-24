const { ethers } = require("ethers");

const parseEther = (value, stringify) => {
  value = value?.toString();
  if (!value) return 0;

  if (stringify) {
    ethers.utils.parseEther;
    return ethers.utils.parseEther(value).toString();
  } else {
    return Number(ethers.utils.parseEther(value));
  }
};
module.exports = parseEther;
