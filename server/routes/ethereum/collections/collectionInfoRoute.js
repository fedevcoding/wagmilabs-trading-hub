const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")


const collectionInfoRoute = express()

collectionInfoRoute.get('/:address', checkAuth, (req, res) => {

    async function getData(){
        try{
            let data = await fetch(`https://api.reservoir.tools/collections/v5?id=${req.params.address}&includeTopBid=true&includeAttributes=false&includeOwnerCount=false&includeSalesCount=false&normalizeRoyalties=false`, {
                headers: {
                    "x-api-key": '9a16bf8e-ec68-5d88-a7a5-a24044de3f38'
                }
            })
            data = (await data.json()).collections[0]

            res.json(data)
        }
        catch(err){
            console.log(err)
        }
    }
    getData()
})

module.exports = collectionInfoRoute

