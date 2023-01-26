const express = require("express")
const checkAuth = require("../../middleware/checkAuth")


const ownedCollectionsRoute = express()

ownedCollectionsRoute.get('/', checkAuth, (req, res) => {

    const {address} = req.userDetails

    async function getData(){

        let data = await fetch(`https://api.reservoir.tools/users/${address}/collections/v2?includeTopBid=true&includeLiquidCount=true&offset=0&limit=100`, {
            headers: {
                'x-api-key': '9a16bf8e-ec68-5d88-a7a5-a24044de3f38'
            }
        })
        data = (await data.json()).collections

        res.json(data)
    }
    getData()

})

module.exports = ownedCollectionsRoute