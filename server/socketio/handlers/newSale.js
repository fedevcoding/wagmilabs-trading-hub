const { getSocket } = require("../../server");

function newSale(saleData) {
  try {
    const socketIo = getSocket();
    const { tokenAddress } = saleData;
    const contractAddress = tokenAddress?.toLowerCase();
    const channel = `sales:${contractAddress}`;
    socketIo.sockets.to(channel).emit("sale", saleData);
  } catch (e) {
    console.log(e);
  }
}

function handleSaleSocket(socket) {
  socket.on("joinSales", collectionAddress => {
    const channel = `sales:${collectionAddress}`;
    socket.join(channel);
  });

  socket.on("leaveSales", collectionAddress => {
    const channel = `sales:${collectionAddress}`;
    socket.leave(channel);
  });
}

module.exports = { newSale, handleSaleSocket };
