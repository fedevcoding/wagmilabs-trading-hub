const socketIO = require("socket.io");
const { CLIENT_URL } = require("../server");
const sendEthDataHandler = require("./handlers/sendEthData");
const { socketIpStatsHandler, socketIpStatsDisconnectHandler } = require("./handlers/ipStats");

let users = {};
let idIps = {};
let timeSpent = {};

const initIo = server => {
  const io = socketIO(server, {
    cors: {
      origin: CLIENT_URL,
    },
  });

  io.on("connection", socket => onConnection(socket));
  return io;
};

const onConnection = socket => {
  const { id } = socket;
  let userAddress = null;

  socket.on("disconnect", () => onDisconnectSocket(id, userAddress));

  sendEthDataHandler(socket);
  socketIpStatsHandler(socket, id, userAddress, users, idIps, timeSpent);

  //   socket.on("joinSales", collectionAddress => {
  //     const channel = `sales${collectionAddress}`;
  //     socket.join(channel);
  //   });

  //   socket.on("leaveSales", collectionAddress => {
  //     const channel = `sales${collectionAddress}`;
  //     socket.leave(channel);
  //   });
  //   socket.on("joinFloorChanges", collectionAddress => {
  //     const channel = `floorChanges-${collectionAddress}`;
  //     socket.join(channel);
  //   });

  //   socket.on("leaveFloorChanges", collectionAddress => {
  //     const channel = `floorChanges-${collectionAddress}`;
  //     socket.leave(channel);
  //   });

  //   socket.on("joinListings", collectionAddress => {
  //     const channel = `listings${collectionAddress}`;
  //     socket.join(channel);
  //   });

  //   socket.on("leaveListings", collectionAddress => {
  //     const channel = `listings${collectionAddress}`;
  //     socket.leave(channel);
  //   });

  //   socket.on("joinSnipeUpdates", accountAddress => {
  //     accountAddress = accountAddress?.toLowerCase();
  //     const channel = `snipeUpdates:${accountAddress}`;
  //     socket.join(channel);
  //   });

  //   socket.on("leaveSnipeUpdates", accountAddress => {
  //     accountAddress = accountAddress?.toLowerCase();
  //     const channel = `snipeUpdates:${accountAddress}`;
  //     socket.leave(channel);
  //   });
};

const onDisconnectSocket = async (id, userAddress) => {
  await socketIpStatsDisconnectHandler(id, userAddress, users, idIps, timeSpent);
};

module.exports = { initIo };
