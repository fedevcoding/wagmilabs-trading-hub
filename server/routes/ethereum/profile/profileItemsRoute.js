const express = require("express")
const User = require("../../../models/userModel.js")
const checkAuth = require("../../../middleware/checkAuth")
// const {ZDK} = require("@zoralabs/zdk")

const profileItemsRoute = express()

profileItemsRoute.get("/", checkAuth, async (req, res)=> {

    const userAddress = req.userDetails.address



    // let moreInfo = await fetch(`https://eth-mainnet.g.alchemy.com/nft/v2/sIct87hLyULWBtGD7oHMLsQz2UHYfxV1/getNFTs?owner=${userAddress}&withMetadata=true`)
    // moreInfo = (await moreInfo.json()).ownedNfts


    let items = await fetch(`https://api.reservoir.tools/users/${userAddress}/tokens/v6?normalizeRoyalties=false&sortDirection=desc&limit=100&includeTopBid=false`, {
        headers: {
        "accept": "*/*",
        "x-api-key": "9fc22ad1-29da-4a2d-a977-327f6bf1926f" 
        }
    })
    items = (await items.json()).tokens
    
    const userCollections =  []
    // [...new Map(items.map(item =>
        // [item.token.collection.id, item.token.collection])).values()];

    res.json({items, userCollections})
})


module.exports = profileItemsRoute