const express = require("express")
const checkAuth = require("../../middleware/checkAuth")
const User = require("../../models/userModel.js")
const { execReservoirApi } = require("../../services/externalAPI/reservoirApi")

const watchlistCollectionsRoute = express()

watchlistCollectionsRoute.get('/', checkAuth, (req, res) => {

    const {address, signature} = req.userDetails || {}

    if(!address || !signature){
        return res.status(400).json({message: "no address found"})
    }

    async function getData(){
        try{
            const user = await User.findOne({address, signature})

            if(!user) return res.status(400).json({message: "no user found"})
            
            const dbWatchListCollections = user?.watchList?.collectionWatchList
    
    
            let contracts = ""

            let loopingLength = dbWatchListCollections.length
            if(dbWatchListCollections.length > 20) loopingLength = 20

            for(let i = 0; i < loopingLength; i++){
                if(i === 0) contracts += `contract=${dbWatchListCollections[i]}`
                else contracts += `&contract=${dbWatchListCollections[i]}`
            }
            

            let collectionData;
    
            if(contracts.length !== 0){
                const url = `https://api.reservoir.tools/collections/v5?${contracts}&includeTopBid=true&normalizeRoyalties=false&useNonFlaggedFloorAsk=false&sortBy=1DayVolume&limit=20`
                collectionData = await execReservoirApi(url)
            }

            const {collections: watchListCollections} = collectionData || {}
    
            res.json({watchListCollections})

        }
        catch(e){
            console.log(e)
            res.status(400).json({error: e})
        }
    }
    getData()

})

module.exports = watchlistCollectionsRoute