const { wait } = require("../../utils/utils");
const getCoinsGasData = require("../../websockets/coinsGasData");

let ethData = {};

const getEthGasData = () => {
  return ethData;
};

async function getGasData() {
  try {
    let currentEthData = await getCoinsGasData();
    ethData = currentEthData;
    await wait(10000);
    getGasData();
  } catch (e) {
    console.log(e);
  }
}

module.exports = { getEthGasData, getGasData };
