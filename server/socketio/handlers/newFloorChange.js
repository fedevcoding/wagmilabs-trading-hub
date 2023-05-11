const { getSocket } = require("../../server");

function newFloorChange(floorChangeData) {
  try {
    const socketIo = getSocket();
    const { contractAddress } = floorChangeData;
    const lowerContractAddress = contractAddress?.toLowerCase();
    const channel = `floorChanges:${lowerContractAddress}`;
    socketIo.sockets.to(channel).emit("floor_change", floorChangeData);
  } catch (e) {
    console.log(e);
  }
}

function handleFloorChangeSocket(socket) {
  socket.on("joinFloorChanges", collectionAddress => {
    const channel = `floorChanges:${collectionAddress}`;
    socket.join(channel);
  });

  socket.on("leaveFloorChanges", collectionAddress => {
    const channel = `floorChanges:${collectionAddress}`;
    socket.leave(channel);
  });
}

module.exports = { newFloorChange, handleFloorChangeSocket };
