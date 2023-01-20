const express = require("express")
const User = require("../../models/userModel.js")
const checkAuth = require("../../middleware/checkAuth")

const getWatchListRoute = express()

getWatchListRoute.post("/", checkAuth, async (req, res)=> {
    const {address, signature} = req.userDetails
    const {contract, type} = req.body
    if(!address){
        return res.status(400).json({message: "no address found"})
    }
    
    const user = await User.findOne({address, signature})
    
    if(type === "collection"){
        const watchListCollections = user.watchList.collectionWatchList

        if(watchListCollections.includes(contract)){
            res.status(200).json({includes: true})
        }
        else{
            res.status(200).json({includes: false})
        }   
    }
    if(type === "nft"){
        console.log("nft")
        const watchListNfts = user.watchList.nftWatchList
        
        if(watchListNfts.includes(contract)){
            res.status(200).json({includes: true})
        }
        else{
            res.status(200).json({includes: false})
        }   
    }

})


module.exports = getWatchListRoute