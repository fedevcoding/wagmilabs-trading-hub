const { socketIo } = require("../../server");

function newSale(saleData) {
  try {
    const { tokenAddress } = saleData;
    const contractAddress = tokenAddress?.toLowerCase();
    const channel = `sales${contractAddress}`;
    socketIo.sockets.to(channel).emit("sale", saleData);
  } catch (e) {
    console.log(e);
  }
}

module.exports = newSale;
