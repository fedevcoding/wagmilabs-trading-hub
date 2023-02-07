const express = require("express")
const User = require("../../models/userModel.js")
const checkAuth = require("../../middleware/checkAuth")

const getWatchListRoute = express()

getWatchListRoute.get("/", checkAuth, async (req, res) => {

    try {
        const { address } = req.userDetails
        const { collectionAddress } = req.query

        const contract = collectionAddress.toLowerCase()

        const user = await User.findOne({ address })

        if (!user) throw new Error("User not found")

        const watchListCollections = user.watchList.collectionWatchList

        if (watchListCollections.includes(contract)) {
            res.status(200).json(true)
        }
        else {
            res.status(200).json(false)
        }
    }
    catch (e) {
        res.status(400).json({ error: e, status: "error" })
    }

})


module.exports = getWatchListRoute