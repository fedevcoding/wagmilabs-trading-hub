const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")
const Listings = require("../../../models/ListingsModel")

const collectionListingsRoute = express()

collectionListingsRoute.get('/:address', (req, res) => {

    async function getListings() {
        try {
            const { address } = req.params

            if (!address) return res.status(400).json({ status: "error", ok: false, message: "Address is required" })
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000) / 1000;

            console.time("start")
            const totalListings = (await Listings.findOne({ contractAddress: address.toLowerCase() }))?.listings || []
            console.timeEnd("start")
            res.status(200).json({ totalListings: totalListings, status: "success", ok: true })
        }
        catch (e) {
            console.log(e)
            res.status(500).json({ error: e })
        }

    }
    getListings()
})

module.exports = collectionListingsRoute
