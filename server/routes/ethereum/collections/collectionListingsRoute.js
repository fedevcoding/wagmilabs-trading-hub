const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")

const collectionListingsRoute = express()

collectionListingsRoute.get('/:address', checkAuth, (req, res) => {


    async function getListings() {

        try {
            const { address } = req.params

            if (!address) return res.status(400).json({ status: "error", ok: false, message: "Address is required" })

            const { continuation: requestContinuation } = req.query
            let continuationFilter = requestContinuation ? `&continuation=${requestContinuation}` : ""

            const listingsData = await fetch(`https://api.reservoir.tools/orders/asks/v4?contracts=${address}&native=false&includePrivate=false&includeCriteriaMetadata=true&normalizeRoyalties=false&sortBy=createdAt&limit=50${continuationFilter}`)
            if (!listingsData.ok) return res.status(500).json({ status: "error", ok: false, message: "Error fetching listings" })
            const listingsApi = await listingsData.json()

            const { orders, continuation } = listingsApi

            res.status(200).json({ orders, continuation, status: "success", ok: true })
        }
        catch (e) {
            res.status(500).json({ error: e })
        }
    }
    getListings()
})

module.exports = collectionListingsRoute
