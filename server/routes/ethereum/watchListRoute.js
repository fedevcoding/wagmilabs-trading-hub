const express = require("express")
const User = require("../../models/userModel.js")
const checkAuth = require("../../middleware/checkAuth")

const watchListRoute = express()

watchListRoute.get("/", checkAuth, async (req, res)=> {
    const {address, signature} = req.userDetails
    if(!address){
        return res.status(400).json({message: "no address found"})
    }

    const user = await User.findOne({address, signature})

    const watchListCollections = user.watchList.collectionWatchList
    
    res.status(200).json({watchListCollections})
})


module.exports = watchListRoute