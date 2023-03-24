const parseEther = (value, stringity) => {
  value = value?.toString();
  if (!value) return 0;

  if (stringity) {
    return ethers.utils.parseEther(value).toString();
  } else {
    return ethers.utils.parseEther(value);
  }
};
module.exports = parseEther;
