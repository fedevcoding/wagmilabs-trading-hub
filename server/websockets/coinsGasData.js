const getCoinsGasData = async () => {
  try {
    const options = {
      headers: { Authorization: "517ae0f1-4beb-42a9-bc42-0175bfb7412e" },
    };

    let data = await fetch(
      "https://api.blocknative.com/gasprices/blockprices?confidenceLevels=50&confidenceLevels=80&confidenceLevels=90&confidenceLevels=70&confidenceLevels=99",
      options
    );
    data = await data.json();

    let ethPrice = await fetch("https://api.coinbase.com/v2/prices/ETH-USD/spot");
    let usdcPrice = await fetch("https://api.coinbase.com/v2/prices/USDC-USD/spot");
    let usdtPrice = await fetch("https://api.coinbase.com/v2/prices/USDT-USD/spot");
    ethPrice = Math.round((await ethPrice.json()).data?.amount);
    usdcPrice = (await usdcPrice.json()).data?.amount;
    usdtPrice = (await usdtPrice.json()).data?.amount;

    const blockPrices = data.blockPrices[0];
    const instantGas = blockPrices?.estimatedPrices[0];
    const fastGas = blockPrices?.estimatedPrices[2];
    const standardGas = blockPrices?.estimatedPrices[3];
    const gasMapping = {
      instantGas: instantGas,
      fastGas: fastGas,
      standardGas: standardGas,
    };

    data["ethPrice"] = ethPrice;
    data["currencyPrices"] = { ethPrice, usdcPrice, usdtPrice };
    data["gasMapping"] = gasMapping;

    return data;
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = getCoinsGasData;
