const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")


const collectionItemsRoute = express()

collectionItemsRoute.get('/:address', checkAuth, (req, res) => {

    const {address} = req.params
    const {sortBy, minAsk, maxAsk, attributes, tokenId} = req.query

    const filterUrl = encodeURI(getUrl(address, sortBy, minAsk, maxAsk, attributes, tokenId))


    async function getData(){
        try{
            let url = `https://api.reservoir.tools/tokens/v5?${filterUrl}&limit=50&includeTopBid=false&includeAttributes=false&includeQuantity=false&includeDynamicPricing=false&normalizeRoyalties=false`

            let data = await fetch(url, {
                headers: {
                    "x-api-key": '9a16bf8e-ec68-5d88-a7a5-a24044de3f38'
                }
            })
            data = (await data.json()).tokens

            res.json(data)
        }
        catch(err){
            console.log(err)
        }
    }
    getData()
})


const getUrl = (contractAddress, sort, minAsk, maxAsk, attributes, tokenId) => {


    let url = "";
    if(!tokenId || tokenId === "undefined"){
        url += `&collection=${contractAddress}`
        if(attributes && attributes !== "undefined"){
            attributes = replaceAll(attributes, "-", "&")
            attributes = replaceAll(attributes, ":", "=")
            attributes = replaceAll(attributes, " ", "+")

            url += `${attributes}`
        }
    }
    else{
        url += `&tokens=${contractAddress}:${tokenId}`
    }
    if(sort){
        switch(sort){
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
    if(minAsk && minAsk !== "undefined"){
        url = `${url}&minFloorAskPrice=${minAsk}`
    }
    if(maxAsk && maxAsk !== "undefined"){
        url = `${url}&maxFloorAskPrice=${maxAsk}`
    }


    return url || undefined
}


function replaceAll(text, busca, reemplaza) {
    while (text.toString().indexOf(busca) != -1)
        text = text.toString().replace(busca, reemplaza);
    return text;
}



module.exports = collectionItemsRoute







