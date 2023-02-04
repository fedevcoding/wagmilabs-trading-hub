const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")

const collectionListingsRoute = express()

collectionListingsRoute.get('/:address', checkAuth, (req, res) => {
    const {address} = req.params
    const {continuation} = req.query
    let continuationFilter = continuation ? `&continuation=${continuation}` : ""

    async function getListings(){
        const listingsData = await fetch(`https://api.reservoir.tools/orders/asks/v4?contracts=${address}&native=false&includePrivate=false&includeCriteriaMetadata=true&normalizeRoyalties=false&sortBy=createdAt&limit=50${continuationFilter}`)
        const listingsApi = await listingsData.json()

        const {orders, continuation} = listingsApi


        res.status(200).json({orders, continuation, status: "success", ok: true})
    }
    getListings()
})

module.exports = collectionListingsRoute
