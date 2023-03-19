const express = require("express");
const checkAuth = require("../../../middleware/checkAuth");
const { execTranseposeAPI } = require("../../../services/externalAPI/transpose");

const profileCollectionsRoute = express();

profileCollectionsRoute.get("/", checkAuth, async (req, res) => {
  try {
    const userAddress = req.query?.address || req.userDetails?.address;

    if (!userAddress) throw new Error("Missing user address.");

    const { search, offset, limit } = req.query;

    const sql = `SELECT c.contract_address, c.name, c.image_url, SUM(nft_o.balance) AS amount 
        FROM ethereum.collections c 
        INNER JOIN ethereum.nft_owners nft_o 
        ON c.contract_address = nft_o.contract_address 
        WHERE nft_o.owner_address = '${userAddress}'
        AND c.name ILIKE '%${search && search}%'
        GROUP BY c.contract_address 
        ORDER BY c.last_refreshed DESC 
        OFFSET ${offset}
        LIMIT ${limit};`;

    const collections = await execTranseposeAPI(sql);

    res.status(200).json({ collections, ok: true });
  } catch (e) {
    console.log(e);
    res.status(400).json({ ok: false });
  }
});

module.exports = profileCollectionsRoute;
