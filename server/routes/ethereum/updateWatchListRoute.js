const express = require("express")
const User = require("../../models/userModel")
const checkAuth = require("../../middleware/checkAuth")


const updateWatchListRoute = express()

updateWatchListRoute.post('/', checkAuth, async (req, res) => {

    const {type, collectionAddress, method} = req.body

    const address = req.userDetails.address
    const signature = req.userDetails.signature


    try{
        const user = await User.findOne({address, signature})
        if(method === "add"){
            if(type === "collection"){
                user.watchList.collectionWatchList.push(collectionAddress.toLowerCase())
                await user.save()
            }
            else if(type === "nft"){
                user.watchList.nftWatchList.push(collectionAddress.toLowerCase())
                await user.save()
            }
            else if(type === "address"){
                user.watchList.addressWatchList.push(collectionAddress.toLowerCase())
                await user.save()
            }
            res.status(200).json({message: `${type} added to watchlist`, status: "ok"})
        }
        else if(method === "remove"){
            if(type === "collection"){
                user.watchList.collectionWatchList.pull(collectionAddress)
                await user.save()
            }
            else if(type === "nft"){
                user.watchList.nftWatchList.pull(collectionAddress)
                await user.save()
            }
            else if(type === "address"){
                user.watchList.addressWatchList.pull(collectionAddress)
                await user.save()
            }
            res.status(200).json({message: `${type} removed from watchlist`, status: "ok"})
        }
    }
    catch(err){
        console.log(err)
        res.status(400).json({message: "failed to add watchlist", status: "error"})
    }

})

module.exports = updateWatchListRoute
