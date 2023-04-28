const { socketIo } = require("../../server");

function newFloorChange(floorChangeData) {
  try {
    const { contractAddress } = floorChangeData;
    const lowerContractAddress = contractAddress?.toLowerCase();
    const channel = `floorChanges-${lowerContractAddress}`;
    socketIo.sockets.to(channel).emit("floor_change", floorChangeData);
  } catch (e) {
    console.log(e);
  }
}

module.exports = newFloorChange;
