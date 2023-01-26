const express = require("express")
const checkAuth = require("../../middleware/checkAuth")
const User = require("../../models/userModel.js")

const watchlistCollectionsRoute = express()

watchlistCollectionsRoute.get('/', checkAuth, (req, res) => {

    const {address, signature} = req.userDetails

    async function getData(){
        
        if(!address){
            return res.status(400).json({message: "no address found"})
        }
        
        const user = await User.findOne({address, signature})
        
        const watchListCollections = user.watchList.collectionWatchList


        let contracts = ""
        for(let i = 0; i < watchListCollections.length; i++){
            if(i === 0) contracts += `contract=${watchListCollections[i]}`
            else contracts += `&contract=${watchListCollections[i]}`
        }
        let collectionData = []

        if(contracts.length !== 0){
            collectionData = await fetch(`https://api.reservoir.tools/collections/v5?${contracts}&includeTopBid=true&normalizeRoyalties=false&useNonFlaggedFloorAsk=false&sortBy=1DayVolume&limit=20`)
            collectionData = (await collectionData.json()).collections
        }

        res.json(collectionData)
    }
    getData()

})

module.exports = watchlistCollectionsRoute