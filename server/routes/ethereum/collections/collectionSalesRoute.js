const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")

const collectionSalesRoute = express()

collectionSalesRoute.get('/:address', checkAuth, (req, res) => {

    async function getSales() {
        try {
            const { address } = req.params

            if (!address) return res.status(400).json({ status: "error", ok: false, message: "Address is required" })

            const { continuation: requestContinuation } = req.query
            let continuationFilter = requestContinuation ? `&continuation=${requestContinuation}` : ""

            const salesData = await fetch(`https://api.reservoir.tools/collections/activity/v5?collection=${address}&limit=50&sortBy=eventTimestamp&includeMetadata=true&types=sale${continuationFilter}`)
            if (!salesData.ok) return res.status(500).json({ status: "error", ok: false, message: "Error fetching sales" })
            const salesApi = await salesData.json()

            const { activities, continuation } = salesApi


            res.status(200).json({ activities, continuation, status: "success", ok: true })
        }
        catch (e) {
            res.status(500).json({ error: e })
        }

    }
    getSales()
})

module.exports = collectionSalesRoute
