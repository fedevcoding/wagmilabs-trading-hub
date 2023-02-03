const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")


const collectionInfoRoute = express()

collectionInfoRoute.get('/:address', checkAuth, (req, res) => {

    const {address} = req.params

    async function getData(){
        try{
            const dataApi = await fetch(`https://api.reservoir.tools/collections/v5?id=${address}&includeTopBid=true&includeAttributes=false&includeOwnerCount=false&includeSalesCount=false&normalizeRoyalties=false`, {
                headers: {
                    "x-api-key": '9a16bf8e-ec68-5d88-a7a5-a24044de3f38'
                }
            })
            const data = (await dataApi.json()).collections[0]

            const attributesApi = await fetch(`https://api.reservoir.tools/collections/${address}/attributes/all/v2`)
            const attributes = await attributesApi.json()

            data["attributes"] = attributes.attributes
            res.json(data)
        }
        catch(err){
            console.log(err)
        }
    }
    getData()
})

module.exports = collectionInfoRoute

