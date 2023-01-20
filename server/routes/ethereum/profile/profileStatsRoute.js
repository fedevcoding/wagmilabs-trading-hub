const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")

const profileStatsRoute = express()

profileStatsRoute.get("/:address", checkAuth, async (req, res)=> {

    const {address} = req.params
    
    let data = await fetch(`https://api.upshot.xyz/v2/wallets/${address}/stats`, {
        headers: {
            "x-api-key": "UP-39ef673e560bde0b20e95358"
        }
    })
    data = (await data.json()).data
    const {num_txs, num_assets_owned, num_collections_owned, total_gain, volume} = data
    const nftsValue = data?.portfolio_value_wei / 1000000000000000000
    const walletVolume = data?.volume / 1000000000000000000


    let data2 = await fetch(`https://restapi.nftscan.com/api/v2/statistics/overview/${address}`, {
        headers: {
            "X-API-KEY": 'ie1N5GckxvwErhgZ4MVnwr2S'
        }
    })

    data2 = (await data2.json()).data
    const {mint_count, sold_count, bought_count, sold_value} = data2



    const returnData = {num_txs, num_assets_owned, num_collections_owned, total_gain, volume, nftsValue, walletVolume, mint_count, sold_count, bought_count, sold_value}


    res.json(returnData)
})


module.exports = profileStatsRoute