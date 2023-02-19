const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")

const Stats = require("../../../models/StatsModel")


const UPSHOT_API_KEY = process.env.UPSHOT_API_KEY
const NFTSCAN_API_KEY = process.env.NFTSCAN_API_KEY



const profileStatsRoute = express()

profileStatsRoute.get("/:address", checkAuth, async (req, res) => {

    const { address } = req.params || {}

    if (!address) {
        res.status(400).json({ message: "There was a problem fetching the data", ok: false })
    }
    else {

        await Stats.create({ type: "profileStats", timestamp: Date.now(), address })

        try {
            let data = await fetch(`https://api.upshot.xyz/v2/wallets/${address}/stats`, {
                headers: {
                    "x-api-key": UPSHOT_API_KEY
                }
            })

            data = (await data.json())?.data
            const { num_txs, num_assets_owned, num_collections_owned, total_gain, volume } = data || {}
            const nftsValue = data?.portfolio_value_wei / 1000000000000000000
            const walletVolume = data?.volume / 1000000000000000000


            let data2 = await fetch(`https://restapi.nftscan.com/api/v2/statistics/overview/${address}`, {
                headers: {
                    "X-API-KEY": NFTSCAN_API_KEY
                }
            })
            data2 = (await data2.json())?.data

            const { mint_count, sold_count, bought_count, sold_value } = data2 || {}



            const returnData = { num_txs, num_assets_owned, num_collections_owned, total_gain, volume, nftsValue, walletVolume, mint_count, sold_count, bought_count, sold_value }


            res.status(200).json({ ok: true, data: returnData })
        }
        catch (e) {
            console.log(e)
            res.status(400).json({ message: "There was a problem fetching the data", ok: false, error: e })
        }
    }


})


module.exports = profileStatsRoute