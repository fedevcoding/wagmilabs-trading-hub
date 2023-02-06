const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")
const userBalancesRoute = express()
const { Network, Alchemy } = require("alchemy-sdk")

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY




const usdcContract = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const wethContract = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const usdtContract = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const settings = {
    apiKey: ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
    network: Network.ETH_MAINNET, // Replace with your network.
};
const alchemy = new Alchemy(settings);


userBalancesRoute.get("/", checkAuth, async (req, res) => {

    try {
        const { address } = req.userDetails

        let data = await alchemy.core.getTokenBalances(address, [usdcContract, wethContract, usdtContract])

        const { tokenBalances } = data

        const usdc = parseInt(tokenBalances[0]?.tokenBalance) / 1000000
        const weth = parseInt(tokenBalances[1]?.tokenBalance) / 1000000000000000000
        const usdt = parseInt(tokenBalances[2]?.tokenBalance) / 1000000

        res.json({ usdc, weth, usdt })
    }
    catch (e) {
        res.status(500).json({ error: e })
    }


})


module.exports = userBalancesRoute