const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")

const searchCollectionsRoute = express()

searchCollectionsRoute.get('/:query/:type', checkAuth, (req, res) => {
    const {query, type} = req.params

    async function getListings(){

        let collections;

        if(type === "name"){
            collections = await fetch(`https://api.reservoir.tools/search/collections/v1?name=${query}&limit=6`)
            collections = (await collections.json()).collections
            collections = collections.filter(collection => collection.collectionId !== "0x495f947276749ce646f68ac8c248420045cb7b5e")
        }
        else if(type === "contract"){
            collections = await fetch(`https://api.reservoir.tools/collections/v5?id=${query}&includeTopBid=false&includeAttributes=false&includeOwnerCount=false&normalizeRoyalties=false&useNonFlaggedFloorAsk=false&sortBy=allTimeVolume&limit=1`)
            collections = (await collections.json()).collections
            collections[0].collectionId = query

        }

        res.status(200).json({collections, status: "success", ok: true})
    }
    getListings()
})

module.exports = searchCollectionsRoute
