const Web3 = require("web3");

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETHEREUM_NETWORK));

async function checkSignature(address, signature, message) {
  try {
    const signerAddress = await web3.eth.accounts.recover(message, signature);
    if (signerAddress.toLocaleLowerCase() === address.toLocaleLowerCase()) {
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}

module.exports = { checkSignature };
