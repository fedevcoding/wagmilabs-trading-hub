const express = require("express")
const { execReservoirApi } = require("../../../services/externalAPI/reservoirApi")

const searchCollectionsRoute = express()

searchCollectionsRoute.get('/:query/:type', (req, res) => {
    const {query, type} = req.params

    if(!query || !type) return res.status(400).json({status: "error", ok: false, message: "Missing query or type"})

    async function getListings(){

        try{
            let url
    
            if(type === "name") url = `https://api.reservoir.tools/search/collections/v1?name=${query}&limit=5`
            else if(type === "contract") url = `https://api.reservoir.tools/collections/v5?id=${query}&includeTopBid=false&includeAttributes=false&includeOwnerCount=false&normalizeRoyalties=false&useNonFlaggedFloorAsk=false&sortBy=allTimeVolume&limit=1`
    
            const data = await execReservoirApi(url, true)
            const {collections} = data
    
            res.status(200).json({collections, status: "success", ok: true})
        }
        catch(e){
            console.log(e)
            res.status(400).json({error: e, status: "error", ok: false})
        }

    }
    getListings()
})

module.exports = searchCollectionsRoute
