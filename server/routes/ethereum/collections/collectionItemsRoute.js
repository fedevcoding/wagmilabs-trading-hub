const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")


const collectionItemsRoute = express()

const RESERVOIR_API_KEY = process.env.RESERVOIR_API_KEY

collectionItemsRoute.get('/:address', checkAuth, (req, res) => {

    async function getData() {
        try {

            const { address } = req.params
            const { sortBy, minAsk, maxAsk, attributes, tokenId, continuation: reqContinuation } = req.query

            const filterUrl = getUrl(address, sortBy, minAsk, maxAsk, attributes, tokenId, reqContinuation)

            let url = `https://api.reservoir.tools/tokens/v5?${filterUrl}&limit=50&includeTopBid=false&includeAttributes=false&includeQuantity=false&includeDynamicPricing=false&normalizeRoyalties=false`

            let data = await fetch(url, {
                headers: {
                    "x-api-key": RESERVOIR_API_KEY
                }
            })

            if (!data.ok) throw new Error("Error fetching data")
            data = await data.json()

            const { tokens, continuation } = data

            res.json({ tokens, continuation })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ error: err })
        }
    }
    getData()
})


const getUrl = (contractAddress, sort, minAsk, maxAsk, attributes, tokenId, continuation) => {

    try {
        let url = "";
        if (!tokenId || tokenId === "undefined") {
            url += `&collection=${contractAddress}`
            if (attributes && attributes !== "undefined") {
                attributes = replaceAll(attributes, "-", "&")
                attributes = replaceAll(attributes, ":", "=")
                attributes = replaceAll(attributes, " ", "+")

                url += `${attributes}`
            }
        }
        else {
            url += `&tokens=${contractAddress}:${tokenId}`
        }
        if (sort) {
            switch (sort) {
                case "p-lth":
                    url += "&sortBy=floorAskPrice&sortDirection=asc";
                    break;
                case "p-htl":
                    url += "&sortBy=floorAskPrice&sortDirection=desc";
                    break;
                case "t-lth":
                    url += "&sortBy=tokenId&sortDirection=asc";
                    break;
                case "t-htl":
                    url += "&sortBy=tokenId&sortDirection=desc";
                    break;
                case "r-lth":
                    url += "&sortBy=rarity&sortDirection=desc";
                    break;
                case "r-htl":
                    url += "&sortBy=rarity&sortDirection=asc";
                    break;
            }
        }
        if (minAsk && minAsk !== "undefined") {
            url = `${url}&minFloorAskPrice=${minAsk}`
        }
        if (maxAsk && maxAsk !== "undefined") {
            url = `${url}&maxFloorAskPrice=${maxAsk}`
        }
        if (continuation && continuation !== "undefined") {
            url = `${url}&continuation=${continuation}`
        }


        return url || undefined
    }
    catch (e) {
        return ""
    }
}


function replaceAll(text, busca, reemplaza) {
    try {
        while (text.toString().indexOf(busca) != -1)
            text = text.toString().replace(busca, reemplaza);
        return text;
    }
    catch (e) {
        return ""
    }
}



module.exports = collectionItemsRoute







