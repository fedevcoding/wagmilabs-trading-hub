const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")

const collectionSalesRoute = express()

collectionSalesRoute.get('/:address', checkAuth, (req, res) => {
    const {address} = req.params
    const {continuation} = req.query
    let continuationFilter = continuation ? `&continuation=${continuation}` : ""

    async function getSales(){
        const salesData = await fetch(`https://api.reservoir.tools/collections/activity/v5?collection=${address}&limit=50&sortBy=eventTimestamp&includeMetadata=true&types=sale${continuationFilter}`)
        const salesApi = await salesData.json()

        const {activities, continuation} = salesApi


        res.status(200).json({activities, continuation, status: "success", ok: true})
    }
    getSales()
})

module.exports = collectionSalesRoute
