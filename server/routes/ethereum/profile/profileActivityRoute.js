const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")
const { execTranseposeAPI } = require("../../../services/externalAPI/transpose")

const profileActivityRoute = express()




profileActivityRoute.get("/", checkAuth, async (req, res)=> {

    const userAddress = req.userDetails.address

    const SQL = `WITH sales AS (
        SELECT *
        FROM (
            SELECT 
                CASE
                    WHEN buyer_address = '${userAddress}' THEN 'buy'
                    ELSE 'sale'
                END AS type,
            token_id, contract_address, timestamp, buyer_address  AS from_address, seller_address AS to_address, transaction_hASh, quantity, exchange_name AS marketplace, price, payment_token_address AS payment_token
    
    
            FROM ethereum.nft_sales
            WHERE buyer_address = '${userAddress}'
                OR seller_address = '${userAddress}'
        ) subq
    
    
        UNION
    
        SELECT *
        FROM (
            SELECT 
                CASE 
                    WHEN to_address = '${userAddress}' AND from_address IS NULL THEN 'mint'
                    WHEN from_address = '${userAddress}' AND to_address IS NULL THEN 'burn'
                    WHEN from_address = '${userAddress}' THEN 'send'
                    ELSE 'receive'
                END AS type,
                token_id, contract_address, timestamp, from_address AS from_address, to_address AS to_address, transaction_hASh, quantity,'' AS marketplace, 0 AS price, '0x0000000000000000000000000000000000000000' AS payment_token
            FROM ethereum.nft_transfers
            WHERE from_address = '${userAddress}'
                OR to_address = '${userAddress}'
        ) subq
    
    
        ORDER BY timestamp DESC
        LIMIT 20
    )
    SELECT
        type,
        token_id,
        contract_address,
        timestamp,
        from_address,
        to_address,
        transaction_hash,
        quantity,
        marketplace,
        CASE WHEN sales.type::text = 'mint' AND price = 0 THEN value / count ELSE price END AS price,
        payment_token
    FROM sales
    CROSS JOIN LATERAL (
        SELECT value
        FROM ethereum.transactions t
        WHERE t.transaction_hash = sales.transaction_hash) AS tx
    CROSS JOIN LATERAL (
        SELECT
            COUNT(transaction_hash) AS count
        FROM sales s
        WHERE s.transaction_hash = sales.transaction_hash) AS tx_count;`

    try{
        const onChainActivity = await execTranseposeAPI(SQL)

        res.json({ok: true, onChainActivity})
    }
    catch(e){
        res.status(400).json({ok: false})
    }

})


module.exports = profileActivityRoute