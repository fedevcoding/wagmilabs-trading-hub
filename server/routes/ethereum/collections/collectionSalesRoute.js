const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")
const Sales = require("../../../models/SalesModel")

const collectionSalesRoute = express()

collectionSalesRoute.get('/:address', checkAuth, (req, res) => {

    async function getSales() {
        try {
            const { address } = req.params

            if (!address) return res.status(400).json({ status: "error", ok: false, message: "Address is required" })
            // const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000) / 1000;

            const totalSales = (await Sales.findOne({ contractAddress: address }, { sales: { $slice: -2000 } })).sales

            res.status(200).json({ totalSales, status: "success", ok: true })
        }
        catch (e) {
            console.log(e)
            res.status(500).json({ error: e })
        }

    }
    getSales()
})

module.exports = collectionSalesRoute
