const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")

const profileCollectionsRoute = express()


profileCollectionsRoute.get("/", checkAuth, async (req, res)=> {

    try{
        const userAddress = req.userDetails.address
        console.log(userAddress)
        const {search, offset, limit} = req.query

        console.log(search, offset, limit)
    
        let collections = await fetch("https://api.transpose.io/sql", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': 'C4fApvFQlRelzwhzM0BW7loRbVPLt3E9',
            },
            body: JSON.stringify({
                sql: `SELECT c.contract_address, c.name, c.image_url, SUM(nft_o.balance) AS amount 
                FROM ethereum.collections c 
                INNER JOIN ethereum.nft_owners nft_o 
                ON c.contract_address = nft_o.contract_address 
                WHERE nft_o.owner_address = '${userAddress}'
                AND c.name ILIKE '%${search && search}%'
                GROUP BY c.contract_address 
                ORDER BY c.last_refreshed DESC 
                OFFSET ${offset}
                LIMIT ${limit};`
            })
        })
        
        collections = await collections.json()
        
        res.status(200).json({collections, ok: true})
    }
    catch(e){
        console.log(e)
        res.status(400).json({ok: false, userCollections})
    }

})


module.exports = profileCollectionsRoute