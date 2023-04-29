const { getSocket } = require("../../server");

function newSnipeUpdate(accountAddress, data) {
  try {
    const socketIo = getSocket();
    accountAddress = accountAddress?.toLowerCase();
    const channel = `snipeUpdates:${accountAddress}`;
    socketIo.sockets.to(channel).emit("snipeUpdates", data);
  } catch (e) {
    console.log(e);
  }
}

function handleSnipeSocket(socket) {
  socket.on("joinSnipeUpdates", accountAddress => {
    accountAddress = accountAddress?.toLowerCase();
    const channel = `snipeUpdates:${accountAddress}`;
    socket.join(channel);
  });

  socket.on("leaveSnipeUpdates", accountAddress => {
    accountAddress = accountAddress?.toLowerCase();
    const channel = `snipeUpdates:${accountAddress}`;
    socket.leave(channel);
  });
}

module.exports = { newSnipeUpdate, handleSnipeSocket };
