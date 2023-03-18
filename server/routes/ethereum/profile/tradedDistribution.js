const express = require("express");
const checkAuth = require("../../../middleware/checkAuth");
const { execTranseposeAPI } = require("../../../services/externalAPI/transpose");

const route = express();

route.get("/", checkAuth, async (req, res) => {
  try {
    const userAddress = req.userDetails.address; // "0x62fBD7F8D0668161710A0b463FD004cba42DA050"
    const { days = "30" } = req.query;

    const today = new Date();
    const nDaysAgo = new Date(today);
    nDaysAgo.setDate(today.getDate() - parseInt(days));
    const timestamp = nDaysAgo.toISOString();

    async function getNftDistribution() {
      const query = `
        SELECT tx.mint_tx_price as price, transfer.contract_address as address, 
        CONCAT('', transfer.token_id) as token_id, transfer.timestamp, 'mint' as type
        FROM (
            SELECT (max(t.value) / count(token_id)) as mint_tx_price, transfer.contract_address, transfer.transaction_hash as minted_transaction_hash
            FROM ethereum.nft_transfers transfer
            INNER JOIN ethereum.transactions t ON t.transaction_hash = transfer.transaction_hash
            WHERE transfer.to_address = '${userAddress}' and transfer.category = 'mint' AND transfer.timestamp > '${timestamp}'
            group by transfer.transaction_hash, transfer.contract_address
        ) tx
        INNER JOIN ethereum.nft_transfers transfer ON transfer.contract_address = tx.contract_address AND 
            transfer.transaction_hash = tx.minted_transaction_hash AND transfer.to_address = '${userAddress}' and transfer.category = 'mint' AND transfer.timestamp > '${timestamp}'
        UNION ALL
        SELECT eth_price as price, contract_address as address, CONCAT('', token_id) as token_id,  timestamp, 'bought' as type
                FROM ethereum.nft_sales
                WHERE buyer_address = '${userAddress}' AND timestamp > '${timestamp}'
        UNION ALL
        SELECT eth_price as price, contract_address as address, CONCAT('', token_id) as token_id,  timestamp, 'sold' as type
                FROM ethereum.nft_sales
                WHERE seller_address = '${userAddress}' AND timestamp > '${timestamp}'
        `;

      const nfts = await execTranseposeAPI(query);

      res.status(200).json({ nfts: nfts, ok: true });
    }
    getNftDistribution();
  } catch (e) {
    res.status(400).json({ ok: false, userCollections });
  }
});

module.exports = route;
