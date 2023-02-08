const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")
const Sales = require("../../../models/ListingsModel")

const dbSalesRoute = express()

dbSalesRoute.get('/:address', (req, res) => {

    // async function getSales() {
    //     try {
    //         const { address } = req.params

    //         console.time("start")
    //         // const sales = await Sales.find({ contractAddress: address })


    //         const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000) / 1000;
    //         const sales = await Sales.aggregate([
    //             {
    //                 $match: {
    //                     contractAddress: address,
    //                     // timestamp: { $gt: fiveMinutesAgo }
    //                 },
    //             },
    //             // {
    //             //     // $limit: 10
    //             // }
    //         ])
    //         console.timeEnd("start")
    //         res.json(sales)

    //     }
    //     catch (e) {
    //         console.log(e)
    //         res.status(500).json({ error: e })
    //     }

    // }
    // getSales()
})

module.exports = dbSalesRoute
