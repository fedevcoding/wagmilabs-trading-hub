const { ethers } = require("ethers");

const parseEther = (value, stringify) => {
  value = value?.toString();
  if (!value) return 0;

  if (stringify) {
    return ethers.utils.formatEther(value);
  } else {
    return parseFloat(ethers.utils.parseEther(value));
  }
};
module.exports = parseEther;
