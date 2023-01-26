const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")

const profileItemsRoute = express()


const RESERVOIR_API_KEY = "9fc22ad1-29da-4a2d-a977-327f6bf1926f" 



profileItemsRoute.get("/", checkAuth, async (req, res)=> {

    try{
        const userAddress = req.userDetails.address
        const {sortDirection, collection} = req.query

        console.log(collection)


        const filterCollectionQuery = collection && collection !== "undefined" ? `&collection=${collection}` : ""
    
        let items = await fetch(`https://api.reservoir.tools/users/${userAddress}/tokens/v6?normalizeRoyalties=false&sortDirection=${sortDirection}&limit=100&includeTopBid=false${filterCollectionQuery}`, {
            headers: {
            "accept": "*/*",
            "x-api-key": RESERVOIR_API_KEY
            }
        })
        items = (await items.json())?.tokens
        
        res.status(200).json({items, ok: true})
    }
    catch(e){
        res.status(400).json({ok: false, userCollections})
    }

})


module.exports = profileItemsRoute