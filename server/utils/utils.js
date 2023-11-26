const { isTeam } = require("../config/allowedAddresses");
const { client } = require("../config/db");

const insertStats = async ({ type, timestamp, source, address, ip_address, pass_type, extra_data }) => {
  const partOfTeam = isTeam(address);

  if (partOfTeam) return;
  await client
    .query(
      "INSERT INTO stats (type, timestamp, source, address, ip_address, pass_type, extra_data) SELECT $1, $2, $3, $4, $5, $6, $7 WHERE NOT EXISTS (SELECT 1 FROM stats WHERE address = $4 AND type = $1)",
      [type, timestamp, source, address, ip_address, pass_type, extra_data]
    )
    .catch(e => {
      console.log(e);
    });
};

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const IS_DEV = process.env.NODE_ENV === "development";

module.exports = { insertStats, wait, IS_DEV };
