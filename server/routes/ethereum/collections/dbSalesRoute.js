const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")
const Listings = require("../../../models/ListingsModel")

const dbSalesRoute = express()

dbSalesRoute.get('/:address', (req, res) => {

    async function getSales() {
        try {
            const { address } = req.params

            console.time("start")
            const activity = await Listings.findOne({ contractAddress: address }, { "listings": { $slice: -2500 } }).lean()

            console.timeEnd("start")

            console.log(activity.listings.length)
            res.json(activity)

        }
        catch (e) {
            console.log(e)
            res.status(500).json({ error: e })
        }

    }
    getSales()
})

module.exports = dbSalesRoute
