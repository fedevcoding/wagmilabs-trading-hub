const express = require("express")
const fetch = require("node-fetch")
const checkAuth = require("../../../middleware/checkAuth")


const chartRoute = express()

chartRoute.get('/:slug/:order', checkAuth, (req, res) => {
    fetch(`https://api.nftinit.io/api/chart/?password=Gunah4423_&slug=${req.params.slug}&type=${req.params.order}`)
    .then(data => data.json())
    .then(data => res.json({data}))
})

module.exports = chartRoute
