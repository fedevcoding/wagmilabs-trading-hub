const socketIO = require("socket.io");
const sendEthDataHandler = require("./handlers/sendEthData");
const { socketIpStatsHandler, socketIpStatsDisconnectHandler } = require("./handlers/ipStats");
const { handleSaleSocket } = require("./handlers/newSale");
const { handleFloorChangeSocket } = require("./handlers/newFloorChange");
const { handleListingSocket } = require("./handlers/newListing");
const { handleSnipeSocket } = require("./handlers/newSnipeUpdate");
const { CLIENT_URL } = require("../variables");

let users = {};
let idIps = {};
let timeSpent = {};

const getUsers = () => {
  return users;
};

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
  handleSaleSocket(socket);
  handleFloorChangeSocket(socket);
  handleListingSocket(socket);
  handleSnipeSocket(socket);
};

const onDisconnectSocket = async (id, userAddress) => {
  await socketIpStatsDisconnectHandler(id, userAddress, users, idIps, timeSpent);
};

module.exports = { initIo, getUsers };
