const express = require("express")
require("dotenv").config()
const checkAuth = require("../../../middleware/checkAuth.js")
const { execTranseposeAPI } = require("../../../services/externalAPI/transpose.js")

const activityChartRoute = express()

activityChartRoute.get("/:contractAddress", checkAuth, async (req, res)=> {

    const {contractAddress} = req.params


    const query = `
    SELECT AVG(native_price) AS averagePrice, SUM(quantity) AS sales, SUM(native_price) AS volume, date_trunc('day', timestamp) AS day
    FROM ethereum.nft_sales
    WHERE contract_address = '${contractAddress}'
    GROUP BY day
    ORDER BY day DESC
    LIMIT 30`

    const data = await execTranseposeAPI(query)

    res.json(data)

})


module.exports = activityChartRoute