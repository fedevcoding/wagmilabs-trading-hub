const { isTeam } = require("../config/allowedAddresses");
const { client } = require("../config/db");

const insertStats = async ({ type, timestamp, source, address, ip_address, pass_type, extra_data }) => {
  const partOfTeam = isTeam(address);

  if (partOfTeam) return;
  await client
    .query(
      "INSERT INTO stats (type, timestamp, source, address, ip_address, pass_type, extra_data) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [type, timestamp, source, address, ip_address, pass_type, extra_data]
    )
    .catch(e => {
      console.log(e);
    });
};

module.exports = { insertStats };
