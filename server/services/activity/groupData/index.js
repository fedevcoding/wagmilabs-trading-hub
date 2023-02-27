const last24h = require("./24h");
const last7d = require("./7d");
const last30d = require("./30d");
const last3m = require("./3m");
const last1y = require("./1y");
const allTime = require("./all");

module.exports = {
  ...last24h,
  ...last7d,
  ...last30d,
  ...last3m,
  ...last1y,
  ...allTime,
};
