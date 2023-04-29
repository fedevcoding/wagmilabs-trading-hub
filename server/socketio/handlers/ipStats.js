const { insertStats } = require("../../utils/utils");

const socketIpStatsHandler = (socket, id, userAddress, users, idIps, timeSpent) => {
  socket.on("join", data => {
    const { ip, address } = data;
    userAddress = address;
    timeSpent[id] = Date.now();

    const user = users[ip];
    users[ip] = user ? user + 1 : 1;
    idIps[id] = ip;
  });
};

const socketIpStatsDisconnectHandler = async (id, userAddress, users, idIps, timeSpent) => {
  const date = Date.now();
  const time = date - timeSpent[id];
  delete timeSpent[id];

  const ip = idIps[id];
  if (ip) {
    users[ip] = users[ip] - 1;
    if (users[ip] === 0) {
      delete users[ip];
    }
  }

  const timestamp = Date.now();
  if (!isNaN(time)) {
    await insertStats({
      type: "usage_time",
      address: userAddress,
      ip_address: ip,
      timestamp,
      pass_type: null,
      extra_data: time,
    });
  }
};

module.exports = { socketIpStatsHandler, socketIpStatsDisconnectHandler };
