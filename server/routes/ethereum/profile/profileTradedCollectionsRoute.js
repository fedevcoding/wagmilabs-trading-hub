const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")
const { execTranseposeAPI } = require("../../../services/externalAPI/transpose")

const profileTradedCollectionsRoute = express()


profileTradedCollectionsRoute.get("/", checkAuth, async (req, res)=> {

    try{
        const userAddress = req.userDetails.address
        const {search, offset, limit} = req.query

        const sql = `WITH contracts AS (
            SELECT contract_address
            FROM ethereum.nft_sales
            WHERE (buyer_address = '${userAddress}'
            OR seller_address = '${userAddress}')
        
            UNION
        
            SELECT contract_address
            FROM ethereum.nft_transfers
            WHERE (from_address = '${userAddress}')
        )
        SELECT *
        FROM contracts
        CROSS JOIN LATERAL (
            SELECT name, image_url
            FROM ethereum.collections c
            WHERE c.contract_address = contracts.contract_address
        ) AS contract
        WHERE name ILIKE '%%${search}%%'
        LIMIT ${limit}
        OFFSET ${offset}
        `

        const collections = await execTranseposeAPI(sql)

        res.status(200).json({collections, ok: true})
    }
    catch(e){
        console.log(e)
        res.status(400).json({ok: false, userCollections})
    }

})


module.exports = profileTradedCollectionsRoute