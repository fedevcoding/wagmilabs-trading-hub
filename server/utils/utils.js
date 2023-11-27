const { isTeam } = require("../config/allowedAddresses");
const { client } = require("../config/db");
const { plan_type, stats_type } = require("@prisma/client");
const crypto = require("crypto");

const insertStats = async ({ type, timestamp, source, address, ip_address, pass_type, extra_data }) => {
  const partOfTeam = isTeam(address);
  if (partOfTeam) return;

  let plan = null;
  if (pass_type === 0) plan = plan_type.founder_pass;
  if (pass_type === 1) plan = plan_type.pro;
  if (pass_type === 2) plan = plan_type.pro;
  if (pass_type === 3) plan = plan_type.free;
  if (pass_type === 4) plan = plan_type.partnership;
  if (pass_type === 5) plan = plan_type.free;

  type = stats_type[type] ?? null;

  await client.query(
    "INSERT INTO stat (type, timestamp, source, address, ip_address, plan_type, extra_data, id) SELECT $1, $2, $3, $4, $5, $6, $7, $8 WHERE NOT EXISTS (SELECT 1 FROM stat WHERE address = $4 AND type = $1)",
    [type, new Date(parseInt(timestamp)), source, address, ip_address, plan, extra_data?.toString(), crypto.randomUUID()]
  )
    .catch(e => {
      console.log(e);
    });

  console.log("inserted stats");
};

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const IS_DEV = process.env.NODE_ENV === "development";

module.exports = { insertStats, wait, IS_DEV };
