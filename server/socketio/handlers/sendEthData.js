const { getEthGasData } = require("../../services/gasData/gasData");

const sendEthDataHandler = socket => {
  socket.on("getEthData", () => {
    const ethData = getEthGasData();
    socket.emit("ethData", ethData);
  });
  setInterval(() => {
    const ethData = getEthGasData();
    socket.emit("ethData", ethData);
  }, 10000);
};

module.exports = sendEthDataHandler;
