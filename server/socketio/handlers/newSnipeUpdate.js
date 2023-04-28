const { socketIo } = require("../../server");

function newSnipeUpdate(accountAddress, data) {
  accountAddress = accountAddress?.toLowerCase();
  const channel = `snipeUpdates:${accountAddress}`;

  try {
    socketIo.sockets.to(channel).emit("snipeUpdates", data);
  } catch (e) {
    console.log(e);
  }
}

module.exports = newSnipeUpdate;
