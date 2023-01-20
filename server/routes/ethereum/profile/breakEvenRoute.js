const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")

const breakEvenRoute = express()

const royaltieMapping = {
    "opensea": 2.5,
    "x2y2": 0.5,
    "looksrare": 2,
}

breakEvenRoute.post("/", checkAuth, async (req, res)=> {
    
    const defaultCreatorFee = 0

    let { contractAddress, singleBuyPrice, gas, approvalFee, marketplace } = req.body

    let royaltiesData = await fetch(`https://api.gomu.co/rest/overview/contract?contractAddress=${contractAddress}&skipTraits=true`, {
        headers: {
            "gomu-api-key": "wO563s12FAkjYXoyqkrZ4rl03Rg9FZ7T"
        }
    })
    royaltiesData = (await royaltiesData.json()).data?.royalty
    const creatorRoyalties = royaltiesData[marketplace]?.percentage || royaltiesData["opensea"]?.percentage || defaultCreatorFee
    const royalties = royaltieMapping[marketplace]

    let calculation = (((singleBuyPrice  + gas + approvalFee) * 100) / (100 - (royalties + creatorRoyalties)));
    console.log(singleBuyPrice, gas, approvalFee, royalties, creatorRoyalties)

    calculation = (Math.ceil(calculation * 100000) / 100000.00000) * 1000000000000000000;

    res.json({calculation: calculation})
})


module.exports = breakEvenRoute